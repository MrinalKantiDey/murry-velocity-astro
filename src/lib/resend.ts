import { readFile } from 'node:fs/promises';
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_NOTIFICATION_EMAIL } from 'astro:env/server';
import { getProductFilePath, formatPrice, type Product } from './products';
import { createDownloadToken } from './download-token';

let client: Resend | undefined;

function getResend(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  if (!client) {
    client = new Resend(RESEND_API_KEY);
  }
  return client;
}

interface FulfillmentItem {
  product: Product;
  downloadUrl: string;
}

function buildEmailHtml(items: FulfillmentItem[]): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #231F20;">${item.product.data.name}</p>
            <p style="margin: 0 0 12px; color: #57534e; font-size: 14px;">${item.product.data.shortDescription}</p>
            <a href="${item.downloadUrl}"
               style="display: inline-block; background: #DFE11D; color: #231F20; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px;">
              Download your PDF
            </a>
          </td>
        </tr>`
    )
    .join('');

  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
      <div style="background: #231F20; padding: 24px; border-radius: 8px 8px 0 0;">
        <p style="margin: 0; color: #DFE11D; font-weight: 800; font-size: 18px; letter-spacing: 0.02em;">MURRY STREET MEDIA</p>
      </div>
      <div style="border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
        <h1 style="font-size: 20px; margin: 0 0 8px; color: #231F20;">Thanks for your purchase!</h1>
        <p style="margin: 0 0 24px; color: #57534e; font-size: 14px;">
          Your PDF${items.length > 1 ? 's are' : ' is'} attached to this email, and you can also download
          ${items.length > 1 ? 'them' : 'it'} directly using the button${items.length > 1 ? 's' : ''} below.
          Links stay active for 7 days.
        </p>
        <table style="width: 100%; border-collapse: collapse;">${rows}</table>
        <p style="margin: 24px 0 0; color: #a8a29e; font-size: 12px;">
          Questions? Just reply to this email.
        </p>
      </div>
    </div>`;
}

/**
 * Sends the post-purchase fulfillment email: a download link + the PDF as a
 * direct attachment, per product purchased. Uses Resend's idempotency key
 * (keyed to the Stripe session) so a retried webhook delivery within
 * Resend's 24h idempotency window can't send a duplicate email.
 */
export async function sendFulfillmentEmail({
  to,
  sessionId,
  origin,
  products,
}: {
  to: string;
  sessionId: string;
  origin: string;
  products: Product[];
}): Promise<void> {
  const resend = getResend();

  const items: FulfillmentItem[] = products.map((product) => {
    const token = createDownloadToken({ slug: product.id, sessionId });
    return { product, downloadUrl: `${origin}/api/download/${token}` };
  });

  const attachments = await Promise.all(
    products.map(async (product) => ({
      filename: `${product.data.name}.pdf`,
      content: await readFile(getProductFilePath(product)),
    }))
  );

  const subject =
    products.length === 1
      ? `Your download: ${products[0].data.name}`
      : `Your ${products.length} downloads from Murry Street Media`;

  await resend.emails.send(
    {
      from: RESEND_FROM_EMAIL || 'orders@murrystreetmedia.com',
      to,
      subject,
      html: buildEmailHtml(items),
      attachments,
    },
    { idempotencyKey: `checkout-fulfillment-${sessionId}` }
  );
}

/**
 * Emails a contact form submission to the owner address(es) in
 * CONTACT_NOTIFICATION_EMAIL (comma-separated). Uses Resend's shared sandbox
 * sender since the sending domain isn't verified; that sender can only
 * deliver to the email address registered on the Resend account.
 */
export async function sendContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  if (!CONTACT_NOTIFICATION_EMAIL) {
    throw new Error('CONTACT_NOTIFICATION_EMAIL is not configured');
  }

  const resend = getResend();

  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: CONTACT_NOTIFICATION_EMAIL.split(',').map((address) => address.trim()),
    replyTo: email,
    subject: `New contact form submission${subject ? `: ${subject}` : ''}`,
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h1 style="font-size: 18px; margin: 0 0 16px; color: #231F20;">New contact form submission</h1>
        <p style="margin: 0 0 4px;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 0 0 4px;"><strong>Email:</strong> ${email}</p>
        ${subject ? `<p style="margin: 0 0 4px;"><strong>Subject:</strong> ${subject}</p>` : ''}
        <p style="margin: 16px 0 4px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>`,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

/**
 * Sends a confirmation email to the person who submitted the contact form.
 * Same sandbox-sender restriction as sendContactNotificationEmail applies:
 * delivery only succeeds while the sender's address is the one registered
 * on the Resend account.
 */
export async function sendContactConfirmationEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}): Promise<void> {
  const resend = getResend();

  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: email,
    subject: 'We received your message',
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h1 style="font-size: 18px; margin: 0 0 16px; color: #231F20;">Thanks, ${name}!</h1>
        <p style="margin: 0; color: #57534e; font-size: 14px;">
          We've received your message and will get back to you shortly.
        </p>
      </div>`,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

export function orderTotalLabel(products: Product[]): string {
  const totalCents = products.reduce((sum, p) => sum + p.data.priceCents, 0);
  return formatPrice(totalCents, products[0]?.data.currency);
}
