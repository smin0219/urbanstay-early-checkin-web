"use client";

import { Alert, Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { BackToDashboard, GuestScreenLink } from "@/components/ops/entity-links";
import { OperatorAlerts } from "@/components/ops/operator-alerts";
import { ToneBadge } from "@/components/ops/tone-badge";
import { ApiError } from "@/lib/api";
import { useReservation } from "@/lib/hooks";
import { reservationStatusTone } from "@/lib/labels";
import { AssignmentPanel } from "./assignment-panel";
import { ReservationSummary } from "./reservation-summary";

export function ReservationDetailView({ id }: { id: number }) {
  const { data, error } = useReservation(id);

  return (
    <Stack gap="4">
      <BackToDashboard />
      {error ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>
            {error instanceof ApiError && error.status === 404
              ? `예약 ${id}을(를) 찾을 수 없습니다.`
              : `예약을 불러오지 못했습니다: ${error.message}`}
          </Alert.Title>
        </Alert.Root>
      ) : !data ? (
        <Spinner />
      ) : (
        <>
          <HStack gap="3" align="baseline" wrap="wrap">
            <Heading as="h1" size="lg">
              {data.reservation.guestName}
            </Heading>
            <Text textStyle="sm" color="fg.muted">
              예약 #{data.reservation.id}
            </Text>
            <ToneBadge tone={reservationStatusTone[data.reservation.status]} />
            <GuestScreenLink token={data.reservation.checkInToken} />
          </HStack>
          <OperatorAlerts alerts={data.alerts} />
          <ReservationSummary reservation={data.reservation} now={data.now} />
          <Heading as="h2" size="sm" mt="2">
            객실 배정
          </Heading>
          <AssignmentPanel reservation={data.reservation} assignment={data.assignment} />
        </>
      )}
    </Stack>
  );
}
