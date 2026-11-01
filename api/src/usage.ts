import { DynamoDBClient, UpdateItemCommand, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

// Counts Claude calls in DynamoDB so the limits hold on the server, whatever the browser claims.
// Counters live in fixed UTC-day windows and expire on their own (DynamoDB TTL).

const DAY_MS = 24 * 60 * 60 * 1000;
let db: DynamoDBClient | undefined;

/** The visitor's IP. Behind CloudFront, API Gateway sees CloudFront's address, so prefer the viewer header. */
export function visitorIp(event: APIGatewayProxyEventV2): string {
  const viewer = event.headers?.['cloudfront-viewer-address'];
  // "203.0.113.7:51234" or "2001:db8::1:51234": drop the port after the last colon.
  if (viewer && viewer.lastIndexOf(':') > 0) return viewer.slice(0, viewer.lastIndexOf(':'));
  return event.requestContext.http.sourceIp;
}

export const dayWindow = (now = Date.now()) => Math.floor(now / DAY_MS);

/**
 * Takes one use of `key` if it has fewer than `limit` uses today. Returns the new count (1 for the
 * first use), or null when the limit is already reached.
 */
export async function claim(table: string, key: string, limit: number, now = Date.now()): Promise<number | null> {
  db ??= new DynamoDBClient({});
  const day = dayWindow(now);
  try {
    const res = await db.send(
      new UpdateItemCommand({
        TableName: table,
        Key: { pk: { S: `${key}#${day}` } },
        UpdateExpression: 'ADD n :one SET expires = if_not_exists(expires, :expires)',
        ConditionExpression: 'attribute_not_exists(n) OR n < :limit',
        ExpressionAttributeValues: {
          ':one': { N: '1' },
          ':limit': { N: String(limit) },
          ':expires': { N: String(Math.floor(((day + 2) * DAY_MS) / 1000)) },
        },
        ReturnValues: 'UPDATED_NEW',
      }),
    );
    return Number(res.Attributes?.n?.N ?? limit);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException || (error as Error)?.name === 'ConditionalCheckFailedException') {
      return null;
    }
    throw error;
  }
}
