import { Spinner } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { GuestCheckInView } from "@/components/guest/guest-check-in-view";
import { GuestShell } from "@/components/guest/guest-shell";

export const metadata: Metadata = {
  title: "체크인 안내 | 어반스테이",
};

interface CheckInPageProps {
  params: Promise<{ token: string }>;
}

/** 고객 화면. 운영 레이아웃((ops) 그룹) 밖에 두어 가상 시계 바 없이 모바일 화면으로 보여준다. */
export default function CheckInPage({ params }: CheckInPageProps) {
  return (
    <GuestShell>
      <Suspense fallback={<Spinner />}>
        {params.then(({ token }) => (
          <GuestCheckInView token={token} />
        ))}
      </Suspense>
    </GuestShell>
  );
}
