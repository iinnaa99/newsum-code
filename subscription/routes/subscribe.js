import express from "express";
import userDb from "../database/user_db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, gender, age, sub_flag, category_bit } = req.body;

  console.log("📥 받은 요청:", req.body);

  // ✅ 필수 항목 검사
  if (!name || !email || sub_flag === undefined) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }

  try {
    const [existing] = await userDb.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    const sex = gender === "1" ? 0 : gender === "0" ? 1 : null;

    if (existing.length > 0) {
      await userDb.query(
        `UPDATE users
         SET name = ?, sex = ?, age = ?, sub_flag = ?, category_bit = ?
         WHERE email = ?`,
        [name, sex, age || null, sub_flag, category_bit || 0, email]
      );
    } else {
      await userDb.query(
        `INSERT INTO users (name, email, sex, age, sub_flag, category_bit)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, sex, age || null, sub_flag, category_bit || 0]
      );
    }

    // 인증 정보 삭제
    await userDb.query("DELETE FROM email_verification WHERE email = ?", [
      email,
    ]);

    res.status(201).json({ message: "구독 정보가 저장되었습니다." });
  } catch (err) {
    console.error("❌ DB 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
