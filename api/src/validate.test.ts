import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRequest, MAX_CHARS, MAX_TURNS } from './validate.ts';

test('accepts a chat that starts with the Concierge greeting', () => {
  const req = parseRequest({
    mode: 'chat',
    messages: [
      { role: 'assistant', content: 'Good evening.' },
      { role: 'user', content: 'Hello' },
    ],
  });
  assert.deepEqual(req, { mode: 'chat', messages: [{ role: 'user', content: 'Hello' }], turn: 1 });
});

test('rejects chats that do not end on a user turn or that repeat roles', () => {
  assert.equal(parseRequest({ mode: 'chat', messages: [{ role: 'assistant', content: 'Hi' }] }), null);
  assert.equal(
    parseRequest({
      mode: 'chat',
      messages: [
        { role: 'user', content: 'a' },
        { role: 'user', content: 'b' },
      ],
    }),
    null,
  );
});

test('rejects unknown roles, modes and non-string content', () => {
  assert.equal(parseRequest({ mode: 'chat', messages: [{ role: 'system', content: 'x' }] }), null);
  assert.equal(parseRequest({ mode: 'chat', messages: [{ role: 'user', content: { a: 1 } }] }), null);
  assert.equal(parseRequest({ mode: 'other' }), null);
  assert.equal(parseRequest(null), null);
});

test('caps message length and history', () => {
  const messages = Array.from({ length: 30 }, (_, i) => ({
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: 'x'.repeat(5000),
  }));
  messages.push({ role: 'user', content: 'last' });
  const req = parseRequest({ mode: 'chat', messages });
  assert.ok(req && req.mode === 'chat');
  assert.ok(req.messages.length <= MAX_TURNS);
  assert.ok(req.messages.every((m) => (m.content as string).length <= MAX_CHARS));
});

test('flattens an application into known fields only', () => {
  const req = parseRequest({
    mode: 'verdict',
    application: { name: 'A. Person', services: ['Friends for Hire', 'Private Email'], password: 'nope' },
  });
  assert.deepEqual(req, {
    mode: 'verdict',
    application: 'name: A. Person\nservices: Friends for Hire, Private Email',
  });
  assert.equal(parseRequest({ mode: 'verdict', application: {} }), null);
});

test('accepts a remark about a UI action and trims its inputs', () => {
  const req = parseRequest({ mode: 'remark', action: 'x'.repeat(500), page: '/membership/', previous: [1, 'Earlier.'] });
  assert.ok(req && req.mode === 'remark');
  assert.equal(req.action.length, 200);
  assert.deepEqual(req.previous, ['Earlier.']);
  assert.equal(parseRequest({ mode: 'remark', action: '  ' }), null);
});

test('counts the visitor’s messages, trusting the higher of history and the reported count', () => {
  const messages = [
    { role: 'user', content: 'a' },
    { role: 'assistant', content: 'b' },
    { role: 'user', content: 'c' },
  ];
  const fromHistory = parseRequest({ mode: 'chat', messages });
  assert.ok(fromHistory && fromHistory.mode === 'chat' && fromHistory.turn === 2);
  const reported = parseRequest({ mode: 'chat', messages, turn: 6 });
  assert.ok(reported && reported.mode === 'chat' && reported.turn === 6);
  const understated = parseRequest({ mode: 'chat', messages, turn: 0 });
  assert.ok(understated && understated.mode === 'chat' && understated.turn === 2);
});
