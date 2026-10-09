import type { LocalDate, LocalDateTime, LocalTime } from "./types";

// 가상 시계 시각은 오프셋 없는 문자열이라, 브라우저 시간대에 휘둘리지 않도록 Date 변환 없이 다룬다.

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const wonFormat = new Intl.NumberFormat("ko-KR");

/** "2026-10-10T09:30:00" → "09:30" */
export function formatTime(value: LocalDateTime | null | undefined): string {
  return value ? value.slice(11, 16) : "—";
}

/** "11:00:00" → "11:00" */
export function formatLocalTime(value: LocalTime): string {
  return value.slice(0, 5);
}

function parseDate(value: LocalDate | LocalDateTime) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return { year, month, day, weekday };
}

/** "2026-10-10T09:30:00" → "2026. 10. 10. (토)" */
export function formatDate(value: LocalDate | LocalDateTime): string {
  const { year, month, day, weekday } = parseDate(value);
  return `${year}. ${month}. ${day}. (${weekday})`;
}

/** "2026-10-10" → "10. 10. (토)" */
export function formatMonthDay(value: LocalDate | LocalDateTime): string {
  const { month, day, weekday } = parseDate(value);
  return `${month}. ${day}. (${weekday})`;
}

export function formatWon(amount: number): string {
  return `${wonFormat.format(amount)}원`;
}

export function addMinutes(value: LocalDateTime, minutes: number): LocalDateTime {
  const date = new Date(`${value}Z`);
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  return date.toISOString().slice(0, 19);
}

/** 같은 날짜의 다른 시각. `time`은 "HH:mm" */
export function atTime(value: LocalDateTime, time: string): LocalDateTime {
  return `${value.slice(0, 10)}T${time}:00`;
}
