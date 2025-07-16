import http from 'k6/http';
import { check } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  // VU(가상 사용자)를 점진적으로 늘리는 단계를 정의합니다.
  scenarios: {
    ramping_users: {
      executor: 'ramping-vus',
      startVUs: 0, // 0명의 가상 사용자로 시작
      stages: [
        { duration: '30s', target: 20 },  // 30초 동안 20명으로 증가
        { duration: '1m', target: 50 },   // 이어서 1분 동안 50명으로 증가
        { duration: '30s', target: 0 },   // 마지막으로 30초 동안 0명으로 감소
      ],
      gracefulStop: '30s', // 현재 진행 중인 반복 작업이 끝날 때까지 대기하는 시간
    },
  },
  // 임계값 정의
  thresholds: {
    http_req_duration: ['p(95)<500'], // 요청의 95%가 500ms 미만이어야 함
    http_req_failed: ['rate<0.01'], // 실패율이 1% 미만이어야 함
  },
};

export default function () {
  // 새로운 연결을 강제하는 옵션: 'Connection': 'close' 헤더
  let res = http.get('https://newsum.click', {
    headers: { Connection: 'close' }, // HTTP/1.1 Keep-Alive 비활성화
  });
  check(res, { 'status was 200': (r) => r.status === 200 });
}
