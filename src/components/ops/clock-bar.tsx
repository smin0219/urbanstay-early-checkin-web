"use client";

import {
  Box,
  Button,
  Group,
  HStack,
  Input,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { addMinutes, atTime, formatDate, formatTime } from "@/lib/format";
import { useClock, useClockActions } from "@/lib/hooks";

const STEPS = [
  { label: "+10분", minutes: 10 },
  { label: "+30분", minutes: 30 },
  { label: "+1시간", minutes: 60 },
];

/** 운영 화면 상단에 고정되는 가상 시계. 시각을 옮기면 백엔드가 규칙을 평가하고 모든 화면이 다시 조회된다. */
export function ClockBar() {
  const { data, error } = useClock();
  const { advanceTo, resetScenario } = useClockActions();
  const [target, setTarget] = useState("");
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setPending(true);
    setActionError(null);
    try {
      await action();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "요청에 실패했습니다");
    } finally {
      setPending(false);
    }
  }

  function submitTarget(event: FormEvent) {
    event.preventDefault();
    if (!data || !target) return;
    void run(async () => {
      await advanceTo(atTime(data.now, target));
      setTarget("");
    });
  }

  function reset() {
    if (window.confirm("샘플 데이터와 가상 시계를 처음 상태(09:30)로 되돌릴까요?")) {
      void run(resetScenario);
    }
  }

  const disabled = !data || pending;

  return (
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
          <HStack gap="1.5" aria-live="polite">
            <Text textStyle="sm" color="fg.muted">
              {formatDate(data.now)}
            </Text>
            <Text textStyle="xl" fontWeight="bold" fontVariantNumeric="tabular-nums">
              {formatTime(data.now)}
            </Text>
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
            onClick={() => data && void run(() => advanceTo(addMinutes(data.now, step.minutes)))}
          >
            {step.label}
          </Button>
        ))}
      </Group>
      <form onSubmit={submitTarget}>
        <HStack gap="1">
          <Input
            type="time"
            size="xs"
            width="28"
            aria-label="이동할 시각"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={disabled}
          />
          <Button type="submit" size="xs" disabled={disabled || !target}>
            이동
          </Button>
        </HStack>
      </form>
      <Box>
        <Button size="xs" variant="ghost" colorPalette="red" onClick={reset} disabled={pending}>
          시나리오 초기화
        </Button>
      </Box>
    </HStack>
  );
}
