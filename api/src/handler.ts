import Anthropic from '@anthropic-ai/sdk';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { CONCIERGE_SYSTEM, FAREWELL_INSTRUCTION, GOODBYE_REPLY, VERDICT_SYSTEM } from './prompts';
import { claim, visitorIp } from './usage';
import { MAX_CHAT_REPLIES, parseRequest, type ConciergeRequest } from './validate';

const MODEL = process.env.CLAUDE_MODEL ?? 'claude-sonnet-5-5';
// DynamoDB table that counts Claude calls. Unset in local runs, where only the browser's count applies.
const USAGE_TABLE = process.env.USAGE_TABLE;
/** Claude calls allowed per day across all visitors, as a hard ceiling on spend. */
const DAILY_LIMIT = Number(process.env.DAILY_CLAUDE_LIMIT) || 500;
/** Application verdicts per visitor per day. */
const MAX_VERDICTS = 3;
/** countCall's answer when the site-wide daily ceiling is reached. */
const BUSY = -1;

let client: Anthropic | undefined;

// The API key lives in SSM Parameter Store (SecureString) and is read once per cold start.
async function getClient(): Promise<Anthropic> {
  if (client) return client;
  let apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const ssm = new SSMClient({});
    const res = await ssm.send(
      new GetParameterCommand({ Name: process.env.ANTHROPIC_KEY_PARAM, WithDecryption: true }),
    );
    apiKey = res.Parameter?.Value;
  }
  client = new Anthropic({ apiKey, maxRetries: 1, timeout: 20_000 });
  return client;
}

const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  body: JSON.stringify(body),
});

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (event.requestContext.http.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  let raw: unknown;
  try {
    const text = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString() : event.body;
    if ((text?.length ?? 0) > 16_000) return json(413, { error: 'too_large' });
    raw = JSON.parse(text ?? '');
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const req = parseRequest(raw);
  if (!req) return json(400, { error: 'invalid_request' });

  // Jasmin answers MAX_CHAT_REPLIES messages per visitor, the last one with a rude goodbye, then stops calling
  // Claude. The count is kept server-side by IP, so clearing the browser or editing the request doesn't reset it.
  let used: number | null;
  try {
    used = await countCall(event, req);
  } catch (error) {
    // Fail closed: without a working counter, don't spend. The browser falls back to scripted lines.
    console.error('Usage counter failure:', error);
    return json(503, { error: 'unavailable' });
  }
  if (used === null) {
    return req.mode === 'chat' ? json(200, { reply: GOODBYE_REPLY, ended: true }) : json(429, { error: 'limit' });
  }
  if (used === BUSY) return json(429, { error: 'busy' });
  const farewell = req.mode === 'chat' && used >= MAX_CHAT_REPLIES;

  let system: string;
  let messages: Anthropic.Beta.BetaMessageParam[];
  if (req.mode === 'chat') {
    system = CONCIERGE_SYSTEM;
    messages = req.messages;
  } else {
    system = VERDICT_SYSTEM;
    messages = [{ role: 'user', content: `Membership application:\n\n${req.application}` }];
  }

  try {
    const anthropic = await getClient();
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        {
          type: 'text',
          text: system,
          cache_control: { type: 'ephemeral' },
        },
        ...(farewell ? [{ type: 'text' as const, text: FAREWELL_INSTRUCTION }] : []),
      ],
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return json(200, { reply: 'Yeah, no. I’m not doing that one, sweetie.', ...(farewell && { ended: true }) });
    }
    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    return json(200, { reply: reply || 'Jasmin has nothing to say to you right now.', ...(farewell && { ended: true }) });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json(429, { error: 'busy' });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Claude API error ${error.status}:`, error.message);
    } else {
      console.error('Concierge failure:', error);
    }
    return json(502, { error: 'unavailable' });
  }
}

/**
 * Records one Claude call for this visitor. Returns how many calls of this kind the visitor has made today
 * (including this one), null if they are out of allowance, or BUSY if the site-wide daily ceiling is reached.
 */
async function countCall(event: APIGatewayProxyEventV2, req: ConciergeRequest): Promise<number | null> {
  if (!USAGE_TABLE) return req.mode === 'chat' ? (req.turn > MAX_CHAT_REPLIES ? null : req.turn) : 1;
  const ip = visitorIp(event);
  const used =
    req.mode === 'chat'
      ? await claim(USAGE_TABLE, `chat#${ip}`, MAX_CHAT_REPLIES)
      : await claim(USAGE_TABLE, `verdict#${ip}`, MAX_VERDICTS);
  if (used === null) return null;
  if ((await claim(USAGE_TABLE, 'all', DAILY_LIMIT)) === null) return BUSY;
  return used;
}
