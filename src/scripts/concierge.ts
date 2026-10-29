// Client for the AI Concierge (see api/). When the API is unreachable, as in local
// development, the Concierge falls back to a small repertoire of house remarks.

const ENDPOINT = import.meta.env.PUBLIC_CONCIERGE_URL ?? '/api/concierge';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

async function call(body: Record<string, unknown>): Promise<string | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { reply?: unknown };
    return typeof data.reply === 'string' && data.reply ? data.reply : null;
  } catch {
    return null;
  }
}

const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

const REMARKS = [
  'A bold click. I admire anyone who explores what they cannot afford.',
  'I see you pressed that with your own finger. Our members have staff for this.',
  'How industrious of you. Most of our clients haven’t clicked anything since 2014.',
  'Do take your time. I understand the data plan may be shared.',
  'That button has never been pressed by someone who flies commercial. Until now.',
  'An interesting choice. I’ve made a note of it, in pencil.',
  'Curiosity is free, which I suspect is why you have so much of it.',
  'You navigate the site with the confidence of someone who rents.',
  'Lovely. I can tell you’re browsing on a device you own outright, eventually.',
  'Please, explore freely. We consider it a form of outreach.',
];

const PRICING_REMARKS = [
  'You lingered on the price. Our members never look at the price; they look at the font.',
  'Ah, the Basic People Only tier. We keep it for exactly this kind of moment.',
  'If you are converting that into months of rent, I would kindly ask you to stop.',
  'Many visitors find the pricing aspirational. We find that charming.',
];

const FORM_REMARKS = [
  'I see you are typing. Our members dictate.',
  'Do be honest in the questionnaire. The committee can tell when a watch is on finance.',
  'A fine answer. I will pass it to the committee, who will pass it back.',
  'You fill in forms with real dedication. Paperwork is a lifestyle, I’m told.',
];

const CHAT_REPLIES = [
  'How fascinating. I shall relay that to no one.',
  'I understand completely, in the way one understands weather in other countries.',
  'Of course. Have you considered the Basic People Only membership? It was designed with great compassion.',
  'A wonderful question. The answer, I’m afraid, is $10,000 a month.',
  'Splendid. I have noted it beside your application, which I have also noted.',
];

function fallbackRemark(action: string): string {
  if (/\$|price|tier|membership|basic|ultra|invitation/i.test(action)) return pick(PRICING_REMARKS);
  if (/typed|field|selected|chose|form|answer|ticked/i.test(action)) return pick(FORM_REMARKS);
  return pick(REMARKS);
}

export async function remark(action: string, previous: string[]): Promise<string> {
  const reply = await call({ mode: 'remark', action, page: location.pathname, previous });
  return reply ?? fallbackRemark(action);
}

export async function chat(messages: ChatTurn[]): Promise<string> {
  return (await call({ mode: 'chat', messages })) ?? pick(CHAT_REPLIES);
}

export async function verdict(application: Record<string, string | string[]>): Promise<string> {
  const reply = await call({ mode: 'verdict', application });
  if (reply) return reply;
  const name = typeof application.address === 'string' && application.address ? application.address : 'Applicant';
  return `Dear ${name}, thank you for your application, which the Committee has received and, for the time being, is holding at arm’s length. We were moved by your candour regarding your finances, and by your evident courage in submitting it regardless. Should the Committee wish to be in touch, it will be.`;
}
