"use client";

import { Button, Card, RadioCard, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { formatTime, formatWon } from "@/lib/format";
import { useGuestActions } from "@/lib/hooks";
import type { EarlyCheckInOption, GuestCheckInResponse } from "@/lib/types";

// "지금 바로"는 시각이 계속 바뀌므로 고정 키로 고른다
const optionKey = (option: EarlyCheckInOption) => (option.immediate ? "now" : option.checkInAt);

interface OfferCardProps {
  token: string;
  view: GuestCheckInResponse;
  onError: (message: string | null) => void;
}

/** 입실 시각과 시각별 요금을 고르고 결제(목업)한다. 요금은 결제 시점에 서버가 다시 계산한다. */
export function OfferCard({ token, view, onError }: OfferCardProps) {
  const { pay, decline } = useGuestActions(token);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState<"pay" | "decline" | null>(null);
  // 같은 결제 시도의 재요청(중복 클릭)을 서버가 한 번으로 처리하도록 화면마다 키를 하나 쓴다
  const paymentKey = useRef<string | null>(null);

  const options = view.offer?.options ?? [];
  const option = options.find((o) => optionKey(o) === selected);

  async function run(kind: "pay" | "decline", action: () => Promise<void>) {
    setPending(kind);
    onError(null);
    try {
      await action();
    } catch (e) {
      onError(e instanceof Error ? e.message : "요청에 실패했습니다");
    } finally {
      setPending(null);
    }
  }

  function submitPayment() {
    if (!option) return;
    paymentKey.current ??= crypto.randomUUID();
    const key = paymentKey.current;
    void run("pay", () => pay(option.immediate ? null : option.checkInAt, option.fee, key));
  }

  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="4">
          <Stack gap="1">
            <Text textStyle="lg" fontWeight="bold">
              객실이 준비돼 있어요. 일찍 들어가실래요?
            </Text>
            <Text textStyle="sm" color="fg.muted">
              체크인은 {formatTime(view.standardCheckInAt)}부터예요. 얼리체크인은 일찍 들어갈수록 시간당 요금이
              붙어요.
            </Text>
          </Stack>
          <RadioCard.Root
            value={selected}
            onValueChange={(details) => setSelected(details.value)}
            orientation="horizontal"
          >
            <RadioCard.Label>입실 시각</RadioCard.Label>
            <Stack gap="2">
              {options.map((o) => (
                <RadioCard.Item key={optionKey(o)} value={optionKey(o)}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemContent flex="1" alignItems="flex-start">
                      <RadioCard.ItemText>
                        {o.immediate ? `지금 바로 (${formatTime(o.checkInAt)})` : `${formatTime(o.checkInAt)} 입실`}
                      </RadioCard.ItemText>
                    </RadioCard.ItemContent>
                    <Text fontWeight="semibold" fontVariantNumeric="tabular-nums">
                      {formatWon(o.fee)}
                    </Text>
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              ))}
            </Stack>
          </RadioCard.Root>
          <Stack gap="2">
            <Button
              size="lg"
              colorPalette="blue"
              disabled={!option || pending !== null}
              loading={pending === "pay"}
              onClick={submitPayment}
            >
              {option ? `${formatWon(option.fee)} 결제하기` : "입실 시각을 골라 주세요"}
            </Button>
            <Text textStyle="xs" color="fg.muted" textAlign="center">
              {view.offer && `${formatTime(view.offer.deadline)}까지 신청할 수 있어요. `}데모용 결제라 실제로
              청구되지 않습니다.
            </Text>
            <Button
              variant="ghost"
              disabled={pending !== null}
              loading={pending === "decline"}
              onClick={() => void run("decline", decline)}
            >
              괜찮아요, {formatTime(view.standardCheckInAt)}에 들어갈게요
            </Button>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
