import { Badge, Card, DataList, HStack, SimpleGrid, Text, Wrap } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { RoomLink } from "@/components/ops/entity-links";
import { EarlyCheckInLabel, Empty, NextStepLabel } from "@/components/ops/reservation-parts";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatLocalTime, formatMonthDay, formatTime } from "@/lib/format";
import {
  reservationStatusTone,
  roomRequestLabel,
  roomStatusTone,
  roomTypeLabel,
} from "@/lib/labels";
import type { LocalDateTime, ReservationDetail } from "@/lib/types";

interface ReservationSummaryProps {
  reservation: ReservationDetail;
  now: LocalDateTime;
}

/** 왼쪽은 고객이 예약한 내용, 오른쪽은 배정·안내 진행 상황 */
export function ReservationSummary({ reservation: r, now }: ReservationSummaryProps) {
  return (
    <Card.Root size="sm">
      <Card.Body>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: "4", lg: "8" }}>
          <DataList.Root orientation="horizontal" size="sm">
            <Item label="객실 타입">{roomTypeLabel[r.roomType]}</Item>
            <Item label="숙박">
              {formatMonthDay(r.checkInDate)} → {formatMonthDay(r.checkOutDate)} · {r.nights}박
            </Item>
            <Item label="체크인 예정">
              <HStack gap="1.5">
                <Text as="span" fontVariantNumeric="tabular-nums">
                  {formatTime(r.checkInAt)}
                </Text>
                {r.offerStatus === "ACCEPTED" && (
                  <Badge colorPalette="teal" size="sm">
                    얼리
                  </Badge>
                )}
              </HStack>
            </Item>
            <Item label="퇴실 예정">
              {formatMonthDay(r.checkOutDate)} {formatLocalTime(r.checkOutTime)}
            </Item>
            <Item label="요청사항">
              {r.requests.length > 0 ? (
                <Wrap gap="1">
                  {r.requests.map((request) => (
                    <Badge key={request} variant="outline" size="sm">
                      {roomRequestLabel[request]}
                    </Badge>
                  ))}
                </Wrap>
              ) : (
                <Text as="span" color="fg.muted">
                  없음
                </Text>
              )}
            </Item>
          </DataList.Root>
          <DataList.Root orientation="horizontal" size="sm">
            <Item label="예약 상태">
              <ToneBadge tone={reservationStatusTone[r.status]} />
            </Item>
            <Item label="배정 객실">
              {r.room ? (
                <HStack gap="2">
                  <RoomLink number={r.room.number} />
                  <ToneBadge tone={roomStatusTone[r.room.status]} />
                  {r.assignedAt && (
                    <Text as="span" textStyle="xs" color="fg.muted">
                      {formatTime(r.assignedAt)} 배정
                    </Text>
                  )}
                </HStack>
              ) : (
                <Text as="span" color="fg.warning">
                  미배정
                </Text>
              )}
            </Item>
            <Item label="얼리체크인">
              <EarlyCheckInLabel
                offerStatus={r.offerStatus}
                earlyCheckInAt={r.earlyCheckInAt}
                earlyCheckInFee={r.earlyCheckInFee}
              />
            </Item>
            <Item label="다음 할 일">
              {r.nextStep ? <NextStepLabel step={r.nextStep} now={now} /> : <Empty />}
            </Item>
          </DataList.Root>
        </SimpleGrid>
      </Card.Body>
    </Card.Root>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <DataList.Item>
      <DataList.ItemLabel minW="24">{label}</DataList.ItemLabel>
      <DataList.ItemValue>{children}</DataList.ItemValue>
    </DataList.Item>
  );
}
