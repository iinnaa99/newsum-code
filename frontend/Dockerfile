# =============================
# 1단계: React 앱 빌드
# =============================
FROM node:20 AS build

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 전체 소스 복사 및 빌드
COPY . .
RUN npm run build

# =============================
# 2단계: Nginx 이미지로 배포
# =============================
FROM nginx:alpine

# ✅ Nginx 기본 설정 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ 빌드된 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx는 기본적으로 80 포트를 사용
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

