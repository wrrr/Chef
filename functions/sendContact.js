import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 587,
    auth: {
      user: process.env.SEND_FROM, // your SMTP2GO username/email
      pass: process.env.SMTP2GO_API_KEY, // your SMTP2GO password/API key
    },
  });

  const mailOptions = {
    from: `"Chefs2Table Contact" <${process.env.SEND_FROM}>`,
    to: process.env.RECEIVE_TO, // destination email
    subject: `New Contact Form Submission from ${name}`,
    text: message,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br/>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Message sent successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
  }
}