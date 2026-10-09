import { Badge, Box, Card, HStack, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import { conditionText, ruleInfo } from "@/lib/labels";
import type { RuleCheck, RuleOutcome } from "@/lib/types";

function OutcomeBadge({ outcome, alert }: { outcome: RuleOutcome; alert: boolean }) {
  if (outcome === "DONE") {
    return (
      <Badge colorPalette="green" variant="solid">
        발송 완료
      </Badge>
    );
  }
  if (outcome === "MET") {
    return (
      <Badge colorPalette={alert ? "orange" : "blue"} variant="solid">
        {alert ? "알림 중" : "조건 충족"}
      </Badge>
    );
  }
  return <Badge variant="subtle">{alert ? "해당 없음" : "조건 미충족"}</Badge>;
}

/** 규칙 엔진이 이 객실을 어떻게 판단하고 있는지 조건별로 보여준다. */
export function RuleChecks({ checks }: { checks: RuleCheck[] }) {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <HStack gap="2" align="baseline" wrap="wrap">
          <Card.Title textStyle="sm">규칙 엔진 판단</Card.Title>
          <Text textStyle="xs" color="fg.muted">
            모든 조건이 충족되면 시계 이동·이벤트 때 자동으로 실행됩니다
          </Text>
        </HStack>
      </Card.Header>
      <Card.Body pt="2">
        {checks.length === 0 ? (
          <Text textStyle="sm" color="fg.muted">
            오늘 이 객실에 입실·퇴실 예약이 없어 판단할 규칙이 없습니다.
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="3">
            {checks.map((check) => {
              const { label, alert } = ruleInfo[check.rule];
              return (
                <Box key={check.rule} borderWidth="1px" borderRadius="l2" p="3">
                  <HStack justify="space-between" mb="2">
                    <Text textStyle="sm" fontWeight="semibold">
                      {label}
                    </Text>
                    <OutcomeBadge outcome={check.outcome} alert={alert} />
                  </HStack>
                  {check.outcome === "DONE" ? (
                    // 실행 뒤에는 조건이 바뀌므로(예: "보낸 제안 없음") 조건 목록 대신 결과만 보여준다
                    <Text textStyle="sm" color="fg.muted">
                      조건을 모두 충족해 발송했습니다. 발송 시각은 발송 로그에서 확인할 수 있습니다.
                    </Text>
                  ) : (
                    <Stack gap="1">
                      {check.conditions.map((condition) => {
                        const text = conditionText(condition);
                        return (
                          <HStack key={condition.type} gap="2" align="start" textStyle="sm">
                            <Icon
                              color={condition.satisfied ? "fg.success" : "fg.error"}
                              mt="0.5"
                              flexShrink={0}
                              aria-label={condition.satisfied ? "충족" : "미충족"}
                            >
                              {condition.satisfied ? <LuCheck /> : <LuX />}
                            </Icon>
                            <Text flex="1" color={condition.satisfied ? undefined : "fg.muted"}>
                              {text.label}
                            </Text>
                            {text.detail && (
                              <Text textStyle="xs" color="fg.muted" flexShrink={0} fontVariantNumeric="tabular-nums">
                                {text.detail}
                              </Text>
                            )}
                          </HStack>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Card.Body>
    </Card.Root>
  );
}
