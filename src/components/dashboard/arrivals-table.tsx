import { Badge, Card, HStack, Table, Text, Wrap } from "@chakra-ui/react";
import { ReservationLink, RoomLink } from "@/components/ops/entity-links";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatTime, formatWon } from "@/lib/format";
import {
  actorTone,
  nextStepLabel,
  offerStatusTone,
  reservationStatusTone,
  roomRequestLabel,
  roomStatusTone,
  roomTypeLabel,
} from "@/lib/labels";
import type { ArrivalRow, LocalDateTime, NextStep } from "@/lib/types";

const EMPTY = (
  <Text as="span" color="fg.subtle">
    —
  </Text>
);

function EarlyCheckIn({ row }: { row: ArrivalRow }) {
  if (!row.offerStatus) return EMPTY;
  return (
    <HStack gap="1.5">
      <ToneBadge tone={offerStatusTone[row.offerStatus]} />
      {row.offerStatus === "ACCEPTED" && row.earlyCheckInFee !== null && (
        <Text as="span" textStyle="xs" fontVariantNumeric="tabular-nums">
          {formatTime(row.earlyCheckInAt)} · {formatWon(row.earlyCheckInFee)}
        </Text>
      )}
    </HStack>
  );
}

function NextStepCell({ step, now }: { step: NextStep | null; now: LocalDateTime }) {
  if (!step) return EMPTY;
  const { label, due } = nextStepLabel[step.type];
  // 같은 형식의 ISO 문자열이라 문자열 비교로 시각 순서를 판단한다
  const overdue = step.dueAt !== null && step.dueAt < now;
  return (
    <HStack gap="1.5">
      <ToneBadge tone={actorTone[step.actor]} size="sm" />
      <Text as="span">{label}</Text>
      {step.dueAt && (
        <Text
          as="span"
          textStyle="xs"
          color={overdue ? "fg.error" : "fg.muted"}
          fontVariantNumeric="tabular-nums"
        >
          {formatTime(step.dueAt)} {overdue ? "지남" : due}
        </Text>
      )}
    </HStack>
  );
}

export function ArrivalsTable({ arrivals, now }: { arrivals: ArrivalRow[]; now: LocalDateTime }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title textStyle="sm">오늘 체크인 예약 ({arrivals.length})</Card.Title>
      </Card.Header>
      <Card.Body pt="2">
        <Table.ScrollArea>
          <Table.Root size="sm" interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>고객</Table.ColumnHeader>
                <Table.ColumnHeader>객실 타입</Table.ColumnHeader>
                <Table.ColumnHeader>배정 객실</Table.ColumnHeader>
                <Table.ColumnHeader>체크인</Table.ColumnHeader>
                <Table.ColumnHeader>예약 상태</Table.ColumnHeader>
                <Table.ColumnHeader>객실 상태</Table.ColumnHeader>
                <Table.ColumnHeader>얼리체크인</Table.ColumnHeader>
                <Table.ColumnHeader>다음 할 일</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {arrivals.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>
                    <HStack gap="2">
                      <ReservationLink id={row.id}>{row.guestName}</ReservationLink>
                      <Wrap gap="1">
                        {row.requests.map((request) => (
                          <Badge key={request} variant="outline" size="sm">
                            {roomRequestLabel[request]}
                          </Badge>
                        ))}
                      </Wrap>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>{roomTypeLabel[row.roomType]}</Table.Cell>
                  <Table.Cell>
                    {row.roomNumber ? (
                      <RoomLink number={row.roomNumber} />
                    ) : (
                      <Text as="span" color="fg.warning">
                        미배정
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell fontVariantNumeric="tabular-nums">
                    <HStack gap="1.5">
                      <Text as="span">{formatTime(row.checkInAt)}</Text>
                      {row.offerStatus === "ACCEPTED" && (
                        <Badge colorPalette="teal" size="sm">
                          얼리
                        </Badge>
                      )}
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <ToneBadge tone={reservationStatusTone[row.status]} />
                  </Table.Cell>
                  <Table.Cell>
                    {row.roomStatus ? <ToneBadge tone={roomStatusTone[row.roomStatus]} /> : EMPTY}
                  </Table.Cell>
                  <Table.Cell>
                    <EarlyCheckIn row={row} />
                  </Table.Cell>
                  <Table.Cell>
                    <NextStepCell step={row.nextStep} now={now} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card.Body>
    </Card.Root>
  );
}
