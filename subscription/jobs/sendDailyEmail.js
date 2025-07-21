import dotenv from "dotenv";
dotenv.config();

import userDb from "../database/user_db.js";
import newsDb from "../database/news_db.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const categoryList = ["정치", "경제", "사회", "생활/문화", "세계", "IT/과학"];

async function sendDailyEmails() {
  const [users] = await userDb.query(
    "SELECT email, name, sub_flag, category_bit FROM users WHERE sub_flag IS NOT NULL"
  );

  console.log(`📬 메일 대상자 수: ${users.length}`);

  for (const user of users) {
    const { email, name, sub_flag, category_bit } = user;

    // ✅ BIT 필드 Buffer → 정수로 변환
    const subFlagNum =
      typeof sub_flag === "number"
        ? sub_flag
        : Buffer.isBuffer(sub_flag)
        ? sub_flag.readUInt8(0)
        : 0;

    const categoryBitNum =
      typeof category_bit === "number"
        ? category_bit
        : Buffer.isBuffer(category_bit)
        ? category_bit.readUInt8(0)
        : 0;

    const flag = subFlagNum.toString(2).padStart(3, "0");
    const category = categoryBitNum;

    console.log(`\n📧 대상: ${email} (${name})`);
    console.log(`   └ sub_flag: ${flag} (원본: ${subFlagNum})`);
    console.log(
      `   └ category_bit: ${category} (${category
        .toString(2)
        .padStart(8, "0")})`
    );

    let subject = `[NewSum] ${name}님을 위한 오늘의 뉴스`;
    let htmlContent = `<p>${name}님, 안녕하세요. 오늘의 뉴스입니다.</p><hr/>`;

    // 1️⃣ Top10 뉴스 요약
    if (flag[2] === "1") {
      console.log("   ✅ Top 뉴스 요약 포함");
      const [rows] = await newsDb.query(
        "SELECT topic_title, topic_content FROM news_sum LIMIT 5"
      );
      htmlContent += `<h3>📌 Top 뉴스 요약</h3>`;
      rows.forEach((row, idx) => {
        htmlContent += `<p><strong>${idx + 1}. ${
          row.topic_title
        }</strong><br/>${row.topic_content}</p>`;
      });
      htmlContent += `<hr/>`;
    }

    // 2️⃣ 긴급 재난 알림
    if (flag[1] === "1") {
      console.log("   ✅ 긴급 재난 포함");
      htmlContent += `<h3>🚨 긴급 재난 알림</h3><p>현재는 별도의 재난 정보가 없습니다. (예시)</p><hr/>`;
    }

    // 3️⃣ 주제별 뉴스
    if (flag[0] === "1") {
      console.log("   ✅ 주제별 뉴스 포함");
      htmlContent += `<h3>📰 주제별 뉴스</h3>`;

      for (let i = 0; i < categoryList.length; i++) {
        if ((category & (1 << i)) !== 0) {
          const categoryName = categoryList[i];
          console.log(`      📂 ${categoryName} 카테고리 포함`);
          const [rows] = await newsDb.query(
            "SELECT title, contents FROM news_raw WHERE subject = ? LIMIT 3",
            [categoryName]
          );

          htmlContent += `<h4>📍 ${categoryName}</h4>`;
          rows.forEach((row) => {
            htmlContent += `<p><strong>${
              row.title
            }</strong><br/>${row.content.slice(0, 150)}...</p>`;
          });
        }
      }

      htmlContent += `<hr/>`;
    }

    // ✅ 메일 전송
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: htmlContent,
      });
      console.log(`✅ 메일 전송 완료: ${email}`);
    } catch (err) {
      console.error(`❌ ${email} 메일 전송 실패:`, err);
    }
  }
}

export default sendDailyEmails;
