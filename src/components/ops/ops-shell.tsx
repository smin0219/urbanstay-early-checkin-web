import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { ClockBar } from "./clock-bar";

/** 운영 화면 공통 틀. 상단에 가상 시계를 고정한다. */
export function OpsShell({ children }: { children: ReactNode }) {
  return (
    <Box minH="100dvh" bg="bg.subtle">
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="sticky"
        bg="bg"
        borderBottomWidth="1px"
        px={{ base: "4", md: "6" }}
        py="2"
      >
        <Flex align="center" justify="space-between" gap="4" wrap="wrap">
          <HStack gap="3">
            <Link asChild fontWeight="bold" textStyle="md" _hover={{ textDecoration: "none" }}>
              <NextLink href="/dashboard">어반스테이 운영</NextLink>
            </Link>
            <Text textStyle="xs" color="fg.muted">
              얼리체크인 데모
            </Text>
          </HStack>
          <ClockBar />
        </Flex>
      </Box>
      <Box as="main" px={{ base: "4", md: "6" }} py="5">
        {children}
      </Box>
    </Box>
  );
}
