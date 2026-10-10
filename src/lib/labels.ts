import type { ColorPalette } from "@chakra-ui/react";
import { formatTime } from "./format";
import type {
  Actor,
  AlertLevel,
  AlertType,
  AssignmentLock,
  ExclusionReason,
  MessageType,
  MilestoneType,
  RoomAction,
  RoomEvent,
  RuleCondition,
  RuleName,
  NextStepType,
  OfferStatus,
  ReservationStatus,
  RoomRequest,
  RoomStatus,
  RoomType,
  RoomView,
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
  REFUNDED: { label: "환불", color: "red" },
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

/**
 * 다음 할 일. `due`는 예정 시각(dueAt) 뒤에 붙이는 말. "부터"는 그 시각 이후 언제든 되는 일이라 지나도 늦은 것이 아니다.
 */
export const nextStepLabel: Record<NextStepType, { label: string; due: "까지" | "예정" | "부터" }> = {
  ASSIGN_ROOM: { label: "객실 배정", due: "까지" },
  WAIT_CHECKOUT: { label: "이전 투숙객 퇴실", due: "예정" },
  START_CLEANING: { label: "청소 시작", due: "까지" },
  FINISH_CLEANING: { label: "청소 완료", due: "까지" },
  NOON_NOTICE: { label: "정오 안내 발송", due: "예정" },
  GUEST_PAYMENT: { label: "얼리체크인 결제", due: "까지" },
  SEND_PASSWORD: { label: "비밀번호 발송", due: "예정" },
  GUEST_ARRIVAL: { label: "고객 입실", due: "부터" },
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

export const roomViewLabel: Record<RoomView, string> = {
  CITY: "시티뷰",
  COURTYARD: "중정뷰",
};

export const exclusionReasonLabel: Record<ExclusionReason, string> = {
  ROOM_TYPE_MISMATCH: "객실 타입 불일치",
  OUT_OF_SERVICE: "운영 중지",
  STAY_OVERLAP: "숙박 기간 겹침",
};

export const assignmentLockMessage: Record<AssignmentLock, string> = {
  CHECKED_IN: "이미 입실(또는 퇴실)한 예약이라 배정을 바꿀 수 없습니다.",
  NOTICE_SENT: "정오 안내나 얼리체크인 제안이 나간 예약이라 배정을 바꾸거나 취소할 수 없습니다.",
};

export const roomActionLabel: Record<RoomAction, string> = {
  CHECK_OUT: "퇴실 처리",
  START_CLEANING: "청소 시작",
  FINISH_CLEANING: "청소 완료",
};

export const roomEventLabel: Record<RoomEvent, string> = {
  INITIAL: "시나리오 시작",
  CHECK_OUT: "퇴실",
  CLEANING_STARTED: "청소 시작",
  CLEANING_FINISHED: "청소 완료",
  ISSUE_REPORTED: "문제 발견",
  CHECK_IN: "입실",
};

export const messageTypeTone: Record<MessageType, Tone> = {
  NOON_NOTICE: { label: "정오 안내", color: "blue" },
  EARLY_OFFER: { label: "얼리체크인 제안", color: "purple" },
  EARLY_CONFIRMATION: { label: "얼리체크인 확정", color: "teal" },
  PASSWORD: { label: "비밀번호", color: "green" },
  DELAY_NOTICE: { label: "지연 안내", color: "orange" },
  EARLY_CHECKIN_REFUND: { label: "환불 안내", color: "red" },
};

/** 알림 규칙은 조건 충족이 곧 "알림이 떠 있음"이다. */
export const ruleInfo: Record<RuleName, { label: string; alert: boolean }> = {
  EARLY_OFFER: { label: "얼리체크인 제안", alert: false },
  PASSWORD: { label: "비밀번호 발송", alert: false },
  CLEANING_WARNING: { label: "청소 지연 경고", alert: true },
  EARLY_CHECKOUT: { label: "조기 퇴실 알림", alert: true },
};

/** 판단 조건 문구. 시각 비교 조건은 기준 시각을 문구에, 실제 값을 detail에 넣는다. */
export function conditionText(c: RuleCondition): { label: string; detail?: string } {
  const actual = c.actual ? formatTime(c.actual) : undefined;
  const threshold = formatTime(c.threshold);
  switch (c.type) {
    case "CHECK_IN_TODAY":
      return { label: "예약 체크인일이 오늘" };
    case "ROOM_ASSIGNED":
      return { label: "예약에 이 객실이 배정됨" };
    case "ROOM_READY":
      return { label: "객실 준비 완료", detail: actual && `${actual} 준비` };
    case "OFFER_WINDOW_OPEN":
      return { label: `현재 시각 ≥ 제안 시작 시각 ${threshold}`, detail: actual && `현재 ${actual}` };
    case "FIRST_SLOT_BY_DEADLINE":
      return {
        label: `팔 수 있는 첫 입실 시각 ≤ ${threshold}`,
        detail: actual ? `첫 입실 ${actual}` : "객실 준비 전",
      };
    case "NO_PREVIOUS_OFFER":
      return { label: "이 예약에 보낸 제안 없음 (예약당 1회)" };
    case "SEND_TIME_REACHED":
      return { label: `현재 시각 ≥ 발송 시각 ${threshold}`, detail: actual && `현재 ${actual}` };
    case "WARNING_TIME_REACHED":
      return { label: `현재 시각 ≥ 경고 시각 ${threshold}`, detail: actual && `현재 ${actual}` };
    case "ROOM_NOT_READY":
      return { label: "객실 미준비" };
    case "CHECKED_OUT_EARLY":
      return {
        label: `퇴실 시각 ≤ ${threshold} (예정 퇴실보다 30분 이상 일찍)`,
        detail: actual ? `${actual} 퇴실` : "퇴실 전",
      };
    case "HAS_ARRIVAL_TODAY":
      return { label: "이 객실에 오늘 체크인 예약 있음" };
    case "CLEANING_NOT_STARTED":
      return { label: "청소 시작 전" };
  }
}

/** 시계 타임라인의 규칙 시각 이름 */
export const milestoneLabel: Record<MilestoneType, string> = {
  OFFER_START: "제안 시작",
  NOON_NOTICE: "정오 안내",
  CLEANING_WARNING: "청소 경고",
  OFFER_EXPIRY: "제안 만료",
  PASSWORD_SEND: "비밀번호",
  STANDARD_CHECK_IN: "체크인",
};
