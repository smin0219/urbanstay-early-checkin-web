import { Badge, Card, HStack, Table, Text, Wrap } from "@chakra-ui/react";
import { ReservationLink, RoomLink } from "@/components/ops/entity-links";
import { EarlyCheckInLabel, Empty, NextStepLabel } from "@/components/ops/reservation-parts";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatTime } from "@/lib/format";
import {
  reservationStatusTone,
  roomRequestLabel,
  roomStatusTone,
  roomTypeLabel,
} from "@/lib/labels";
import type { ArrivalRow, LocalDateTime } from "@/lib/types";

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
                    {row.roomStatus ? <ToneBadge tone={roomStatusTone[row.roomStatus]} /> : <Empty />}
                  </Table.Cell>
                  <Table.Cell>
                    <EarlyCheckInLabel
                      offerStatus={row.offerStatus}
                      earlyCheckInAt={row.earlyCheckInAt}
                      earlyCheckInFee={row.earlyCheckInFee}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <NextStepLabel step={row.nextStep} now={now} />
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
