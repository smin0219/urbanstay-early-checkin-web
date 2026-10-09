import { Box, Card, HStack, Link, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { ReservationLink } from "@/components/ops/entity-links";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatTime } from "@/lib/format";
import { messageTypeTone, roomStatusTone } from "@/lib/labels";
import type { MessageEntry } from "@/lib/types";

const CHECK_IN_LINK = /(\/check-in\/[A-Za-z0-9_-]+)/;

/** 문자 본문에 든 고객 화면 링크를 눌러 볼 수 있게 한다. */
function Content({ text }: { text: string }) {
  return (
    <>
      {text.split(CHECK_IN_LINK).map((part, index) =>
        CHECK_IN_LINK.test(part) ? (
          <Link key={index} href={part} target="_blank" rel="noreferrer" colorPalette="blue">
            {part}
          </Link>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** 고객 문자 발송 기록 (목업). 발송 시점의 객실 상태를 함께 보여 "미준비 객실 비밀번호 0건"을 확인할 수 있다. */
export function MessageLog({ messages }: { messages: MessageEntry[] }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title textStyle="sm">발송 로그 ({messages.length})</Card.Title>
      </Card.Header>
      <Card.Body pt="2">
        {messages.length === 0 ? (
          <Text textStyle="sm" color="fg.muted">
            아직 보낸 문자가 없습니다.
          </Text>
        ) : (
          <Stack gap="0" separator={<StackSeparator />}>
            {messages.map((message, index) => (
              <Box key={index} py="2">
                <HStack gap="2" mb="1" wrap="wrap">
                  <Text textStyle="xs" color="fg.muted" fontVariantNumeric="tabular-nums">
                    {formatTime(message.sentAt)}
                  </Text>
                  <ToneBadge tone={messageTypeTone[message.type]} />
                  <ReservationLink id={message.reservationId}>{message.guestName}</ReservationLink>
                  <Text textStyle="xs" color="fg.muted">
                    발송 시 객실
                  </Text>
                  <ToneBadge tone={roomStatusTone[message.roomStatus]} size="sm" />
                </HStack>
                <Text textStyle="sm" color="fg.muted">
                  <Content text={message.content} />
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
