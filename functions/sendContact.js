// /functions/sendContact.js

export async function onRequestPost({ request, env }) {
  // Parse JSON body
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { name, email, message } = data;

  // Validate required fields
  if (!name || !email || !message) {
    return new Response("All fields are required", { status: 400 });
  }

  // Prepare payload for SMTP2GO REST API
  const payload = {
    api_key: env.SMTP2GO_API_KEY,
    to: [env.RECEIVE_TO],
    sender: env.SEND_FROM,
    subject: `New Contact Form Submission from ${name}`,
    text_body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html_body: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/>${message}</p>`,
  };

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.data && result.data.success === 1) {
      return new Response("Message sent successfully", { status: 200 });
    } else {
      console.error("SMTP2GO error:", result);
      return new Response("Failed to send message", { status: 500 });
    }
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response("Error sending message", { status: 500 });
  }
}