import React, { useState, useEffect } from "react";
import "./SubscriptionModal.css";

// ✅ 환경변수 + 기본값
const SUBSCRIBE_API_URL =
  window.config?.VITE_API_SUBSCRIBE || "http://localhost:4000";
console.log("✅ SUBSCRIBE_API_URL:", SUBSCRIBE_API_URL);

export default function SubscriptionModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    emailDomain: "",
    newsCategory: [],
    topicCategory: [],
  });

  const [topicEnabled, setTopicEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const checkVerification = async () => {
    if (!SUBSCRIBE_API_URL) return;
    const { email, emailDomain } = formData;
    const fullEmail = `${email}@${emailDomain}`;
    if (!email || !emailDomain) return;

    try {
      const res = await fetch(
        `${SUBSCRIBE_API_URL}/api/verify-email/check-verification?email=${fullEmail}`
      );
      const data = await res.json();
      if (data.verified) {
        setIsVerified(true);
        localStorage.setItem("verifiedEmail", fullEmail);
      } else {
        setIsVerified(false);
      }
    } catch (err) {
      console.error("❌ 인증 확인 오류:", err);
      setIsVerified(false);
    }
  };

  useEffect(() => {
    if (!verificationSent || isVerified) return;
    checkVerification();
    const interval = setInterval(() => checkVerification(), 5000);
    return () => clearInterval(interval);
  }, [formData.email, formData.emailDomain, verificationSent, isVerified]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "news_category") {
        setFormData((prev) => {
          const exists = prev.newsCategory.includes(value);
          const updated = exists
            ? prev.newsCategory.filter((v) => v !== value)
            : [...prev.newsCategory, value];
          return { ...prev, newsCategory: updated };
        });

        if (value === "topic") {
          setTopicEnabled(checked);
          if (!checked) {
            setFormData((prev) => ({ ...prev, topicCategory: [] }));
          }
        }
      }

      if (name === "topic_detail") {
        if (value === "전체") {
          const all = [
            "전체",
            "정치",
            "경제",
            "사회",
            "생활/문화",
            "세계",
            "IT/과학",
          ];
          setFormData((prev) => ({
            ...prev,
            topicCategory: checked ? all : [],
          }));
        } else {
          setFormData((prev) => {
            const updated = checked
              ? [...prev.topicCategory, value]
              : prev.topicCategory.filter((v) => v !== value);
            const allTopics = [
              "전체",
              "정치",
              "경제",
              "사회",
              "생활/문화",
              "세계",
              "IT/과학",
            ];
            const isAllChecked = allTopics.every((t) => updated.includes(t));
            const final = isAllChecked
              ? ["전체", ...allTopics]
              : updated.filter((v) => v !== "전체");
            return { ...prev, topicCategory: final };
          });
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      emailDomain,
      newsCategory,
      topicCategory,
      gender,
      age,
    } = formData;
    if (!name.trim()) return alert("이름을 입력해주세요.");
    if (!email.trim() || !emailDomain.trim())
      return alert("이메일을 입력해주세요.");
    if (newsCategory.length === 0)
      return alert("뉴스 카테고리를 선택해주세요.");

    const fullEmail = `${email}@${emailDomain}`;
    let subFlag = 0;
    if (newsCategory.includes("topic")) subFlag |= 0b100;
    if (newsCategory.includes("breaking")) subFlag |= 0b010;
    if (newsCategory.includes("top10")) subFlag |= 0b001;

    const categoryMap = {
      정치: 0,
      경제: 1,
      사회: 2,
      "생활/문화": 3,
      세계: 4,
      "IT/과학": 5,
    };
    let categoryBit = 0;
    for (const category of topicCategory) {
      const bit = categoryMap[category];
      if (bit !== undefined) categoryBit |= 1 << bit;
    }

    try {
      const res = await fetch(`${SUBSCRIBE_API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: fullEmail,
          gender,
          age,
          sub_flag: subFlag,
          category_bit: categoryBit,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ 신청이 완료되었습니다.");
        onClose();
      } else {
        alert("❌ 에러 발생: " + (data.message || "서버 오류"));
      }
    } catch (err) {
      alert("서버 통신 중 오류가 발생했습니다.");
      console.error("❗ 서버 오류:", err);
    }
  };

  const handleSendVerification = async () => {
    const fullEmail = `${formData.email}@${formData.emailDomain}`;
    if (!formData.email.trim() || !formData.emailDomain.trim()) {
      alert("이메일을 올바르게 입력해주세요.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`${SUBSCRIBE_API_URL}/api/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail }),
      });
      if (res.ok) {
        setVerificationSent(true);
      } else {
        alert("❌ 인증 메일 발송 실패");
      }
    } catch (err) {
      alert("서버 오류 발생");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const renderVerificationMessage = () => {
    if (!isVerified && verificationSent) {
      return (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "4px" }}>
          ✅ 인증 메일이 전송되었습니다.
        </p>
      );
    }
    if (isVerified) {
      return (
        <p style={{ color: "blue", fontWeight: "bold", marginTop: "4px" }}>
          🎉 이메일 인증 완료
        </p>
      );
    }
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">뉴스 구독 신청</h2>
        <p>
          AI로 요약된 최신 뉴스를 <strong>오전 8시</strong>에 받아보세요!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              이름<span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              이메일<span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                name="email"
                placeholder="example"
                value={formData.email}
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <p>@</p>
              <select
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                style={{
                  width: "40%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              >
                <option value="">직접 입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
                <option value="hanmail.net">hanmail.net</option>
                <option value="nate.com">nate.com</option>
                <option value="icloud.com">icloud.com</option>
                <option value="outlook.com">outlook.com</option>
              </select>
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isVerifying || isVerified}
                style={{
                  padding: "8px 12px",
                  backgroundColor:
                    isVerifying || isVerified ? "#6c757d" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isVerifying || isVerified ? "not-allowed" : "pointer",
                }}
              >
                {isVerified
                  ? "인증 완료"
                  : isVerifying
                  ? "인증 요청 중..."
                  : "인증 받기"}
              </button>
            </div>
            {renderVerificationMessage()}
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              성별
            </label>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="1"
                  checked={formData.gender === "1"}
                  onChange={handleChange}
                />{" "}
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="0"
                  checked={formData.gender === "0"}
                  onChange={handleChange}
                />{" "}
                여성
              </label>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              나이
            </label>
            <select
              name="age"
              value={formData.age}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              <option value="">나이대를 선택하세요</option>
              <option value="10">10대</option>
              <option value="20">20대</option>
              <option value="30">30대</option>
              <option value="40">40대</option>
              <option value="50">50대</option>
              <option value="60">60대</option>
              <option value="70">70대</option>
              <option value="80">80대 이상</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              받을 기사 (중복 선택 가능)
              <span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="news_category"
                value="top10"
                checked={formData.newsCategory.includes("top10")}
                onChange={handleChange}
              />
              TOP 10 뉴스
            </label>
            <label>
              <input
                type="checkbox"
                name="news_category"
                value="breaking"
                checked={formData.newsCategory.includes("breaking")}
                onChange={handleChange}
              />
              긴급/재난 속보 (실시간 전송)
            </label>
            <label>
              <input
                type="checkbox"
                name="news_category"
                value="topic"
                checked={formData.newsCategory.includes("topic")}
                onChange={handleChange}
              />
              주제별 뉴스
            </label>
          </div>

          {/* 주제별 세부 항목 */}
          <div
            style={{
              marginTop: "12px",
              paddingLeft: "16px",
              borderLeft: "2px solid #eee",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <label style={{ color: topicEnabled ? "#000" : "#aaa" }}>
                <input
                  type="checkbox"
                  name="topic_detail"
                  value="전체"
                  disabled={!topicEnabled}
                  checked={formData.topicCategory.includes("전체")}
                  onChange={handleChange}
                  style={{ marginRight: "6px" }}
                />
                전체
              </label>
            </div>

            <div
              className="topic-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px 20px",
              }}
            >
              {["정치", "경제", "사회", "생활/문화", "세계", "IT/과학"].map(
                (cat) => (
                  <label
                    key={cat}
                    style={{ color: topicEnabled ? "#000" : "#aaa" }}
                  >
                    <input
                      type="checkbox"
                      name="topic_detail"
                      value={cat}
                      disabled={!topicEnabled}
                      checked={formData.topicCategory.includes(cat)}
                      onChange={handleChange}
                      style={{ marginRight: "6px" }}
                    />
                    {cat}
                  </label>
                )
              )}
            </div>
          </div>

          <div className="button-group">
            <button type="button" onClick={onClose}>
              닫기
            </button>
            <button type="submit">신청하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}
