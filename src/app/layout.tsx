import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Provider } from "@/components/ui/provider";

export const metadata: Metadata = {
  title: "어반스테이 얼리체크인",
  description: "어반스테이 얼리체크인 데모",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
