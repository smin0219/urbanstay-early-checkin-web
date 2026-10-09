"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  HStack,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { ReservationLink } from "@/components/ops/entity-links";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatMonthDay } from "@/lib/format";
import { useReservationActions } from "@/lib/hooks";
import {
  assignmentLockMessage,
  exclusionReasonLabel,
  roomRequestLabel,
  roomStatusTone,
  roomTypeLabel,
  roomViewLabel,
} from "@/lib/labels";
import type {
  AssignmentCandidate,
  ExcludedRoom,
  ReservationDetail,
  ReservationDetailResponse,
  RoomRequest,
} from "@/lib/types";

interface AssignmentPanelProps {
  reservation: ReservationDetail;
  assignment: ReservationDetailResponse["assignment"];
}

/** 진행 중인 요청: 배정(객실 번호) 또는 배정 취소 */
type Pending = { kind: "assign"; roomNumber: string } | { kind: "unassign" } | null;

/**
 * 추천 객실(항목별 일치 표시)과 제외된 객실(제외 이유)을 보여주고, 추천 중 하나를 골라 배정한다. 정오 안내 전에는
 * 다른 객실로 바꾸거나 배정을 취소할 수 있다.
 */
export function AssignmentPanel({ reservation, assignment }: AssignmentPanelProps) {
  const { assignRoom, unassign } = useReservationActions(reservation.id);
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);

  if (assignment.lock) {
    return (
      <Alert.Root status="info" size="sm">
        <Alert.Indicator />
        <Alert.Title>{assignmentLockMessage[assignment.lock]}</Alert.Title>
      </Alert.Root>
    );
  }

  async function run(next: NonNullable<Pending>, action: () => Promise<void>) {
    setPending(next);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청에 실패했습니다");
    } finally {
      setPending(null);
    }
  }

  return (
    <Stack gap="4">
      {error && (
        <Alert.Root status="error" size="sm">
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
      <CandidateTable
        candidates={assignment.candidates}
        requests={reservation.requests}
        pending={pending}
        onAssign={(roomNumber) => void run({ kind: "assign", roomNumber }, () => assignRoom(roomNumber))}
        onUnassign={() => void run({ kind: "unassign" }, unassign)}
      />
      <ExcludedTable excluded={assignment.excluded} />
    </Stack>
  );
}

interface CandidateTableProps {
  candidates: AssignmentCandidate[];
  requests: RoomRequest[];
  pending: Pending;
  onAssign: (roomNumber: string) => void;
  onUnassign: () => void;
}

function CandidateTable({ candidates, requests, pending, onAssign, onUnassign }: CandidateTableProps) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <HStack gap="2" align="baseline" wrap="wrap">
          <Card.Title textStyle="sm">추천 객실 ({candidates.length})</Card.Title>
          <Text textStyle="xs" color="fg.muted">
            {requests.length > 0
              ? "요청 일치 수 → 전날 밤 공실 → 객실 번호 순"
              : "요청사항이 없어 전날 밤 공실 → 객실 번호 순"}
          </Text>
        </HStack>
      </Card.Header>
      <Card.Body pt="2">
        {candidates.length === 0 ? (
          <Text textStyle="sm" color="fg.warning">
            배정할 수 있는 객실이 없습니다. 제외된 객실의 이유를 확인하세요.
          </Text>
        ) : (
          <Table.ScrollArea>
            <Table.Root size="sm" interactive>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader width="12">순위</Table.ColumnHeader>
                  <Table.ColumnHeader>객실</Table.ColumnHeader>
                  <Table.ColumnHeader>층 · 뷰</Table.ColumnHeader>
                  <Table.ColumnHeader>객실 상태</Table.ColumnHeader>
                  {requests.map((request) => (
                    <Table.ColumnHeader key={request}>{roomRequestLabel[request]}</Table.ColumnHeader>
                  ))}
                  <Table.ColumnHeader>전날 밤</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">배정</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {candidates.map((candidate, index) => (
                  <Table.Row key={candidate.room.number}>
                    <Table.Cell fontVariantNumeric="tabular-nums">{index + 1}</Table.Cell>
                    <Table.Cell fontWeight="semibold">{candidate.room.number}호</Table.Cell>
                    <Table.Cell>
                      {candidate.room.floor}층 · {roomViewLabel[candidate.room.view]}
                    </Table.Cell>
                    <Table.Cell>
                      <ToneBadge tone={roomStatusTone[candidate.room.status]} />
                    </Table.Cell>
                    {candidate.matches.map((match) => (
                      <Table.Cell key={match.request}>
                        <MatchBadge matched={match.matched} />
                      </Table.Cell>
                    ))}
                    <Table.Cell>
                      {candidate.vacantLastNight ? (
                        <Badge colorPalette="teal" variant="subtle">
                          공실
                        </Badge>
                      ) : (
                        <Text as="span" textStyle="xs" color="fg.muted">
                          투숙 (당일 청소 필요)
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      {/* 모든 행에 같은 크기 버튼을 두어 배정 전후로 행 높이가 바뀌지 않게 한다 */}
                      {candidate.current ? (
                        <CurrentAssignmentButton
                          loading={pending?.kind === "unassign"}
                          disabled={pending !== null}
                          onClick={onUnassign}
                        />
                      ) : (
                        <Button
                          size="xs"
                          colorPalette="blue"
                          loading={pending?.kind === "assign" && pending.roomNumber === candidate.room.number}
                          disabled={pending !== null}
                          onClick={() => onAssign(candidate.room.number)}
                        >
                          배정
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Card.Body>
    </Card.Root>
  );
}

interface CurrentAssignmentButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

/** 배정 완료 표시. 마우스를 올리거나 포커스하면 빨간 "배정 취소" 버튼으로 바뀌고, 누르면 배정을 취소한다. */
function CurrentAssignmentButton({ loading, disabled, onClick }: CurrentAssignmentButtonProps) {
  const [armed, setArmed] = useState(false);
  const cancel = armed || loading;
  return (
    <Button
      size="xs"
      minW="24"
      variant={cancel ? "solid" : "subtle"}
      colorPalette={cancel ? "red" : "green"}
      title="누르면 배정을 취소합니다"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setArmed(true)}
      onMouseLeave={() => setArmed(false)}
      onFocus={() => setArmed(true)}
      onBlur={() => setArmed(false)}
    >
      {cancel ? <LuX /> : <LuCheck />}
      {cancel ? "배정 취소" : "배정 완료"}
    </Button>
  );
}

function MatchBadge({ matched }: { matched: boolean }) {
  return matched ? (
    <Badge colorPalette="green" variant="subtle">
      <LuCheck /> 일치
    </Badge>
  ) : (
    <Badge colorPalette="red" variant="subtle">
      <LuX /> 불일치
    </Badge>
  );
}

function ExcludedTable({ excluded }: { excluded: ExcludedRoom[] }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title textStyle="sm">제외된 객실 ({excluded.length})</Card.Title>
      </Card.Header>
      <Card.Body pt="2">
        {excluded.length === 0 ? (
          <Text textStyle="sm" color="fg.muted">
            제외된 객실이 없습니다.
          </Text>
        ) : (
          <Table.ScrollArea>
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>객실</Table.ColumnHeader>
                  <Table.ColumnHeader>타입</Table.ColumnHeader>
                  <Table.ColumnHeader>층 · 뷰</Table.ColumnHeader>
                  <Table.ColumnHeader>객실 상태</Table.ColumnHeader>
                  <Table.ColumnHeader>제외 이유</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {excluded.map(({ room, reasons }) => (
                  <Table.Row key={room.number}>
                    <Table.Cell fontWeight="semibold">{room.number}호</Table.Cell>
                    <Table.Cell>{roomTypeLabel[room.type]}</Table.Cell>
                    <Table.Cell>
                      {room.floor}층 · {roomViewLabel[room.view]}
                    </Table.Cell>
                    <Table.Cell>
                      <ToneBadge tone={roomStatusTone[room.status]} />
                    </Table.Cell>
                    <Table.Cell>
                      <Stack gap="1">
                        {reasons.map((reason, index) => (
                          <HStack key={index} gap="2" wrap="wrap">
                            <Badge colorPalette="gray" variant="outline">
                              {exclusionReasonLabel[reason.reason]}
                            </Badge>
                            {reason.conflict && (
                              <Text as="span" textStyle="xs" color="fg.muted">
                                <ReservationLink id={reason.conflict.reservationId}>
                                  {reason.conflict.guestName}
                                </ReservationLink>{" "}
                                {formatMonthDay(reason.conflict.checkInDate)} ~{" "}
                                {formatMonthDay(reason.conflict.checkOutDate)}
                              </Text>
                            )}
                          </HStack>
                        ))}
                      </Stack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Card.Body>
    </Card.Root>
  );
}
