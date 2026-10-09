# 어반스테이 얼리체크인 데모 — 프론트엔드

어반스테이 얼리체크인 데모 과제의 웹 화면입니다. 운영 화면과 고객 화면을 맡고, 데이터와 규칙 판단은 백엔드 저장소의 API를 씁니다. 기획은 [docs/planning.md](docs/planning.md)에 있습니다.

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| 웹 | Next.js 16 (App Router, TypeScript), Chakra UI v3, SWR, ESLint |
| CI | GitHub Actions (lint·typecheck·build) |

## 요구 사항

- Node.js 22 이상, npm
- 백엔드 서버 (기본 http://localhost:8080)

## 실행

```bash
npm install
npm run dev    # http://localhost:3000 → /dashboard
```

`/api/*` 요청은 `next.config.ts`의 rewrites로 백엔드에 프록시됩니다. 백엔드 주소가 다르면 `BACKEND_URL`로 지정합니다.

```bash
BACKEND_URL=http://localhost:8081 npm run dev
```

## 화면

| 경로 | 화면 | 상태 |
| --- | --- | --- |
| `/dashboard` | 운영 대시보드: 가상 시계, 요약 카드, 운영자 알림, 오늘 체크인 예약 | 구현 |
| `/reservations/{id}` | 예약 상세·객실 배정: 예약 정보, 추천 객실과 항목별 일치, 제외된 객실과 이유, 배정 | 구현 |
| `/rooms/{number}` | 객실 운영 상세: 퇴실·청소 버튼, 오늘 퇴실·입실 예약, 규칙 엔진 판단 근거, 상태 타임라인, 발송 로그 | 구현 |
| `/check-in/{token}` | 고객 얼리체크인 (모바일) | 예정 |

운영 화면 상단의 가상 시계로 시각을 옮기거나 시나리오를 초기화하면 열린 화면이 모두 다시 조회됩니다.

## 빌드·검사

```bash
npm run lint && npm run typecheck && npm run build
```

CI(`.github/workflows/ci.yml`)는 모든 push와 pull request에서 위와 같은 순서로 실행됩니다.
