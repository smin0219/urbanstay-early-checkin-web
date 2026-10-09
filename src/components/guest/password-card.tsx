"use client";

import { Button, Card, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { formatTime } from "@/lib/format";
import { useGuestActions } from "@/lib/hooks";
import type { GuestCheckInResponse } from "@/lib/types";

interface PasswordCardProps {
  token: string;
  view: GuestCheckInResponse;
  onError: (message: string | null) => void;
}

/** 비밀번호 발송 후: 도어락 비밀번호와 입실 버튼(도어락 첫 사용 목업) */
export function PasswordCard({ token, view, onError }: PasswordCardProps) {
  const { openDoor } = useGuestActions(token);
  const [pending, setPending] = useState(false);
  if (!view.password) return null;

  async function enter() {
    setPending(true);
    onError(null);
    try {
      await openDoor();
    } catch (e) {
      onError(e instanceof Error ? e.message : "요청에 실패했습니다");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="4" align="center" textAlign="center">
          <Stack gap="1">
            <Text textStyle="sm" color="fg.muted">
              {view.room?.number}호 도어락 비밀번호
            </Text>
            <Text
              fontSize="4xl"
              fontWeight="bold"
              letterSpacing="0.3em"
              fontFamily="mono"
              fontVariantNumeric="tabular-nums"
            >
              {view.password.doorCode}
            </Text>
            <Text textStyle="xs" color="fg.muted">
              {formatTime(view.password.sentAt)} 발송
            </Text>
          </Stack>
          <Button size="lg" colorPalette="blue" width="full" loading={pending} onClick={() => void enter()}>
            도어락 열고 입실하기
          </Button>
          <Text textStyle="xs" color="fg.muted">
            실제 도어락 대신 입실을 기록하는 데모 버튼입니다.
          </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
