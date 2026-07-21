import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/resend';

export const prerender = false;

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.email('Please enter a valid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().max(0), // Anti-spam: must be empty
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const data = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      subject: formData.get('subject')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      honeypot: formData.get('honeypot')?.toString() || '',
    };

    // Validate
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const error of result.error.issues) {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      }

      return new Response(
        JSON.stringify({
          success: false,
          errors: fieldErrors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Honeypot check (bot detection)
    if (result.data.honeypot) {
      // Pretend success but don't process
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process the submission: notify the owner(s) and confirm to the sender.
    // Each is independent so a failure on one doesn't block the other.
    const [ownerResult, senderResult] = await Promise.allSettled([
      sendContactNotificationEmail({
        name: result.data.name,
        email: result.data.email,
        subject: result.data.subject,
        message: result.data.message,
      }),
      sendContactConfirmationEmail({
        name: result.data.name,
        email: result.data.email,
      }),
    ]);

    if (ownerResult.status === 'rejected') {
      console.error('Failed to send contact notification email:', ownerResult.reason);
    }
    if (senderResult.status === 'rejected') {
      console.error('Failed to send contact confirmation email:', senderResult.reason);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        errors: { form: ['An unexpected error occurred'] },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
