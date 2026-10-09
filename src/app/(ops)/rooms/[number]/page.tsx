import { Spinner } from "@chakra-ui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RoomDetailView } from "@/components/room/room-detail-view";

export const metadata: Metadata = {
  title: "객실 운영 상세 | 어반스테이 얼리체크인",
};

interface RoomPageProps {
  params: Promise<{ number: string }>;
}

// Cache Components에서 동적 params는 런타임 값이라 Suspense 안에서 읽는다.
export default function RoomPage({ params }: RoomPageProps) {
  return (
    <Suspense fallback={<Spinner />}>
      {params.then(({ number }) => {
        if (!/^[0-9A-Za-z-]+$/.test(number)) notFound();
        return <RoomDetailView number={number} />;
      })}
    </Suspense>
  );
}
