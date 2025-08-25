# NewSum
**AI 기반 뉴스 요약 및 구독 서비스**

교보DTS Cloud architecture DX Academy(CDA) 3기 최종 프로젝트입니다.

## 01. 프로젝트 소개
**프로젝트명: 뉴썸(NewSum)**

- 주제: 뉴스 기사 요약 웹 서비스 개발 및 인프라 고도화
- 기간: 2025.06.25 ~ 2025.07.31 (27일)
 
- 목표
  - AI 기반 뉴스 요약 웹 서비스 구현
  - 온프레미스 → 클라우드 환경 마이그레이션 및 성능 고도화
  - 트래픽 급증 상황에 안정적으로 대응 가능한 인프라 설계 및 검증

- 기대 효과
  - 사용자는 핵심 뉴스 요약을 빠르게 확인
  - 뉴스레터 서비스를 통해 원하는 주제만 구독 가능
  - 클라우드 마이그레이션 경험을 기반으로 실무 적용성 강화

---

## 02. 기술 스택  

**Front-end**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
 
**Back-end**

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

**Database & AI**

![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
 
**Cloud & Infra**

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)


**Container & Orchestration**

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)

**Monitoring & Visualization**

![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C.svg?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)

---

## 03. 화면

![1](https://github.com/user-attachments/assets/32337da1-8a9e-4d62-afa1-f6d3a6975575)

- **오늘의 뉴스 Top10**  
  - 실시간으로 수집된 뉴스를 기반으로, 조회수 상위 10개의 기사를 요약하여 제공  
  - 날짜와 순위별 기사 제목, 요약문, 언론사 정보 확인 가능  

- **주제별 뉴스**  
  - AI가 뉴스 기사를 주제별(정치, 경제, 사회, 국제, IT/과학, 스포츠 등)로 자동 분류  
  - 사용자는 관심 있는 분야별 요약 기사 확인 가능  

- **언론사별 뉴스**  
  - 주요 언론사(YTN, 동아일보, 보도전문지 등)별 최신 요약 기사 확인 가능  
  - 언론사별 필터링을 통해 특정 매체 기사를 모아볼 수 있음  

![2](https://github.com/user-attachments/assets/6727e986-e2e7-4cf9-b462-d8e161d33aba)

- **AI 요약**: 본문을 AI가 자동 요약하여 핵심 내용만 제공  
- **연관어**: 주요 키워드 및 인물/사건을 자동 추출하여 시각적으로 표시  
- **관련 뉴스**: 동일 주제와 연관된 다른 기사들을 한눈에 확인 가능

![3](https://github.com/user-attachments/assets/869814b9-bcde-4727-b691-7d523f5111ce)

- **사용자 입력**: 이름, 이메일, 성별, 나이 선택  
- **관심 기사 선택**
  - Top10 뉴스  
  - 긴급/속보  
  - 주제별 기사 (정치, 경제, 사회, 국제, 지역, 문화, IT/과학, 스포츠 등)  
- **이메일 발송**: 매일 오전 8시에 선택한 뉴스 카테고리 발송  

---

## 04. 주요 기능

- ✅ 자동 뉴스 수집: 30분마다 Naver API 기반 기사 수집
- 🧠 AI 요약: Gemini 모델을 활용한 본문 요약
- 📂 콘텐츠 분류: 주제별·언론사별·Top10 뉴스 제공
- 📧 구독 서비스: 사용자가 선택한 주제에 대해 매일 오전 8시 이메일 자동 발송
- ☁️ 클라우드 성능 고도화: EC2 Auto Scaling 및 EKS 기반 부하 테스트, 안정성 검증

---

## 05. 아키텍처  

- EC2 Auto Scaling 기반 아키텍처
  - User → Route53 → ALB → WEB → APP → RDS  
![1](https://github.com/user-attachments/assets/9a42764b-b216-4fdb-a1e9-72e4c321c950)

- EKS 기반 아키텍처
  - User → Route53 → ALB → Ingress → Pod(EKS) → RDS  
![2](https://github.com/user-attachments/assets/e6aa826e-54ac-42a2-be15-a3316289c0ee)

---

## 06. EC2 vs EKS 비교 결과

### 📊 EC2 Auto Scaling 기반
<p align="center">
  <img src="https://github.com/user-attachments/assets/fa994b2b-3225-4b96-bbcd-c3aa55701328" width="45%">
  <img src="https://github.com/user-attachments/assets/a9204827-c2f3-42d9-a95f-5dc20daa75b6" width="45%">
</p>

- **모니터링 도구**: ![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white) ![CloudWatch](https://img.shields.io/badge/CloudWatch-FF4F8B?style=for-the-badge)  
- **테스트 결과 (동시 사용자 1000명 기준)**  
  - 전체 요청 수: 41,959건  
  - 성공률: 97.66% (40,974건 성공 / 985건 실패)  
  - 평균 응답 속도: 약 4.8초  
  - 처리량: 약 77.3 req/s

### 📊 EKS 기반
<p align="center">
  <img src="https://github.com/user-attachments/assets/4700e514-c033-4347-9e71-2a68340351e7" width="45%">
  <img src="https://github.com/user-attachments/assets/a21e5cb3-ae35-4498-8c4b-44b33b127c1f" width="45%">
</p>

- **모니터링 도구**: ![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white) ![Grafana](https://img.shields.io/badge/Grafana-F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)  
- **테스트 결과 (동시 사용자 1000명 기준)**  
  - 전체 요청 수: 46,956건  
  - 성공률: 98.01% (46,019건 성공 / 937건 실패)  
  - 평균 응답 속도: 약 4.01초  
  - 처리량: 약 86.5 req/s

### 📌 성능/비용 비교 요약

| 항목 | EC2 Auto Scaling | EKS |
|------|------------------|-----|
| 평균 응답 속도 | 약 4.8초 | 약 4.01초 |
| 처리량 (Throughput) | 77.3 req/s | 86.5 req/s |
| 성공률 | 97.66% | 98.01% |
| 비용 (월 720시간 기준) | 약 $462 | 약 $584 |
| 운영 특성 | 구조 단순, 초기 전환 비용 낮음 | 자동 복구/무중단 배포 지원, 유연한 확장 |

### ✅ 결론
- **EKS**는 성능(응답 속도·처리량)과 안정성 측면에서 더 우수함.  
- 하지만, **EC2**는 비용 효율이 더 높고 구조가 단순해 소규모 서비스에 적합.  
- 따라서 우리 프로젝트 규모에서는 **EC2 Auto Scaling이 합리적인 선택**이었음.
➡️ 향후 더 큰 트래픽이나 멀티 서비스 운영이 필요할 경우, EKS 기반으로 전환하여 확장성과 자동화를 강화할 수 있음.

