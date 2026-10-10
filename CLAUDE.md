# CLAUDE.md

어반스테이 얼리체크인 데모 과제의 프론트엔드. 이 파일의 규칙은 이후 모든 구현에서 지킨다.
API와 규칙 판단은 백엔드 저장소(Spring Boot)가 맡는다. 기획서는 저장소에 두지 않는다 (과제 제출 이메일에 첨부).

## 구조

- Next.js 16 (App Router, TypeScript, `src/`), Chakra UI v3, SWR
- `.github/workflows/ci.yml` — push / pull_request 시 lint → typecheck → build (배포 없음)

## 명령어

```bash
npm run lint && npm run typecheck && npm run build
npm run dev    # 포트 3000, /api/* → http://localhost:8080/api/* 프록시
```

변경 후에는 CI와 같은 순서(lint → typecheck → build)로 통과를 확인한다.

## 규칙

- UI는 **Chakra UI v3** 컴포넌트로 작성한다.
  - v2 API(`ChakraProvider` 단독 사용, `extendTheme` 등)는 쓰지 않는다. Provider는 `src/components/ui/provider.tsx`(Chakra CLI snippet)를 사용한다.
  - Tailwind, CSS Modules 등 다른 스타일 도구를 추가하지 않는다.
- 화면 스타일
  - 운영 화면: 정보 밀도가 높은 **대시보드** 스타일
  - 고객 화면(`/check-in`)만 **모바일** 스타일로 분리
- 화면 구성
  - 운영 화면은 `src/app/(ops)/` 아래에 둔다. 공통 레이아웃이 상단 가상 시계(`components/ops/clock-bar.tsx`)를 고정한다.
  - 고객 화면(`/check-in/[token]`)은 `(ops)` 그룹 밖에 두어 운영 레이아웃을 쓰지 않는다.
- 백엔드 호출은 상대 경로 `/api/...`로 한다 (`next.config.ts`의 rewrites가 8080으로 프록시, `BACKEND_URL`로 변경 가능).
- 도메인 규칙(제안 조건, 요금, 운영자 알림, 다음 할 일)은 백엔드가 판단한다. 화면은 API 결과를 보여주고 같은 규칙을 다시 계산하지 않는다.
- 데이터 조회는 SWR 훅(`src/lib/hooks.ts`)으로 한다. 상태를 바꾸는 호출(시각 이동, 이벤트, 결제) 뒤에는 `useRevalidateAll()`로 열린 조회를 모두 다시 불러온다.
- 상태 라벨·색은 `src/lib/labels.ts`, API 타입은 `src/lib/types.ts`에 모은다.
- 가상 시계 시각(오프셋 없는 `LocalDateTime` 문자열)은 브라우저 시간대 영향을 받지 않도록 `Date`로 바꾸지 않고 `src/lib/format.ts` 함수로 다룬다.
- CI는 `build` 전에 `typecheck`(`tsc --noEmit`)를 돌리므로, Next가 빌드 때 생성하는 전역 타입(`PageProps`, `LayoutProps` 등)에 의존하지 않는다. props 타입은 직접 선언한다.
- Next.js 16은 학습 데이터와 API가 다를 수 있다. 구현 전 `node_modules/next/dist/docs/`의 해당 문서를 확인한다 (`AGENTS.md` 참고).

## 범위 밖

MySQL, Docker, OTA·문자·결제·도어락 실연동, 로그인
