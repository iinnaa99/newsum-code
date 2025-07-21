import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const link = `${process.env.BASE_URL}/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "newsum 이메일 인증 요청",
    html: `<p>아래 링크를 클릭해 인증을 완료해주세요:</p>
           <a href="${link}">${link}</a>`,
  });
}

export default sendVerificationEmail;
