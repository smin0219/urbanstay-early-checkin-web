"use client";

import useSWR, { useSWRConfig } from "swr";
import { apiDelete, apiPost, fetcher } from "./api";
import type {
  ClockState,
  Dashboard,
  GuestCheckInResponse,
  LocalDateTime,
  ReservationDetailResponse,
  RoomAction,
  RoomDetailResponse,
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

export function useRoom(number: string) {
  return useSWR<RoomDetailResponse>(`/api/rooms/${number}`, fetcher);
}

/** 고객 화면은 운영 화면과 다른 탭에서 열리므로, 운영자가 시계를 옮기면 따라오도록 주기적으로 다시 조회한다. */
export function useGuestCheckIn(token: string) {
  return useSWR<GuestCheckInResponse>(`/api/check-in/${token}`, fetcher, { refreshInterval: 3000 });
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

const ROOM_ACTION_PATH: Record<RoomAction, string> = {
  CHECK_OUT: "checkout",
  START_CLEANING: "cleaning/start",
  FINISH_CLEANING: "cleaning/finish",
};

export function useRoomActions(number: string) {
  const revalidateAll = useRevalidateAll();
  return {
    run: async (action: RoomAction) => {
      await apiPost<RoomDetailResponse>(`/api/rooms/${number}/${ROOM_ACTION_PATH[action]}`);
      await revalidateAll();
    },
  };
}

export function useGuestActions(token: string) {
  const revalidateAll = useRevalidateAll();
  const base = `/api/check-in/${token}`;
  return {
    /** `checkInAt`이 null이면 "지금 바로" */
    pay: async (checkInAt: LocalDateTime | null, expectedFee: number, idempotencyKey: string) => {
      await apiPost<GuestCheckInResponse>(`${base}/payment`, { checkInAt, expectedFee, idempotencyKey });
      await revalidateAll();
    },
    decline: async () => {
      await apiPost<GuestCheckInResponse>(`${base}/decline`);
      await revalidateAll();
    },
    openDoor: async () => {
      await apiPost<GuestCheckInResponse>(`${base}/door`);
      await revalidateAll();
    },
  };
}
