import type { ColorPalette } from "@chakra-ui/react";
import type {
  Actor,
  AlertLevel,
  AlertType,
  NextStepType,
  OfferStatus,
  ReservationStatus,
  RoomRequest,
  RoomStatus,
  RoomType,
} from "./types";

interface Tone {
  label: string;
  color: ColorPalette;
}

// 예약 상태와 객실 상태는 다른 열에 따로 표시한다.
export const reservationStatusTone: Record<ReservationStatus, Tone> = {
  PENDING_ASSIGNMENT: { label: "배정 대기", color: "orange" },
  ASSIGNED: { label: "배정됨", color: "blue" },
  OFFER_SENT: { label: "제안 발송", color: "purple" },
  EARLY_CONFIRMED: { label: "얼리 확정", color: "teal" },
  PASSWORD_SENT: { label: "비밀번호 발송", color: "green" },
  PASSWORD_HELD: { label: "비밀번호 보류", color: "red" },
  CHECKED_IN: { label: "입실", color: "gray" },
  CHECKED_OUT: { label: "퇴실", color: "gray" },
};

export const roomStatusTone: Record<RoomStatus, Tone> = {
  OCCUPIED: { label: "사용 중", color: "gray" },
  CLEANING_PENDING: { label: "청소 대기", color: "orange" },
  CLEANING: { label: "청소 중", color: "yellow" },
  READY: { label: "준비 완료", color: "green" },
  OUT_OF_SERVICE: { label: "운영 중지", color: "red" },
};

export const offerStatusTone: Record<OfferStatus, Tone> = {
  SENT: { label: "결제 대기", color: "purple" },
  ACCEPTED: { label: "확정", color: "teal" },
  DECLINED: { label: "거절", color: "gray" },
  EXPIRED: { label: "만료", color: "gray" },
};

export const alertLevelTone: Record<AlertLevel, Tone> = {
  CRITICAL: { label: "긴급", color: "red" },
  WARNING: { label: "경고", color: "orange" },
  NOTICE: { label: "알림", color: "blue" },
};

export const actorTone: Record<Actor, Tone> = {
  OPERATOR: { label: "운영자", color: "orange" },
  SYSTEM: { label: "자동", color: "blue" },
  GUEST: { label: "고객", color: "gray" },
};

export const alertTypeLabel: Record<AlertType, string> = {
  EARLY_CHECKOUT: "조기 퇴실",
  PASSWORD_HELD: "비밀번호 보류",
  CLEANING_DELAY: "청소 지연",
  UNASSIGNED: "미배정",
};

/** 다음 할 일. `due`는 예정 시각(dueAt) 뒤에 붙이는 말 */
export const nextStepLabel: Record<NextStepType, { label: string; due: "까지" | "예정" }> = {
  ASSIGN_ROOM: { label: "객실 배정", due: "까지" },
  WAIT_CHECKOUT: { label: "이전 투숙객 퇴실", due: "예정" },
  START_CLEANING: { label: "청소 시작", due: "까지" },
  FINISH_CLEANING: { label: "청소 완료", due: "까지" },
  NOON_NOTICE: { label: "정오 안내 발송", due: "예정" },
  GUEST_PAYMENT: { label: "얼리체크인 결제", due: "까지" },
  SEND_PASSWORD: { label: "비밀번호 발송", due: "예정" },
  GUEST_ARRIVAL: { label: "고객 입실", due: "예정" },
};

export const roomTypeLabel: Record<RoomType, string> = {
  STUDIO: "Studio",
  TWIN: "Twin",
  DELUXE: "Deluxe",
};

export const roomRequestLabel: Record<RoomRequest, string> = {
  HIGH_FLOOR: "고층",
  CITY_VIEW: "시티뷰",
};
