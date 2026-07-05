import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { name, business, email, phone, service, message } = data;

    // Basic validation
    if (!name || !business || !email || !service || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve Resend API Key from Cloudflare runtime env or process env
    const runtimeEnv = (locals as any).runtime?.env;
    const resendApiKey = runtimeEnv?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured.');
      return new Response(
        JSON.stringify({ error: 'Mail service configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email using Resend API (HTTP POST)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Contact Form <website@abovethefold.biz>', // Must be a verified domain in Resend
        to: ['hello@abovethefold.biz'],
        subject: `New Project Inquiry: ${business}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Business Name:</strong> ${business}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service Interest:</strong> ${service}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API response error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email via Resend' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error handling contact submission:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
