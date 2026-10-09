import {
  Badge,
  Box,
  Card,
  HStack,
  Stack,
  StackSeparator,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { ReservationLink, RoomLink } from "@/components/ops/entity-links";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatTime } from "@/lib/format";
import { alertLevelTone, alertTypeLabel } from "@/lib/labels";
import type { DashboardAlert } from "@/lib/types";

function describe(alert: DashboardAlert): ReactNode {
  const room = alert.roomNumber && <RoomLink number={alert.roomNumber} />;
  const guest = <ReservationLink id={alert.reservationId}>{alert.guestName}</ReservationLink>;
  switch (alert.type) {
    case "EARLY_CHECKOUT":
      return (
        <>
          {room} 이전 투숙객이 {formatTime(alert.since)}에 퇴실했습니다. 다음 체크인 {guest}{" "}
          {formatTime(alert.checkInAt)}
        </>
      );
    case "PASSWORD_HELD":
      return (
        <>
          {room} 미준비로 {guest}님 비밀번호를 보류했습니다. 준비 완료 즉시 발송됩니다.
        </>
      );
    case "CLEANING_DELAY":
      return alert.level === "CRITICAL" ? (
        <>
          체크인 시각({formatTime(alert.checkInAt)})이 지났지만 {room} 준비가 끝나지 않았습니다. {guest}님에게 지연
          안내를 보냈습니다.
        </>
      ) : (
        <>
          {room} 청소가 끝나지 않았습니다. {guest}님 체크인 {formatTime(alert.checkInAt)}
        </>
      );
    case "UNASSIGNED":
      return <>{guest}님 예약에 객실이 배정되지 않아 정오 안내를 보류했습니다.</>;
  }
}

/** 예외가 생긴 객실만 모아 보여준다. 조건이 풀리면(청소 시작, 배정 등) 백엔드 계산에서 빠져 자동으로 사라진다. */
export function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <HStack gap="2">
          <Card.Title textStyle="sm">운영자 알림</Card.Title>
          <Badge colorPalette={alerts.length > 0 ? "red" : "gray"} variant="solid" size="sm">
            {alerts.length}
          </Badge>
        </HStack>
      </Card.Header>
      <Card.Body pt="2">
        {alerts.length === 0 ? (
          <Text textStyle="sm" color="fg.muted">
            처리할 알림이 없습니다.
          </Text>
        ) : (
          <Stack gap="0" separator={<StackSeparator />}>
            {alerts.map((alert) => (
              <HStack key={`${alert.type}-${alert.reservationId}`} py="2" gap="3" align="start">
                <ToneBadge tone={alertLevelTone[alert.level]} flexShrink={0} />
                <Box flex="1" minW="0">
                  <HStack gap="2">
                    <Text textStyle="sm" fontWeight="semibold">
                      {alertTypeLabel[alert.type]}
                    </Text>
                    {alert.type === "EARLY_CHECKOUT" && (
                      <Badge colorPalette="orange" variant="solid" size="sm">
                        청소 우선
                      </Badge>
                    )}
                  </HStack>
                  <Text textStyle="sm" color="fg.muted">
                    {describe(alert)}
                  </Text>
                </Box>
                <Text textStyle="xs" color="fg.muted" fontVariantNumeric="tabular-nums" flexShrink={0}>
                  {formatTime(alert.since)}
                </Text>
              </HStack>
            ))}
          </Stack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
