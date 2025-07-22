import mysql from "mysql2/promise";
import dotenv from "dotenv";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// 로컬 개발 환경이면 .env 로드
if (process.env.KUBERNETES_SERVICE_HOST === undefined) {
  dotenv.config({ path: ".env" });
}

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

const newsDb = mysql.createPool({
  host: process.env.NEWS_DB_HOST,
  user: process.env.NEWS_DB_USER,
  password: config.NEWS_DB_PASSWORD,
  database: process.env.NEWS_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default newsDb;
