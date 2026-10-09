import { HStack, Text } from "@chakra-ui/react";
import { formatTime, formatWon } from "@/lib/format";
import { actorTone, nextStepLabel, offerStatusTone } from "@/lib/labels";
import type { LocalDateTime, NextStep, OfferStatus } from "@/lib/types";
import { ToneBadge } from "./tone-badge";

// 여러 운영 화면에서 같은 모양으로 보여주는 예약 정보 조각

export function Empty() {
  return (
    <Text as="span" color="fg.subtle">
      —
    </Text>
  );
}

/** 다음 할 일: 주체 배지 + 할 일 + 예정·기한 시각 (지났으면 빨간색) */
export function NextStepLabel({ step, now }: { step: NextStep | null; now: LocalDateTime }) {
  if (!step) return <Empty />;
  const { label, due } = nextStepLabel[step.type];
  // 같은 형식의 ISO 문자열이라 문자열 비교로 시각 순서를 판단한다
  const overdue = due !== "부터" && step.dueAt !== null && step.dueAt < now;
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

interface EarlyCheckInLabelProps {
  offerStatus: OfferStatus | null;
  earlyCheckInAt: LocalDateTime | null;
  earlyCheckInFee: number | null;
}

/** 얼리체크인 제안 상태. 확정이면 입실 시각과 요금을 함께 보여준다. */
export function EarlyCheckInLabel({ offerStatus, earlyCheckInAt, earlyCheckInFee }: EarlyCheckInLabelProps) {
  if (!offerStatus) return <Empty />;
  return (
    <HStack gap="1.5">
      <ToneBadge tone={offerStatusTone[offerStatus]} />
      {offerStatus === "ACCEPTED" && earlyCheckInFee !== null && (
        <Text as="span" textStyle="xs" fontVariantNumeric="tabular-nums">
          {formatTime(earlyCheckInAt)} · {formatWon(earlyCheckInFee)}
        </Text>
      )}
    </HStack>
  );
}
