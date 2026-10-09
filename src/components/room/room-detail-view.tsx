"use client";

import { Alert, Button, Heading, HStack, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BackToDashboard } from "@/components/ops/entity-links";
import { OperatorAlerts } from "@/components/ops/operator-alerts";
import { ToneBadge } from "@/components/ops/tone-badge";
import { ApiError } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { useRoom, useRoomActions } from "@/lib/hooks";
import { roomActionLabel, roomStatusTone, roomTypeLabel, roomViewLabel } from "@/lib/labels";
import type { RoomAction } from "@/lib/types";
import { MessageLog } from "./message-log";
import { RoomStays } from "./room-stays";
import { RoomTimeline } from "./room-timeline";
import { RuleChecks } from "./rule-checks";

/** 객실 상태 순서대로 누르는 운영 버튼 (퇴실 감지·청소 앱 목업) */
const ACTIONS: RoomAction[] = ["CHECK_OUT", "START_CLEANING", "FINISH_CLEANING"];

export function RoomDetailView({ number }: { number: string }) {
  const { data, error } = useRoom(number);
  const { run } = useRoomActions(number);
  const [pending, setPending] = useState<RoomAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handle(action: RoomAction) {
    setPending(action);
    setActionError(null);
    try {
      await run(action);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "처리하지 못했습니다");
    } finally {
      setPending(null);
    }
  }

  if (error) {
    return (
      <Stack gap="4">
        <BackToDashboard />
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>
            {error instanceof ApiError && error.status === 404
              ? `${number}호를 찾을 수 없습니다.`
              : `객실을 불러오지 못했습니다: ${error.message}`}
          </Alert.Title>
        </Alert.Root>
      </Stack>
    );
  }
  if (!data) {
    return <Spinner />;
  }

  const { room } = data;
  return (
    <Stack gap="4">
      <BackToDashboard />
      <HStack justify="space-between" align="center" wrap="wrap" gap="3">
        <HStack gap="3" align="baseline" wrap="wrap">
          <Heading as="h1" size="lg">
            {room.number}호
          </Heading>
          <Text textStyle="sm" color="fg.muted">
            {roomTypeLabel[room.type]} · {room.floor}층 · {roomViewLabel[room.view]}
          </Text>
          <ToneBadge tone={roomStatusTone[room.status]} />
          {room.status === "READY" && room.readyAt && (
            <Text textStyle="xs" color="fg.muted">
              {formatTime(room.readyAt)} 준비
            </Text>
          )}
        </HStack>
        <HStack gap="2">
          {ACTIONS.map((action) => (
            <Button
              key={action}
              size="sm"
              variant={data.actions.includes(action) ? "solid" : "outline"}
              colorPalette="blue"
              disabled={!data.actions.includes(action) || pending !== null}
              loading={pending === action}
              onClick={() => void handle(action)}
            >
              {roomActionLabel[action]}
            </Button>
          ))}
        </HStack>
      </HStack>
      {actionError && (
        <Alert.Root status="error" size="sm">
          <Alert.Indicator />
          <Alert.Title>{actionError}</Alert.Title>
        </Alert.Root>
      )}
      <OperatorAlerts alerts={data.alerts} />
      <RoomStays detail={data} />
      <RuleChecks checks={data.ruleChecks} />
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="3" alignItems="start">
        <RoomTimeline entries={data.timeline} />
        <MessageLog messages={data.messages} />
      </SimpleGrid>
    </Stack>
  );
}
