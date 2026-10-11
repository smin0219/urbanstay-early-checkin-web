"use client";

import { Badge, Box, chakra, Text } from "@chakra-ui/react";
import { useRef, useState, type MouseEvent } from "react";
import { atMinutes, formatTime, minutesOfDay } from "@/lib/format";
import { milestoneLabel } from "@/lib/labels";
import type { ClockMilestone, LocalDateTime } from "@/lib/types";

const DAY_START = 9 * 60;
const DAY_END = 16 * 60;
/** +10분 버튼과 같은 단위로 맞춘다 */
const STEP = 10;

const hourLabel = (minutes: number) => `${String(minutes / 60).padStart(2, "0")}:00`;

interface ClockTimelineProps {
  now: LocalDateTime;
  milestones: ClockMilestone[];
  /** 시계의 ▲▼로 고르는 중인 목표 시각. 마우스를 올리지 않았을 때 같은 표시로 보여준다 */
  selected: LocalDateTime | null;
  disabled: boolean;
  onMove: (to: LocalDateTime) => void;
}

/**
 * 하루 타임라인. 지난 구간을 채워 지금 위치를 보여주고, 규칙 시각을 눈금과 이름으로 표시한다. 앞쪽 지점이나 규칙 시각
 * 이름을 누르면 그 시각(10분 단위)으로 옮긴다. 시계는 앞으로만 움직이므로 지난 구간은 누를 수 없다.
 */
export function ClockTimeline({ now, milestones, selected, disabled, onMove }: ClockTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const current = minutesOfDay(now);
  // 다음 날로 넘어가는 목표 시각은 이 타임라인에 그리지 않는다
  const picked = selected && selected.slice(0, 10) === now.slice(0, 10) ? minutesOfDay(selected) : null;
  // 시계나 목표 시각이 범위 끝을 넘어가면 범위를 늘린다
  const end = Math.max(DAY_END, Math.ceil((Math.max(current, picked ?? 0) + STEP) / 60) * 60);
  const span = end - DAY_START;
  const left = (minutes: number) => `${((Math.min(Math.max(minutes, DAY_START), end) - DAY_START) / span) * 100}%`;
  const hours = Array.from({ length: span / 60 + 1 }, (_, i) => DAY_START + i * 60);
  // 마우스를 그대로 둔 채 시계가 지나가면 가리키던 시각도 지난 시각이 되므로 보여주지 않는다
  const hovered = hover !== null && hover > current ? hover : null;
  const target = hovered ?? picked;

  /** 마우스가 가리키는 앞쪽 시각 (10분 단위). 지난 구간이면 null */
  function pointed(event: MouseEvent): number | null {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const ratio = (event.clientX - rect.left) / rect.width;
    const minutes = Math.round((DAY_START + ratio * span) / STEP) * STEP;
    return minutes > current && minutes <= end ? minutes : null;
  }

  function move(minutes: number) {
    if (!disabled && minutes > current) onMove(atMinutes(now, minutes));
  }

  return (
    <Box position="relative" pt="5" pb={{ base: "1", md: "9" }} userSelect="none">
      {hours.map((minutes) => (
        <Text
          key={minutes}
          position="absolute"
          top="0"
          left={left(minutes)}
          transform="translateX(-50%)"
          textStyle="2xs"
          color="fg.subtle"
          fontVariantNumeric="tabular-nums"
        >
          {hourLabel(minutes)}
        </Text>
      ))}

      {/* 누르는 영역. 보이는 막대보다 높게 잡아 누르기 쉽게 한다 (키보드는 +버튼과 규칙 시각 이름으로 조작) */}
      <Box
        ref={trackRef}
        position="relative"
        h="6"
        cursor={disabled ? "progress" : hovered !== null ? "pointer" : "default"}
        onMouseMove={(event) => setHover(pointed(event))}
        onMouseLeave={() => setHover(null)}
        onClick={(event) => {
          const minutes = pointed(event);
          if (minutes !== null) move(minutes);
        }}
        aria-hidden
      >
        <Box position="absolute" top="50%" left="0" right="0" h="1.5" mt="-0.75" rounded="full" bg="bg.emphasized" />
        <Box position="absolute" top="50%" left="0" width={left(current)} h="1.5" mt="-0.75" rounded="full" bg="blue.solid" />
        {milestones.map((milestone) => {
          const minutes = minutesOfDay(milestone.at);
          return (
            <Box
              key={milestone.type}
              position="absolute"
              top="50%"
              left={left(minutes)}
              transform="translate(-50%, -50%)"
              w="0.5"
              h="4"
              rounded="full"
              bg={minutes <= current ? "border.emphasized" : "orange.solid"}
            />
          );
        })}
        {target !== null && (
          <>
            <Box position="absolute" top="0" bottom="0" left={left(target)} w="0.5" ms="-px" bg="blue.solid" opacity={0.5} />
            <Badge
              position="absolute"
              top="-6"
              left={left(target)}
              transform="translateX(-50%)"
              colorPalette="blue"
              variant="solid"
              size="sm"
              whiteSpace="nowrap"
              pointerEvents="none"
              zIndex="1"
            >
              → {formatTime(atMinutes(now, target))}
            </Badge>
          </>
        )}
        <Box
          position="absolute"
          top="50%"
          left={left(current)}
          transform="translate(-50%, -50%)"
          boxSize="3.5"
          rounded="full"
          bg="blue.solid"
          borderWidth="2px"
          borderColor="bg"
          pointerEvents="none"
        />
      </Box>

      {milestones.map((milestone) => {
        const minutes = minutesOfDay(milestone.at);
        const past = minutes <= current;
        return (
          <chakra.button
            key={milestone.type}
            type="button"
            position="absolute"
            top="12"
            left={left(minutes)}
            transform="translateX(-50%)"
            display={{ base: "none", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            lineHeight="1.3"
            textStyle="2xs"
            color={past ? "fg.subtle" : "fg"}
            cursor={past || disabled ? "default" : "pointer"}
            disabled={past || disabled}
            title={past ? undefined : "누르면 이 시각으로 이동"}
            onClick={() => move(minutes)}
            _hover={past ? undefined : { color: "blue.fg" }}
          >
            <Text as="span" fontVariantNumeric="tabular-nums">
              {formatTime(milestone.at)}
            </Text>
            <Text as="span" fontWeight="medium" whiteSpace="nowrap">
              {milestoneLabel[milestone.type]}
            </Text>
          </chakra.button>
        );
      })}
    </Box>
  );
}
