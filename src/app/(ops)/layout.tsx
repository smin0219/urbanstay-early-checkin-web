import type { ReactNode } from "react";
import { OpsShell } from "@/components/ops/ops-shell";

/** 운영 화면(대시보드, 예약 상세, 객실 운영 상세) 공통 레이아웃. 고객 화면(/check-in)은 이 그룹 밖에 둔다. */
export default function OpsLayout({ children }: { children: ReactNode }) {
  return <OpsShell>{children}</OpsShell>;
}
