// /functions/sendContact.js

export async function onRequestPost({ request, env }) {
  // Parse and validate JSON body
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { name, email, message } = data || {};

  if (!name || !email || !message) {
    return new Response("All fields are required", { status: 400 });
  }

  // Construct SMTP2GO payload
  const payload = {
    to: [env.RECEIVE_TO],
    sender: env.SEND_FROM, // must be verified in SMTP2GO
    subject: `New Contact Form Submission from ${name}`,
    text_body: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    html_body: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/>${message}</p>`,
    // Include Reply-To so replies go to the submitter
    custom_headers: [{ header: "Reply-To", value: email }],
  };

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // use secure header authentication instead of body key
        "X-Smtp2go-Api-Key": env.SMTP2GO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // ✅ correct success property
    if (result?.data?.succeeded === 1) {
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
