import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

import subscribeRouter from "./routes/subscribe.js";
import sendVerificationRouter from "./routes/sendVerification.js";
import verifyRouter from "./routes/verify.js";
import sendDailyEmails from "./jobs/sendDailyEmail.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/subscribe", subscribeRouter);
app.use("/api/send-verification", sendVerificationRouter);
app.use("/api/verify-email", verifyRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✅ subscription-api listening on port ${port}`);
});

cron.schedule("19 * * * *", () => {
  console.log("🕘 아침 9시 메일 전송 시작");
  sendDailyEmails();
});
