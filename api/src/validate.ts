import type Anthropic from '@anthropic-ai/sdk';

export const MAX_TURNS = 12;
export const MAX_CHARS = 600;
/** Jasmin answers this many chat messages per visitor, then leaves the chat. */
export const MAX_CHAT_REPLIES = 20;

export type ConciergeRequest =
  | { mode: 'chat'; messages: Anthropic.MessageParam[]; turn: number }
  | { mode: 'verdict'; application: string }
  | { mode: 'remark'; action: string; page: string; previous: string[] };

const APPLICATION_FIELDS = [
  'address',
  'name',
  'residence',
  'tier',
  'wealth',
  'beauty',
  'residences',
  'services',
  'statement',
  'referral',
] as const;

/** Parses an untrusted request body. Returns null when it should be rejected. */
export function parseRequest(raw: unknown): ConciergeRequest | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;

  if (body.mode === 'chat') {
    if (!Array.isArray(body.messages) || body.messages.length === 0) return null;
    // The browser also reports how many messages the visitor has sent across page loads.
    const sent = body.messages.filter((m) => (m as { role?: unknown } | null)?.role === 'user').length;
    const reported = typeof body.turn === 'number' && Number.isFinite(body.turn) ? Math.floor(body.turn) : 0;
    const turn = Math.max(sent, reported);
    const recent = body.messages.slice(-MAX_TURNS);
    const messages: Anthropic.MessageParam[] = [];
    for (const m of recent) {
      if (!m || typeof m !== 'object') return null;
      const { role, content } = m as Record<string, unknown>;
      if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
      const text = content.trim().slice(0, MAX_CHARS);
      if (!text) return null;
      messages.push({ role, content: text });
    }
    // The client keeps the Concierge's opening line; the API needs a user turn first.
    while (messages.length && messages[0].role !== 'user') messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== 'user') return null;
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].role === messages[i - 1].role) return null;
    }
    return { mode: 'chat', messages, turn };
  }

  if (body.mode === 'verdict') {
    const app = body.application;
    if (!app || typeof app !== 'object') return null;
    const fields = app as Record<string, unknown>;
    const lines: string[] = [];
    for (const key of APPLICATION_FIELDS) {
      const value = fields[key];
      const text = Array.isArray(value) ? value.filter((v) => typeof v === 'string').join(', ') : value;
      if (typeof text === 'string' && text.trim()) {
        lines.push(`${key}: ${text.trim().slice(0, MAX_CHARS)}`);
      }
    }
    if (!lines.length) return null;
    return { mode: 'verdict', application: lines.join('\n') };
  }

  if (body.mode === 'remark') {
    const action = typeof body.action === 'string' ? body.action.trim().slice(0, 200) : '';
    if (!action) return null;
    const page = typeof body.page === 'string' ? body.page.trim().slice(0, 100) : '';
    const previous = Array.isArray(body.previous)
      ? body.previous
          .filter((p): p is string => typeof p === 'string')
          .slice(-5)
          .map((p) => p.slice(0, 300))
      : [];
    return { mode: 'remark', action, page, previous };
  }

  return null;
}
