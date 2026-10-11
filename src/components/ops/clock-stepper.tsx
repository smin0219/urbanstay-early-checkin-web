"use client";

import { Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { addMinutes, formatTime } from "@/lib/format";
import type { LocalDateTime } from "@/lib/types";

/** 백엔드와 같은 한도: 한 번에 하루까지만 옮길 수 있다 */
const MAX_AHEAD_MINUTES = 24 * 60;

interface ClockStepperProps {
  now: LocalDateTime;
  /** 시간 변경 중인지. 아니면 시각과 [시간 변경] 버튼만 보여준다 */
  editing: boolean;
  /** 고르는 중인 목표 시각 (현재 시각 이후). 없으면 현재 시각을 보여준다 */
  target: LocalDateTime | null;
  disabled: boolean;
  onEdit: () => void;
  onTargetChange: (target: LocalDateTime | null) => void;
  onMove: (to: LocalDateTime) => void;
  onCancel: () => void;
}

/**
 * 가상 시계 시각. [시간 변경]을 누르면 시·분 옆에 ▲▼가 나와 목표 시각을 1시간·1분씩 고르고 [이동]으로 옮긴다. 시계는
 * 앞으로만 움직이므로 ▼는 현재 시각까지만 내려간다.
 */
export function ClockStepper({
  now,
  editing,
  target,
  disabled,
  onEdit,
  onTargetChange,
  onMove,
  onCancel,
}: ClockStepperProps) {
  const shown = target ?? now;
  const latest = addMinutes(now, MAX_AHEAD_MINUTES);
  const numberColor = target ? "blue.fg" : undefined;

  function step(minutes: number) {
    const next = addMinutes(shown, minutes);
    onTargetChange(next > now ? next : null);
  }

  const arrows = (label: string, minutes: number) => (
    <Stack gap="0">
      <IconButton
        aria-label={`${label} 늘리기`}
        size="2xs"
        variant="ghost"
        h="3.5"
        minW="5"
        _icon={{ boxSize: "3" }}
        disabled={disabled || addMinutes(shown, minutes) > latest}
        onClick={() => step(minutes)}
      >
        <LuChevronUp />
      </IconButton>
      <IconButton
        aria-label={`${label} 줄이기`}
        size="2xs"
        variant="ghost"
        h="3.5"
        minW="5"
        _icon={{ boxSize: "3" }}
        disabled={disabled || !target}
        onClick={() => step(-minutes)}
      >
        <LuChevronDown />
      </IconButton>
    </Stack>
  );

  const number = (value: string) => (
    <Text textStyle="xl" fontWeight="bold" fontVariantNumeric="tabular-nums" color={numberColor}>
      {value}
    </Text>
  );

  if (!editing) {
    return (
      <HStack gap="2">
        <Text textStyle="xl" fontWeight="bold" fontVariantNumeric="tabular-nums" aria-live="polite">
          {formatTime(now)}
        </Text>
        <Button size="xs" variant="subtle" disabled={disabled} onClick={onEdit}>
          시간 변경
        </Button>
      </HStack>
    );
  }

  return (
    <HStack gap="2">
      {target && (
        <Text textStyle="xs" color="fg.muted" fontVariantNumeric="tabular-nums">
          지금 {formatTime(now)} →
        </Text>
      )}
      <HStack gap="0.5" aria-live="polite">
        {number(shown.slice(11, 13))}
        {arrows("1시간", 60)}
        <Text textStyle="xl" fontWeight="bold" color={numberColor}>
          :
        </Text>
        {number(shown.slice(14, 16))}
        {arrows("1분", 1)}
      </HStack>
      <HStack gap="1">
        <Button size="xs" colorPalette="blue" disabled={disabled || !target} onClick={() => target && onMove(target)}>
          이동
        </Button>
        <Button size="xs" variant="ghost" disabled={disabled} onClick={onCancel}>
          취소
        </Button>
      </HStack>
    </HStack>
  );
}
