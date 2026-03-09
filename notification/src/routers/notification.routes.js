import express, { Router } from "express"

import * as  notificationController from '../controllers/notification.controller.js'


const router = express.Router()

/* ======================
   HEALTH CHECK (NEW)
====================== */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "notification",
    timestamp: new Date().toISOString(),
  });
});



router.post('/send-forget-password-otp',notificationController.sendForgotPasswordEmail)


export default router;



