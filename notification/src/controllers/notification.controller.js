import sendEmail from '../utils/email.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export async function sendForgotPasswordEmail(req, res) {
  try {
    // Correctly extract token from header
    const token = req.headers.authorization?.split(' ')[1];

//     console.log("Headers:", req.headers);
// console.log("Authorization header:", req.headers.authorization);


    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Decode and verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const { email, otp } = decoded;

    if (!email || !otp) {
      return res.status(400).json({ message: "Invalid token data" });
    }

    console.log(`Sending OTP ${otp} to email: ${email}`); // debug OTP

    const template = `
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Use the OTP below to reset it. This OTP is valid for 10 minutes.</p>
      <h2>${otp}</h2>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Best regards,<br/>The Team</p>
    `;

    // Send email
    await sendEmail(email, "Password Reset Request", `Your OTP: ${otp}`, template);

    res.status(200).json({ message: "If the email is registered, an OTP will be sent." });

  } catch (error) {
    console.error("❌ Error in sendForgotPasswordEmail:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
