import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "운영 대시보드 | 어반스테이 얼리체크인",
};

export default function DashboardPage() {
  return <DashboardView />;
}
