import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your real gmail
    pass: process.env.EMAIL_PASS, // 16-digit app password
  },
});

// Optional verify (good for debug)
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

const sendEmail = async (to, subject, text, html) => {
  if (!to) throw new Error("Recipient email is undefined");

  try {
    const info = await transporter.sendMail({
      from: `"Music Player" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
