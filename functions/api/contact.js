/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Validates form data and sends an email via Resend API.
 * The RESEND_API_KEY must be set in Cloudflare Pages > Settings > Environment Variables.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS-safe JSON response helper
  const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  try {
    const data = await request.json();
    const { name, business, email, phone, service, message } = data;

    // Basic validation
    if (!name || !business || !email || !service || !message) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // Retrieve Resend API Key from Cloudflare environment variables
    const resendApiKey = env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured.');
      return jsonResponse({ error: 'Mail service configuration error' }, 500);
    }

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Contact Form <website@abovethefold.biz>',
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
      return jsonResponse({ error: 'Failed to send email via Resend' }, 502);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return jsonResponse({ error: error.message || 'Internal server error' }, 500);
  }
}
