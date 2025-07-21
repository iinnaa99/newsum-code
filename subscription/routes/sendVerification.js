// sendVerification.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import userDb from "../database/user_db.js";
import sendVerificationEmail from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    console.log("저장 중:", email, token, expiresAt);

    await userDb.query(
      "INSERT INTO email_verification (email, token, expires_at) VALUES (?, ?, ?)",
      [email, token, expiresAt]
    );

    await sendVerificationEmail(email, token);
    res.json({ success: true, message: "메일 전송 완료" });
  } catch (err) {
    console.error("메일 전송 오류:", err);
    res.status(500).json({ success: false, message: "메일 전송 실패" });
  }
});

export default router;
