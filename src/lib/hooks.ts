"use client";

import useSWR, { useSWRConfig } from "swr";
import { apiDelete, apiPost, fetcher } from "./api";
import type {
  ClockState,
  Dashboard,
  LocalDateTime,
  ReservationDetailResponse,
} from "./types";

export function useClock() {
  return useSWR<ClockState>("/api/clock", fetcher);
}

export function useDashboard() {
  return useSWR<Dashboard>("/api/dashboard", fetcher);
}

export function useReservation(id: number) {
  return useSWR<ReservationDetailResponse>(`/api/reservations/${id}`, fetcher);
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

export function useReservationActions(id: number) {
  const revalidateAll = useRevalidateAll();
  return {
    assignRoom: async (roomNumber: string) => {
      await apiPost<ReservationDetailResponse>(`/api/reservations/${id}/assignment`, { roomNumber });
      await revalidateAll();
    },
    unassign: async () => {
      await apiDelete<ReservationDetailResponse>(`/api/reservations/${id}/assignment`);
      await revalidateAll();
    },
  };
}
