"use client";

import { Button, Card, RadioCard, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { formatTime, formatWon } from "@/lib/format";
import { useGuestActions } from "@/lib/hooks";
import type { EarlyCheckInOption, GuestCheckInResponse } from "@/lib/types";

// "지금 바로"는 보는 시각에 따라 값이 바뀌므로 고정 키로 고른다
const optionKey = (option: EarlyCheckInOption) => (option.immediate ? "now" : option.checkInAt);

interface OfferCardProps {
  token: string;
  view: GuestCheckInResponse;
  onError: (message: string | null) => void;
}

/**
 * 입실 시각(정오 전에는 "지금 바로", 12시부터는 정각)과 요금을 고르고 결제(목업)한다. 서버가 결제 시점에 시각과 요금을 다시
 * 확인한다.
 */
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
              체크인은 {formatTime(view.standardCheckInAt)}부터예요. 원하는 입실 시각을 골라 결제하시면 호수와 입실
              방법을 바로 알려 드려요.
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
                        {o.immediate ? "지금 바로 입실" : `${formatTime(o.checkInAt)} 입실`}
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
              {options.some((o) => o.immediate)
                ? "지금 바로 입실은 결제하면 비밀번호를 바로 보내 드려요. 정각 입실은 그 시각 전까지 결제할 수 있어요."
                : "고른 시각 전까지 결제할 수 있어요."}{" "}
              데모용 결제라 실제로 청구되지 않습니다.
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
