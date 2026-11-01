import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { visitorIp } from './usage.ts';

const event = (headers: Record<string, string>) =>
  ({ headers, requestContext: { http: { sourceIp: '198.51.100.1' } } }) as unknown as APIGatewayProxyEventV2;

test('takes the visitor’s IP from CloudFront’s viewer header, without the port', () => {
  assert.equal(visitorIp(event({ 'cloudfront-viewer-address': '203.0.113.7:51234' })), '203.0.113.7');
  assert.equal(visitorIp(event({ 'cloudfront-viewer-address': '2001:db8::1:51234' })), '2001:db8::1');
});

test('falls back to the connecting address', () => {
  assert.equal(visitorIp(event({})), '198.51.100.1');
});
