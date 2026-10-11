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

export type OfferStatus = "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "REFUNDED";

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

export type MilestoneType =
  | "OFFER_START"
  | "NOON_NOTICE"
  | "CLEANING_WARNING"
  | "OFFER_EXPIRY"
  | "PASSWORD_SEND"
  | "STANDARD_CHECK_IN";

/** 오늘의 규칙 시각 (정책 설정값) */
export interface ClockMilestone {
  at: LocalDateTime;
  type: MilestoneType;
}

export interface ClockState {
  now: LocalDateTime;
  milestones: ClockMilestone[];
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
  /** 고객 화면(/check-in/{token}) 링크 */
  checkInToken: string;
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

// 객실 운영 상세

export type RoomAction = "CHECK_OUT" | "START_CLEANING" | "FINISH_CLEANING";

export type RoomEvent =
  | "INITIAL"
  | "CHECK_OUT"
  | "CLEANING_STARTED"
  | "CLEANING_FINISHED"
  | "ISSUE_REPORTED"
  | "CHECK_IN";

export type MessageType =
  | "NOON_NOTICE"
  | "EARLY_OFFER"
  | "EARLY_CONFIRMATION"
  | "PASSWORD"
  | "DELAY_NOTICE"
  | "EARLY_CHECKIN_REFUND";

export type RuleName = "EARLY_OFFER" | "PASSWORD" | "CLEANING_WARNING" | "EARLY_CHECKOUT";

export type RuleOutcome = "DONE" | "MET" | "NOT_MET";

export type ConditionType =
  | "CHECK_IN_TODAY"
  | "ROOM_ASSIGNED"
  | "ROOM_READY"
  | "OFFER_WINDOW_OPEN"
  | "FIRST_SLOT_BY_DEADLINE"
  | "NO_PREVIOUS_OFFER"
  | "SEND_TIME_REACHED"
  | "WARNING_TIME_REACHED"
  | "ROOM_NOT_READY"
  | "CHECKED_OUT_EARLY"
  | "HAS_ARRIVAL_TODAY"
  | "CLEANING_NOT_STARTED";

export interface RuleCondition {
  type: ConditionType;
  satisfied: boolean;
  /** 비교한 실제 값 (시각 비교가 아니면 null) */
  actual: LocalDateTime | null;
  /** 기준 값 (시각 비교가 아니면 null) */
  threshold: LocalDateTime | null;
}

/** 규칙 엔진 판단 근거 */
export interface RuleCheck {
  rule: RuleName;
  outcome: RuleOutcome;
  conditions: RuleCondition[];
}

export interface Stay {
  reservationId: number;
  guestName: string;
  checkInDate: LocalDate;
  checkOutDate: LocalDate;
  scheduledCheckOut: LocalDateTime;
  status: ReservationStatus;
  checkedOutAt: LocalDateTime | null;
}

export interface RoomArrival {
  reservationId: number;
  guestName: string;
  status: ReservationStatus;
  checkInAt: LocalDateTime;
  offerStatus: OfferStatus | null;
  earlyCheckInAt: LocalDateTime | null;
  earlyCheckInFee: number | null;
  checkedInAt: LocalDateTime | null;
  nextStep: NextStep | null;
  checkInToken: string;
}

export interface TimelineEntry {
  at: LocalDateTime;
  event: RoomEvent;
  from: RoomStatus | null;
  to: RoomStatus;
  guestName: string | null;
}

export interface MessageEntry {
  sentAt: LocalDateTime;
  type: MessageType;
  reservationId: number;
  guestName: string;
  /** 발송 시점의 객실 상태 */
  roomStatus: RoomStatus;
  content: string;
}

export interface RoomDetailResponse {
  now: LocalDateTime;
  room: RoomInfo;
  /** 지금 투숙 중인 다른 예약 (연박 등) */
  inHouse: Stay | null;
  /** 오늘 퇴실하는(또는 퇴실한) 이전 투숙객 */
  departure: Stay | null;
  /** 오늘 입실 예약 */
  arrival: RoomArrival | null;
  /** 지금 누를 수 있는 운영 버튼 */
  actions: RoomAction[];
  ruleChecks: RuleCheck[];
  alerts: OperatorAlert[];
  timeline: TimelineEntry[];
  messages: MessageEntry[];
}

// 고객 얼리체크인

export type GuestStage =
  | "BEFORE_NOTICE"
  | "OFFER_OPEN"
  | "EARLY_CONFIRMED"
  | "WAITING_PASSWORD"
  | "PASSWORD_HELD"
  | "PASSWORD_READY"
  | "CHECKED_IN";

/** 얼리체크인 입실 시각과 요금 */
export interface EarlyCheckInOption {
  checkInAt: LocalDateTime;
  /** "지금 바로" 입실 (정오 전에만). 결제하는 그 시각에 입실한다 */
  immediate: boolean;
  fee: number;
}

export interface GuestCheckInResponse {
  now: LocalDateTime;
  guestName: string;
  checkInDate: LocalDate;
  checkOutDate: LocalDate;
  standardCheckInAt: LocalDateTime;
  stage: GuestStage;
  /** 정오 안내나 얼리체크인 결제 확정 후에만 */
  room: { number: string; floor: number } | null;
  /** 결제를 기다리는 제안이 있을 때만. 정각은 그 전까지, "지금 바로"는 정오 전까지 결제 */
  offer: { options: EarlyCheckInOption[]; deadline: LocalDateTime } | null;
  earlyCheckIn: { checkInAt: LocalDateTime; fee: number; paidAt: LocalDateTime } | null;
  offerStatus: OfferStatus | null;
  /** 비밀번호를 보낼 예정 시각 (입실 시각 15분 전) */
  passwordAt: LocalDateTime | null;
  /** 비밀번호 발송 후에만 */
  password: { doorCode: string; sentAt: LocalDateTime } | null;
  delayed: boolean;
  checkedInAt: LocalDateTime | null;
}
