// 백엔드 API 응답 타입. 백엔드 enum 이름을 그대로 쓴다.

/** 백엔드 LocalDateTime. 오프셋 없는 가상 시계 기준 시각 (예: "2026-10-10T09:30:00") */
export type LocalDateTime = string;

/** 백엔드 LocalDate (예: "2026-10-10") */
export type LocalDate = string;

/** 백엔드 LocalTime (예: "11:00:00") */
export type LocalTime = string;

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

export type RoomView = "CITY" | "COURTYARD";

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

export interface OperatorAlert {
  type: AlertType;
  level: AlertLevel;
  since: LocalDateTime;
  roomNumber: string | null;
  reservationId: number;
}

export interface DashboardAlert extends OperatorAlert {
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

// 예약 상세·객실 배정

export type ExclusionReason = "ROOM_TYPE_MISMATCH" | "OUT_OF_SERVICE" | "STAY_OVERLAP";

export type AssignmentLock = "CHECKED_IN" | "NOTICE_SENT";

export interface RoomInfo {
  number: string;
  type: RoomType;
  floor: number;
  view: RoomView;
  status: RoomStatus;
  readyAt: LocalDateTime | null;
}

export interface RequestMatch {
  request: RoomRequest;
  matched: boolean;
}

export interface AssignmentCandidate {
  room: RoomInfo;
  matches: RequestMatch[];
  matchCount: number;
  vacantLastNight: boolean;
  /** 지금 이 예약에 배정된 객실 */
  current: boolean;
}

export interface ConflictingStay {
  reservationId: number;
  guestName: string;
  checkInDate: LocalDate;
  checkOutDate: LocalDate;
}

export interface Exclusion {
  reason: ExclusionReason;
  /** 기간이 겹치는 예약 (겹침이 아니면 null) */
  conflict: ConflictingStay | null;
}

export interface ExcludedRoom {
  room: RoomInfo;
  reasons: Exclusion[];
}

export interface ReservationDetail {
  id: number;
  guestName: string;
  roomType: RoomType;
  checkInDate: LocalDate;
  checkOutDate: LocalDate;
  checkOutTime: LocalTime;
  nights: number;
  requests: RoomRequest[];
  status: ReservationStatus;
  room: RoomInfo | null;
  assignedAt: LocalDateTime | null;
  checkInAt: LocalDateTime;
  offerStatus: OfferStatus | null;
  earlyCheckInAt: LocalDateTime | null;
  earlyCheckInFee: number | null;
  nextStep: NextStep | null;
}

export interface ReservationDetailResponse {
  now: LocalDateTime;
  reservation: ReservationDetail;
  /** 이 예약에 걸린 운영자 알림 */
  alerts: OperatorAlert[];
  assignment: {
    /** 배정을 바꿀 수 없는 이유. 잠겨 있으면 후보를 계산하지 않는다 */
    lock: AssignmentLock | null;
    /** 추천 순서 */
    candidates: AssignmentCandidate[];
    excluded: ExcludedRoom[];
  };
}
