"use client";

import { Alert, Badge, Card, HStack, Heading, List, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { formatMonthDay, formatTime, formatWon } from "@/lib/format";
import { useGuestCheckIn } from "@/lib/hooks";
import type { GuestCheckInResponse } from "@/lib/types";
import { OfferCard } from "./offer-card";
import { PasswordCard } from "./password-card";

export function GuestCheckInView({ token }: { token: string }) {
  const { data, error } = useGuestCheckIn(token);
  const [actionError, setActionError] = useState<string | null>(null);

  if (error && !data) {
    return (
      <Card.Root>
        <Card.Body>
          <Text fontWeight="semibold">링크를 열 수 없어요</Text>
          <Text textStyle="sm" color="fg.muted">
            {error.message}
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }
  if (!data) {
    return <Spinner />;
  }

  return (
    <Stack gap="4">
      <Stack gap="1">
        <HStack justify="space-between" align="start">
          <Heading as="h1" size="xl">
            {data.guestName}님,
            <br />
            체크인을 안내드려요
          </Heading>
          <Badge variant="subtle" flexShrink={0}>
            지금 {formatTime(data.now)}
          </Badge>
        </HStack>
        <Text textStyle="sm" color="fg.muted">
          {formatMonthDay(data.checkInDate)} 체크인 · {formatMonthDay(data.checkOutDate)} 체크아웃
        </Text>
      </Stack>
      {actionError && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{actionError}</Alert.Title>
        </Alert.Root>
      )}
      {data.stage === "OFFER_OPEN" && <OfferCard token={token} view={data} onError={setActionError} />}
      {data.stage === "PASSWORD_READY" && <PasswordCard token={token} view={data} onError={setActionError} />}
      <StatusCard view={data} />
      {data.room && <RoomGuide room={data.room} />}
    </Stack>
  );
}

/** 지금 단계에서 고객이 알아야 할 것 (결제·비밀번호 카드가 없는 단계) */
function StatusCard({ view }: { view: GuestCheckInResponse }) {
  const message = statusMessage(view);
  if (!message) return null;
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="1">
          <Text textStyle="lg" fontWeight="bold">
            {message.title}
          </Text>
          <Text textStyle="sm" color="fg.muted">
            {message.description}
          </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

function statusMessage(view: GuestCheckInResponse): { title: string; description: string } | null {
  switch (view.stage) {
    case "BEFORE_NOTICE":
      return {
        title: "객실 안내를 준비하고 있어요",
        description: "정오에 호수와 입실 방법을 보내드려요.",
      };
    case "EARLY_CONFIRMED":
      return view.earlyCheckIn
        ? {
            title: `${formatTime(view.earlyCheckIn.checkInAt)} 얼리체크인이 확정됐어요`,
            description: `${formatWon(view.earlyCheckIn.fee)} 결제 완료. ${formatTime(view.earlyCheckIn.checkInAt)}에 비밀번호를 보내드려요.`,
          }
        : null;
    case "WAITING_PASSWORD":
      return {
        title: `비밀번호는 ${formatTime(view.passwordAt)}에 보내드려요`,
        description: waitingReason(view),
      };
    case "PASSWORD_HELD":
      return {
        title: "객실을 준비하고 있어요",
        description: view.delayed
          ? `체크인 시각(${formatTime(view.standardCheckInAt)})보다 늦어져 죄송해요. 준비가 끝나는 즉시 비밀번호를 보내드려요.`
          : "준비가 끝나는 즉시 비밀번호를 보내드려요.",
      };
    case "CHECKED_IN":
      return {
        title: "입실했어요",
        description: `${formatTime(view.checkedInAt)} 입실. 편안한 시간 보내세요.`,
      };
    default:
      return null;
  }
}

function waitingReason(view: GuestCheckInResponse): string {
  switch (view.offerStatus) {
    case "EXPIRED":
      return "얼리체크인 신청 시간이 지났어요. 객실 준비가 확인되면 비밀번호를 보내드려요.";
    case "DECLINED":
      return `기본 체크인(${formatTime(view.standardCheckInAt)})으로 안내드려요.`;
    case "REFUNDED":
      return "객실 점검이 필요해 얼리체크인을 취소하고 환불해 드렸어요. 불편을 드려 죄송해요.";
    default:
      return "객실 준비가 확인되면 비밀번호를 보내드려요.";
  }
}

function RoomGuide({ room }: { room: { number: string; floor: number } }) {
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="3">
          <HStack justify="space-between">
            <Text textStyle="sm" color="fg.muted">
              객실
            </Text>
            <Text textStyle="2xl" fontWeight="bold">
              {room.number}호
            </Text>
          </HStack>
          <Stack gap="2">
            <Text textStyle="sm" fontWeight="semibold">
              입실 방법
            </Text>
            <List.Root as="ol" gap="1" textStyle="sm" ps="5">
              <List.Item>건물 1층 공동현관으로 들어오세요.</List.Item>
              <List.Item>엘리베이터를 타고 {room.floor}층으로 올라오세요.</List.Item>
              <List.Item>{room.number}호 도어락에 비밀번호를 입력하세요.</List.Item>
            </List.Root>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
