import { Link } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import NextLink from "next/link";
import type { ReactNode } from "react";

// 운영 화면끼리 이동하는 링크. 예약 상세(/reservations/{id})와 객실 운영 상세(/rooms/{number})로 간다.

export function ReservationLink({ id, children }: { id: number; children: ReactNode }) {
  return (
    <Link asChild fontWeight="medium" colorPalette="blue">
      <NextLink href={`/reservations/${id}`}>{children}</NextLink>
    </Link>
  );
}

export function RoomLink({ number }: { number: string }) {
  return (
    <Link asChild fontWeight="medium" colorPalette="blue">
      <NextLink href={`/rooms/${number}`}>{number}호</NextLink>
    </Link>
  );
}

export function BackToDashboard() {
  return (
    <Link asChild textStyle="sm" color="fg.muted" width="fit-content">
      <NextLink href="/dashboard">
        <LuArrowLeft /> 대시보드
      </NextLink>
    </Link>
  );
}
