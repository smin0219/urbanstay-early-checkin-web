import { Spinner } from "@chakra-ui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReservationDetailView } from "@/components/reservation/reservation-detail-view";

export const metadata: Metadata = {
  title: "예약 상세 | 어반스테이 얼리체크인",
};

interface ReservationPageProps {
  params: Promise<{ id: string }>;
}

// Cache Components에서 동적 params는 런타임 값이라 Suspense 안에서 읽는다.
export default function ReservationPage({ params }: ReservationPageProps) {
  return (
    <Suspense fallback={<Spinner />}>
      {params.then(({ id }) => {
        if (!/^\d+$/.test(id)) notFound();
        return <ReservationDetailView id={Number(id)} />;
      })}
    </Suspense>
  );
}
