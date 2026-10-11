"use client";

import { Box, Button, Flex, Group, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { addMinutes, formatDate } from "@/lib/format";
import { useClock, useClockActions } from "@/lib/hooks";
import type { LocalDateTime } from "@/lib/types";
import { ClockStepper } from "./clock-stepper";
import { ClockTimeline } from "./clock-timeline";

const STEPS = [
  { label: "+10분", minutes: 10 },
  { label: "+30분", minutes: 30 },
  { label: "+1시간", minutes: 60 },
];

/**
 * 운영 화면 상단에 고정되는 가상 시계. +10분·+30분·+1시간으로 옮기거나, [시간 변경]으로 목표 시각을 1시간·1분씩 골라
 * 옮기거나, 아래 타임라인에서 원하는 시각을 누른다. 시각을 옮기면 백엔드가 규칙을 평가하고 모든 화면이 다시 조회된다.
 *
 * @param leading 왼쪽에 둘 내용 (서비스 이름)
 */
export function ClockBar({ leading }: { leading: ReactNode }) {
  const { data, error } = useClock();
  const { advanceTo, resetScenario } = useClockActions();
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<LocalDateTime | null>(null);
  // 다른 탭에서 시계가 고르던 시각을 지나가면 그 시각은 버린다
  const target = editing && data && draft && draft > data.now ? draft : null;

  function stopEditing() {
    setEditing(false);
    setDraft(null);
  }

  /** 성공하면 true, 실패하면 오류 문구를 보여주고 false */
  async function run(action: () => Promise<void>): Promise<boolean> {
    setPending(true);
    setActionError(null);
    try {
      await action();
      return true;
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "요청에 실패했습니다");
      return false;
    } finally {
      setPending(false);
    }
  }

  async function moveTo(to: LocalDateTime) {
    if (await run(() => advanceTo(to))) stopEditing();
  }

  async function reset() {
    if (window.confirm("샘플 데이터와 가상 시계를 처음 상태(09:30)로 되돌릴까요?")) {
      if (await run(resetScenario)) stopEditing();
    }
  }

  const disabled = !data || pending;

  return (
    <Stack gap="1">
      <Flex align="center" justify="space-between" gap="4" wrap="wrap">
        {leading}
        <HStack gap="4" flexWrap="wrap" justify="flex-end">
          {actionError && (
            <Text textStyle="xs" color="fg.error" maxW="sm">
              {actionError}
            </Text>
          )}
          <HStack gap="2">
            <Text textStyle="xs" color="fg.muted">
              가상 시계
            </Text>
            {data ? (
              <HStack gap="2">
                <Text textStyle="sm" color="fg.muted">
                  {formatDate(target ?? data.now)}
                </Text>
                <ClockStepper
                  now={data.now}
                  editing={editing}
                  target={target}
                  disabled={disabled}
                  onEdit={() => setEditing(true)}
                  onTargetChange={setDraft}
                  onMove={(to) => void moveTo(to)}
                  onCancel={stopEditing}
                />
              </HStack>
            ) : error ? (
              <Text textStyle="sm" color="fg.error">
                백엔드에 연결할 수 없습니다
              </Text>
            ) : (
              <Skeleton height="6" width="40" />
            )}
          </HStack>
          <Group attached>
            {STEPS.map((step) => (
              <Button
                key={step.minutes}
                size="xs"
                variant="outline"
                disabled={disabled}
                onClick={() => data && void moveTo(addMinutes(data.now, step.minutes))}
              >
                {step.label}
              </Button>
            ))}
          </Group>
          <Box>
            <Button size="xs" variant="ghost" colorPalette="red" onClick={() => void reset()} disabled={pending}>
              시나리오 초기화
            </Button>
          </Box>
        </HStack>
      </Flex>
      {data && (
        <ClockTimeline
          now={data.now}
          milestones={data.milestones}
          selected={target}
          disabled={pending}
          onMove={(to) => void moveTo(to)}
        />
      )}
    </Stack>
  );
}
