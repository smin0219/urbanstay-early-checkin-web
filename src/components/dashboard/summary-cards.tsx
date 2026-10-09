import { Card, SimpleGrid, Stat } from "@chakra-ui/react";
import { formatWon } from "@/lib/format";
import type { DashboardSummary } from "@/lib/types";

interface SummaryCardProps {
  label: string;
  value: string | number;
  help?: string;
  color?: string;
}

function SummaryCard({ label, value, help, color }: SummaryCardProps) {
  return (
    <Card.Root size="sm">
      <Card.Body>
        <Stat.Root gap="1">
          <Stat.Label>{label}</Stat.Label>
          <Stat.ValueText color={color} fontVariantNumeric="tabular-nums">
            {value}
          </Stat.ValueText>
          {help && <Stat.HelpText>{help}</Stat.HelpText>}
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

/** 객실 준비 현황(퇴실 전, 청소, 준비 완료)은 아직 입실하지 않은 오늘 예약의 배정 객실 기준이다. */
export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  return (
    <SimpleGrid columns={{ base: 2, md: 4, xl: 7 }} gap="3">
      <SummaryCard label="오늘 체크인" value={summary.arrivals} help={`입실 완료 ${summary.checkedIn}`} />
      <SummaryCard
        label="배정 대기"
        value={summary.pendingAssignment}
        color={summary.pendingAssignment > 0 ? "fg.warning" : undefined}
        help="정오 안내 전 배정 필요"
      />
      <SummaryCard label="청소 중" value={summary.cleaning} help={`퇴실 전 ${summary.awaitingCheckout}`} />
      <SummaryCard label="준비 완료" value={summary.ready} help="입실 가능 객실" />
      <SummaryCard
        label="얼리 제안 · 확정"
        value={`${summary.earlyOffered} · ${summary.earlyConfirmed}`}
        help="제안 건수 · 결제 건수"
      />
      <SummaryCard label="얼리 매출" value={formatWon(summary.earlyRevenue)} help="확정 건 요금 합계" />
      <SummaryCard
        label="미준비 객실 비밀번호"
        value={`${summary.passwordsToUnreadyRooms}건`}
        color={summary.passwordsToUnreadyRooms > 0 ? "fg.error" : "fg.success"}
        help="목표 0건"
      />
    </SimpleGrid>
  );
}
