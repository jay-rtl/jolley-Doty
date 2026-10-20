import { NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { productionUrl } from '@/lib/site';
import { contactReady, validateContact, emailBody } from '@/lib/contact.mjs';
export const runtime = 'nodejs';
function reply(message: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json(
    { message, ...extra },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const expectedOrigin =
    productionUrl() ?? `${requestUrl.protocol}//${request.headers.get('host') ?? requestUrl.host}`;
  const origin = request.headers.get('origin');
  if (!origin || origin !== expectedOrigin)
    return reply('This request could not be verified. Please use the website contact form.', 403);
  if (!request.headers.get('content-type')?.includes('application/json'))
    return reply('Please use the website contact form.', 415);
  if (Number(request.headers.get('content-length') ?? 0) > 24000)
    return reply('Your message is too large.', 413);
  let input;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply('Please enter your message.', 400);
    let total = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 24000) {
        await reader.cancel();
        return reply('Your message is too large.', 413);
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return reply('Please check the form and try again.', 400);
  }
  const parsed = validateContact(input);
  if (!parsed.success)
    return reply('Please correct the highlighted fields.', 400, {
      errors: parsed.error.flatten().fieldErrors,
    });
  if (parsed.data.website) return reply('This submission could not be accepted.', 400);
  if (!contactReady())
    return reply(
      'Correspondence is not available yet. Your message has not been sent or stored.',
      503,
    );
  // The deployment MUST overwrite x-forwarded-for; never trust a client-supplied forwarding header.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!ip) return reply('Message delivery is temporarily unavailable.', 503);
  const hash = createHmac('sha256', process.env.CONTACT_HASH_SECRET!).update(ip).digest('hex');
  try {
    const rateResponse = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        'EVAL',
        "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 600) end; return n",
        '1',
        `contact:${hash}`,
      ]),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    if (!rateResponse.ok)
      return reply('Message delivery is temporarily unavailable. Please try again later.', 503);
    const limit = await rateResponse.json();
    if (typeof limit.result !== 'number')
      return reply('Message delivery is temporarily unavailable.', 503);
    if (limit.result > 5)
      return reply('Too many messages. Please wait ten minutes before trying again.', 429);
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: parsed.data.email,
        subject: `Author website: ${parsed.data.subject}`,
        text: emailBody(parsed.data),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!delivery.ok)
      return reply('Your message could not be delivered. Please try again later.', 502);
    return reply('Your message has been sent.', 200);
  } catch {
    return reply('Message delivery is temporarily unavailable. Please try again later.', 503);
  }
}
