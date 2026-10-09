"use client";

import useSWR, { useSWRConfig } from "swr";
import { apiPost, fetcher } from "./api";
import type { ClockState, Dashboard, LocalDateTime } from "./types";

export function useClock() {
  return useSWR<ClockState>("/api/clock", fetcher);
}

export function useDashboard() {
  return useSWR<Dashboard>("/api/dashboard", fetcher);
}

/**
 * 시계 이동·이벤트는 여러 화면의 데이터를 한꺼번에 바꾸므로, 상태를 바꾼 뒤에는 열려 있는 모든 조회를 다시 불러온다.
 */
export function useRevalidateAll() {
  const { mutate } = useSWRConfig();
  return () => mutate(() => true);
}

export function useClockActions() {
  const revalidateAll = useRevalidateAll();
  return {
    advanceTo: async (to: LocalDateTime) => {
      await apiPost<ClockState>("/api/clock/advance", { to });
      await revalidateAll();
    },
    resetScenario: async () => {
      await apiPost<ClockState>("/api/scenario/reset");
      await revalidateAll();
    },
  };
}
