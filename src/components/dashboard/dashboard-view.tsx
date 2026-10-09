"use client";

import { Alert, Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/format";
import { useDashboard } from "@/lib/hooks";
import { AlertList } from "./alert-list";
import { ArrivalsTable } from "./arrivals-table";
import { SummaryCards } from "./summary-cards";

export function DashboardView() {
  const { data, error, isValidating } = useDashboard();

  return (
    <Stack gap="4">
      <HStack gap="3" align="baseline">
        <Heading as="h1" size="lg">
          운영 대시보드
        </Heading>
        {data && (
          <Text textStyle="sm" color="fg.muted">
            {formatDate(data.now)} 체크인
          </Text>
        )}
        {isValidating && <Spinner size="xs" color="fg.muted" />}
      </HStack>
      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>대시보드를 불러오지 못했습니다</Alert.Title>
            <Alert.Description>{error.message} — 백엔드(8080)가 실행 중인지 확인하세요.</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
      {data ? (
        <>
          <SummaryCards summary={data.summary} />
          <AlertList alerts={data.alerts} />
          <ArrivalsTable arrivals={data.arrivals} now={data.now} />
        </>
      ) : (
        !error && <Spinner />
      )}
    </Stack>
  );
}
