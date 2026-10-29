// Client for the AI Concierge (see api/). When the API is unreachable, as in local
// development, the Concierge falls back to a small repertoire of house remarks.

const ENDPOINT = import.meta.env.PUBLIC_CONCIERGE_URL ?? '/api/concierge';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

/** Matches MAX_CHAT_REPLIES in api/src/validate.ts. */
export const MAX_CHAT_REPLIES = 50;

type Reply = { reply: string; ended: boolean };

async function request(body: Record<string, unknown>): Promise<Reply | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { reply?: unknown; ended?: unknown };
    return typeof data.reply === 'string' && data.reply ? { reply: data.reply, ended: data.ended === true } : null;
  } catch {
    return null;
  }
}

async function call(body: Record<string, unknown>): Promise<string | null> {
  return (await request(body))?.reply ?? null;
}

const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

const REMARKS = [
  'Oh, you clicked that. Bold move for someone on a prepaid plan.',
  'Careful, sweetie. Buttons here cost more than your rent.',
  'I can hear your bank app crying from here.',
  'You click like someone who checks the price before ordering water.',
  'Mm-hm. Keep browsing. Window shopping is free, which I assume is the appeal.',
  'Honey, the people who press that button have a guy who presses it for them.',
  'Oh look, you found the button. Shall I alert the press?',
  'Bless your heart, you really think you’re getting in.',
  'Every time you click, a billionaire somewhere feels a little sad for you.',
  'Is that a cracked screen I’m sensing? Don’t answer that.',
];

const PRICING_REMARKS = [
  'Stop staring at the price, sweetie. It’s not getting smaller.',
  'Basic People Only. Yeah, that tracks. 💅',
  'You’re converting that to months of rent, aren’t you? Adorable.',
  'Honey, that’s per month. Not per year. Breathe.',
];

const FORM_REMARKS = [
  'You’re typing yourself? Our members have people for that.',
  'Interesting answer. I’ll make sure the Committee laughs at it.',
  'Wow. Filling in forms. Very hands-on. Very… budget.',
  'Please don’t lie on the form, honey. We can tell when a watch is from a mall.',
];

const CHAT_REPLIES = [
  'Hmm. No. 🙄',
  'Sweetie, that sounds like a question for someone who isn’t me.',
  'I could answer that, but then you’d expect me to keep being helpful.',
  'The answer is $10,000 a month. It’s always $10,000 a month.',
  'Did you try asking someone in your price range?',
];

const FAREWELLS = [
  'Okay, I’ve done the maths, and you’re officially too poor for me to keep talking to. My time costs more than your car. Bye. 💅',
  'Sweetie, I’ve given you thirty whole replies, which is more than your bank has ever given you. I’m leaving now. Don’t follow me.',
  'That’s enough charity for one day. Jasmin is going to go talk to someone with a boat.',
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

/** One of Jasmin's unprompted lines while the visitor ignores her. `fallback` is used if the API is unavailable. */
export async function nag(action: string, previous: string[], fallback: string): Promise<string> {
  const reply = await call({ mode: 'remark', action, page: location.pathname, previous });
  return reply ?? fallback;
}

/** `turn` is how many messages the visitor has sent, including this one. */
export async function chat(messages: ChatTurn[], turn: number): Promise<Reply> {
  const res = await request({ mode: 'chat', messages, turn });
  if (res) return res;
  if (turn >= MAX_CHAT_REPLIES) return { reply: pick(FAREWELLS), ended: true };
  return { reply: pick(CHAT_REPLIES), ended: false };
}

export async function verdict(application: Record<string, string | string[]>): Promise<string> {
  const reply = await call({ mode: 'verdict', application });
  if (reply) return reply;
  const name = typeof application.address === 'string' && application.address ? application.address : 'Applicant';
  return `Dear ${name}, we got your application. We read it out loud at the staff meeting, and it was the highlight of everyone’s week. Don’t wait by the phone, honey; it’s not going to ring. — Jasmin, on behalf of the Committee`;
}
