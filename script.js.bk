import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from './k6-reporter.js';
import { textSummary } from './k6-summary.js';

// 테스트 설정
export let options = {
   insecureSkipTLSVerify: true, // 필요한 경우 TLS 검증 비활성화

  scenarios: {
    ramping_users_scenario: {
      executor: 'ramping-vus', // 점진적으로 VUs를 증가시키는 Executor
      startVUs: 0,
      stages: [
        { duration: '1m', target: 500 },    // 1분 동안 VUs를 0에서 50으로 증가 (워밍업)
        { duration: '2m', target: 1500 },   // 다음 2분 동안 VUs를 50에서 150으로 증가 (부하 상승)
        { duration: '2m', target: 1500 },   // 마지막 2분 동안 VUs를 150으로 유지 (최대 부하 유지)
                                           // 총 5분 (1m + 2m + 2m)
      ],
    },
  },

  // (선택 사항) 임계값 설정
//  thresholds: {
//    http_req_failed: ['rate<0.01'],
//    http_req_duration: ['p(95)<500'],
//  },
};

// 각 가상 사용자가 수행할 기본 시나리오
export default function () {
  http.get('https://newsum.click'); // TODO: 실제 서비스 URL로 변경하세요.
  sleep(1); // 1초 대기 (이터레이션 당 RPS에 영향을 줌)
}

// 테스트 요약 및 리포트 생성
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data, { title: 'K6 30K Users in 5M Test Report (No Ramp-Down)' }),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'metrics.json': JSON.stringify(data, null, 2), // 모든 raw 데이터를 JSON 파일로 저장
  };
}
