import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  // Create a nodemailer transporter using SMTP2GO
  const transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 587,
    auth: {
      user: "wordsrack.com",  // replace with your SMTP2GO username
      pass: "JaTTypFW6CSLktlG",  // replace with your SMTP2GO password
    },
  });

  const mailOptions = {
    from: `"Chefs2Table Contact" <${email}>`,
    to: "cto@12flat.com", // where you want to receive the emails
    subject: `New Contact Form Submission from ${name}`,
    text: message,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br/>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
}