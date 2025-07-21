import express from "express";
import userDb from "../database/user_db.js";

const router = express.Router();

// ✅ 이메일 인증 처리 라우트
router.get("/", async (req, res) => {
  const { token } = req.query;

  console.log("🔍 받은 토큰:", token);

  try {
    const [rows] = await userDb.query(
      "SELECT email FROM email_verification WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    console.log("🔎 조회된 결과:", rows);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않거나 만료된 토큰입니다.",
      });
    }

    const email = rows[0].email;

    try {
      // ✅ 인증 처리
      await userDb.query("UPDATE users SET sub_flag = 1 WHERE email = ?", [
        email,
      ]);

      await userDb.query(
        "UPDATE email_verification SET verified = 1 WHERE token = ?",
        [token]
      );

      console.log("✅ 인증 처리 완료:", email);
      return res.json({ success: true, message: "이메일 인증 완료" });
    } catch (updateErr) {
      console.error("❌ DB Update/Delete Error:", updateErr);
      return res
        .status(500)
        .json({ success: false, message: "DB 업데이트 실패" });
    }
  } catch (err) {
    console.error("❌ Verification Error:", err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// ✅ 이메일 인증 여부 확인용 API
router.get("/check-verification", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ verified: false, message: "이메일 없음" });
  }

  try {
    const [rows] = await userDb.query(
      "SELECT verified FROM email_verification WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ verified: false, message: "인증 기록 없음" });
    }

    const verified = rows[0].verified === 1;
    return res.json({ verified });
  } catch (error) {
    console.error("❌ 인증 확인 실패:", error);
    return res.status(500).json({ verified: false, message: "서버 오류" });
  }
});

export default router;
