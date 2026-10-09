import { Box, Container, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** 고객 화면 틀: 모바일 폭의 한 단 레이아웃 */
export function GuestShell({ children }: { children: ReactNode }) {
  return (
    <Box minH="100dvh" bg="bg.subtle">
      <Container maxW="md" px="4" py="5">
        <Text textStyle="sm" fontWeight="bold" letterSpacing="wider" mb="5">
          URBANSTAY
        </Text>
        {children}
      </Container>
    </Box>
  );
}
