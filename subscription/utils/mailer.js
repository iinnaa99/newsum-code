import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

dotenv.config();
// AWS Secrets Manager 설정
const secretName = "newsum/db-credentials";
const region = "ap-northeast-2";

// --- AWS 클라이언트 초기화 ---
const secretsClient = new SecretsManagerClient({ region });

/**
 * 애플리케이션에서 사용할 설정 값을 로드하는 함수
 */
const loadAppConfig = async () => {
  try {
    console.log(`Secrets Manager에서 [${secretName}] 시크릿을 가져옵니다.`);

    // 1. Secrets Manager에서 보안 암호 가져오기
    const secretResponse = await secretsClient.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    // 2. 가져온 값(JSON 문자열)을 객체로 파싱하여 반환
    const config = JSON.parse(secretResponse.SecretString);
    console.log("✅ 설정 값 로드 성공!");

    // 예시: 가져온 DB 유저 정보 출력
    console.log(`DB User: ${config.db_user}`);
    // console.log(`API Key: ${config.api_key}`);

    return config;
  } catch (error) {
    console.error("❌ 시크릿을 가져오는 중 오류가 발생했습니다:", error);
    // 오류 발생 시 프로세스를 중단하거나 기본 설정을 사용하도록 처리
    process.exit(1);
  }
};

// DB Pool 생성
const config = await loadAppConfig();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const link = `${process.env.BASE_URL}/verify?token=${token}`;
  await transporter.sendMail({
    from: config.EMAIL_USER,
    to: email,
    subject: "📰 NewSum 이메일 인증 요청 - 나만의 뉴스 아침 8시에 받아보세요!",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 1.5rem; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
      <!-- 로고 -->
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <img src="cid:logo" alt="NewSum 로고" style="height: 50px;" />
      </div>

      <h2 style="color: #007bff;">📩 이메일 인증을 완료해주세요</h2>
      <p style="font-size: 1rem; color: #333;">
        <strong>NewSum</strong>을 통해 <span style="color:#007bff;">관심 있는 뉴스를 매일 아침 8시에</span> 이메일로 받아보실 수 있어요!
      </p>

      <p style="font-size: 1rem; margin: 1.2rem 0;">
        아래 버튼을 눌러 이메일 인증을 완료해주세요.
      </p>

      <div style="text-align: center; margin: 2rem 0;">
        <a href="${link}" target="_blank" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 1rem;">
          ✉️ 이메일 인증하기
        </a>
      </div>

      <p style="font-size: 0.9rem; color: #777;">
        인증 링크가 작동하지 않는다면 아래 주소를 브라우저에 직접 붙여넣어 주세요:<br/>
        <a href="${link}" target="_blank" style="color: #007bff;">${link}</a>
      </p>

      <hr style="margin: 2rem 0;" />

      <p style="font-size: 0.85rem; color: #aaa; text-align: center;">
        본 메일은 NewSum에서 자동 발송되었습니다.<br/>
        문의: contact@newsum.click
      </p>
    </div>
  `,
    attachments: [
      {
        filename: "logo.png",
        path: "./assets/logo.png", // 실제 로고 파일 경로
        cid: "logo", // 위의 img 태그에서 참조되는 ID
      },
    ],
  });
}

export default sendVerificationEmail;
