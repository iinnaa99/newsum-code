import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Verified() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("이메일 인증 중입니다...");
  const [fetched, setFetched] = useState(false); // ✅ 중복 방지용 상태

  useEffect(() => {
    if (fetched) return; // ✅ 이미 요청했다면 무시
    setFetched(true);

    let rawToken = params.get("token");
    if (!rawToken) {
      setMessage("❗ 인증 토큰이 없습니다.");
      return;
    }

    // ✅ 혹시 토큰 안에 URL이 중복 포함돼 있을 경우 정리
    if (rawToken.includes("http")) {
      const split = rawToken.split("token=");
      rawToken = split[split.length - 1];
    }

    console.log("✅ 인증 토큰:", rawToken);
    if (!window.config?.VITE_API_BACKEND) {
      console.error("❌ 환경변수 VITE_API_BACKEND가 로드되지 않았습니다.");
      setMessage("❌ 시스템 설정 오류입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    fetch(
      `${window.config.VITE_API_BACKEND}/api/verify-email?token=${rawToken}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ 서버 응답:", data);
        if (data.success) {
          setMessage("✅ 이메일 인증이 완료되었습니다.");
        } else {
          throw new Error(data.message || "유효하지 않거나 만료된 토큰입니다.");
        }
      })
      .catch((err) => {
        console.error("❌ 통신 실패:", err);
        setMessage("❌ 유효하지 않거나 만료된 인증 링크입니다.");
      });
  }, [params]);

  return (
    <div style={{ padding: "40px" }}>
      <h2>{message}</h2>
    </div>
  );
}
