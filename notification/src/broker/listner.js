import { consumeEvents } from "./Rabbit.js";
import sendEmail from "../utils/email.js";

export default () => {
  consumeEvents(async (message, routingKey) => {
    console.log("📩 Event:", routingKey, message);

    // Welcome Email
    if (routingKey === "user.registered") {
      await sendEmail(
        message.email,
        "Welcome to Music Player",
        "Welcome!",
        `<h1>Welcome ${message.fullName}</h1>
         <p>Your username: <b>${message.username}</b></p>`
      );
    }

    // Forgot Password OTP
    if (routingKey === "user.forgot_password") {
      await sendEmail(
        message.email,
        "Password Reset OTP",
        `Your OTP is ${message.otp}`,
        `<h2>Your OTP: ${message.otp}</h2>`
      );

      console.log("✅ OTP email sent");
    } else {
      console.log("❓ No handler for routing key:", routingKey);
    }
  });
};
