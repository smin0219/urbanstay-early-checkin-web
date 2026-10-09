import { Alert, Stack } from "@chakra-ui/react";
import { formatTime } from "@/lib/format";
import { alertTypeLabel } from "@/lib/labels";
import type { AlertLevel, OperatorAlert } from "@/lib/types";

const STATUS: Record<AlertLevel, "error" | "warning" | "info"> = {
  CRITICAL: "error",
  WARNING: "warning",
  NOTICE: "info",
};

function describe(alert: OperatorAlert): string {
  const room = alert.roomNumber ? `${alert.roomNumber}호` : "";
  switch (alert.type) {
    case "EARLY_CHECKOUT":
      return `${room} 이전 투숙객이 ${formatTime(alert.since)}에 일찍 퇴실했습니다. 청소를 앞당기세요.`;
    case "PASSWORD_HELD":
      return `${room} 미준비로 비밀번호를 보류했습니다. 준비 완료 즉시 발송됩니다.`;
    case "CLEANING_DELAY":
      return alert.level === "CRITICAL"
        ? `체크인 시각이 지났지만 ${room} 준비가 끝나지 않았습니다.`
        : `${room} 청소가 아직 끝나지 않았습니다.`;
    case "UNASSIGNED":
      return "객실이 배정되지 않아 정오 안내를 보류하고 있습니다.";
  }
}

/** 상세 화면(예약, 객실) 상단에 띄우는 해당 대상의 운영자 알림 */
export function OperatorAlerts({ alerts }: { alerts: OperatorAlert[] }) {
  if (alerts.length === 0) return null;
  return (
    <Stack gap="2">
      {alerts.map((alert) => (
        <Alert.Root key={`${alert.type}-${alert.reservationId}`} status={STATUS[alert.level]} size="sm">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              {alertTypeLabel[alert.type]} · {formatTime(alert.since)}
            </Alert.Title>
            <Alert.Description>{describe(alert)}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ))}
    </Stack>
  );
}
