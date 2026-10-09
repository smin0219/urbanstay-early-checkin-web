// 백엔드 API 응답 타입. 백엔드 enum 이름을 그대로 쓴다.

/** 백엔드 LocalDateTime. 오프셋 없는 가상 시계 기준 시각 (예: "2026-10-10T09:30:00") */
export type LocalDateTime = string;

export type ReservationStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "OFFER_SENT"
  | "EARLY_CONFIRMED"
  | "PASSWORD_SENT"
  | "PASSWORD_HELD"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export type RoomStatus =
  | "OCCUPIED"
  | "CLEANING_PENDING"
  | "CLEANING"
  | "READY"
  | "OUT_OF_SERVICE";

export type RoomType = "STUDIO" | "TWIN" | "DELUXE";

export type RoomRequest = "HIGH_FLOOR" | "CITY_VIEW";

export type OfferStatus = "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export type AlertType =
  | "EARLY_CHECKOUT"
  | "PASSWORD_HELD"
  | "CLEANING_DELAY"
  | "UNASSIGNED";

export type AlertLevel = "CRITICAL" | "WARNING" | "NOTICE";

export type NextStepType =
  | "ASSIGN_ROOM"
  | "WAIT_CHECKOUT"
  | "START_CLEANING"
  | "FINISH_CLEANING"
  | "NOON_NOTICE"
  | "GUEST_PAYMENT"
  | "SEND_PASSWORD"
  | "GUEST_ARRIVAL";

export type Actor = "OPERATOR" | "SYSTEM" | "GUEST";

export interface NextStep {
  type: NextStepType;
  actor: Actor;
  dueAt: LocalDateTime | null;
}

export interface ClockState {
  now: LocalDateTime;
}

export interface DashboardSummary {
  arrivals: number;
  checkedIn: number;
  pendingAssignment: number;
  awaitingCheckout: number;
  cleaning: number;
  ready: number;
  earlyOffered: number;
  earlyConfirmed: number;
  earlyRevenue: number;
  passwordsToUnreadyRooms: number;
}

export interface DashboardAlert {
  type: AlertType;
  level: AlertLevel;
  since: LocalDateTime;
  roomNumber: string | null;
  reservationId: number;
  guestName: string;
  checkInAt: LocalDateTime;
}

export interface ArrivalRow {
  id: number;
  guestName: string;
  roomType: RoomType;
  requests: RoomRequest[];
  roomNumber: string | null;
  roomStatus: RoomStatus | null;
  checkInAt: LocalDateTime;
  status: ReservationStatus;
  offerStatus: OfferStatus | null;
  earlyCheckInAt: LocalDateTime | null;
  earlyCheckInFee: number | null;
  nextStep: NextStep | null;
}

export interface Dashboard {
  now: LocalDateTime;
  summary: DashboardSummary;
  alerts: DashboardAlert[];
  arrivals: ArrivalRow[];
}
