import { Card, HStack, Text, Timeline } from "@chakra-ui/react";
import { ToneBadge } from "@/components/ops/tone-badge";
import { formatTime } from "@/lib/format";
import { roomEventLabel, roomStatusTone } from "@/lib/labels";
import type { TimelineEntry } from "@/lib/types";

export function RoomTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title textStyle="sm">상태 타임라인</Card.Title>
      </Card.Header>
      <Card.Body pt="3">
        <Timeline.Root size="sm" variant="subtle">
          {entries.map((entry, index) => (
            <Timeline.Item key={index}>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator />
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>
                  <Text as="span" fontVariantNumeric="tabular-nums" color="fg.muted">
                    {formatTime(entry.at)}
                  </Text>
                  {roomEventLabel[entry.event]}
                  {entry.guestName && (
                    <Text as="span" color="fg.muted">
                      · {entry.guestName}
                    </Text>
                  )}
                </Timeline.Title>
                <Timeline.Description>
                  <HStack gap="1.5">
                    {entry.from && (
                      <>
                        <ToneBadge tone={roomStatusTone[entry.from]} size="sm" />
                        <Text as="span">→</Text>
                      </>
                    )}
                    <ToneBadge tone={roomStatusTone[entry.to]} size="sm" />
                  </HStack>
                </Timeline.Description>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
      </Card.Body>
    </Card.Root>
  );
}
