import { Card, DataList, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { GuestScreenLink, ReservationLink } from "@/components/ops/entity-links";
import { EarlyCheckInLabel, NextStepLabel } from "@/components/ops/reservation-parts";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatMonthDay, formatTime } from "@/lib/format";
import { reservationStatusTone } from "@/lib/labels";
import type { RoomDetailResponse, Stay } from "@/lib/types";

/** 오늘 퇴실(이전 투숙객), 투숙 중(연박), 오늘 입실(다음 예약)을 나란히 보여준다. */
export function RoomStays({ detail }: { detail: RoomDetailResponse }) {
  const { departure, inHouse, arrival, now } = detail;
  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="3">
      {departure && (
        <StayCard title="오늘 퇴실">
          <StayItems stay={departure} />
          <Item label="예정 퇴실">{formatTime(departure.scheduledCheckOut)}</Item>
          <Item label="실제 퇴실">
            {departure.checkedOutAt ? formatTime(departure.checkedOutAt) : <Muted>퇴실 전</Muted>}
          </Item>
        </StayCard>
      )}
      {inHouse && (
        <StayCard title="투숙 중">
          <StayItems stay={inHouse} />
        </StayCard>
      )}
      <StayCard title="오늘 입실">
        {arrival ? (
          <>
            <Item label="고객">
              <HStack gap="2">
                <ReservationLink id={arrival.reservationId}>{arrival.guestName}</ReservationLink>
                <GuestScreenLink token={arrival.checkInToken} />
              </HStack>
            </Item>
            <Item label="예약 상태">
              <ToneBadge tone={reservationStatusTone[arrival.status]} />
            </Item>
            <Item label="체크인">
              {arrival.checkedInAt ? `${formatTime(arrival.checkedInAt)} 입실` : formatTime(arrival.checkInAt)}
            </Item>
            <Item label="얼리체크인">
              <EarlyCheckInLabel
                offerStatus={arrival.offerStatus}
                earlyCheckInAt={arrival.earlyCheckInAt}
                earlyCheckInFee={arrival.earlyCheckInFee}
              />
            </Item>
            <Item label="다음 할 일">
              <NextStepLabel step={arrival.nextStep} now={now} />
            </Item>
          </>
        ) : (
          <Muted>오늘 이 객실에 배정된 입실 예약이 없습니다.</Muted>
        )}
      </StayCard>
    </SimpleGrid>
  );
}

function StayItems({ stay }: { stay: Stay }) {
  return (
    <>
      <Item label="고객">
        <ReservationLink id={stay.reservationId}>{stay.guestName}</ReservationLink>
      </Item>
      <Item label="숙박">
        {formatMonthDay(stay.checkInDate)} → {formatMonthDay(stay.checkOutDate)}
      </Item>
      <Item label="예약 상태">
        <ToneBadge tone={reservationStatusTone[stay.status]} />
      </Item>
    </>
  );
}

function StayCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title textStyle="sm">{title}</Card.Title>
      </Card.Header>
      <Card.Body pt="2">
        <DataList.Root orientation="horizontal" size="sm" gap="2">
          {children}
        </DataList.Root>
      </Card.Body>
    </Card.Root>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <DataList.Item>
      <DataList.ItemLabel minW="20">{label}</DataList.ItemLabel>
      <DataList.ItemValue>{children}</DataList.ItemValue>
    </DataList.Item>
  );
}

function Muted({ children }: { children: ReactNode }) {
  return (
    <Text as="span" textStyle="sm" color="fg.muted">
      {children}
    </Text>
  );
}
