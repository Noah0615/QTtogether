import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import GraceLights from "@/components/GraceLights";

export const metadata: Metadata = {
  title: "QT Together - Anonymous Devotional Space",
  description: "Share your daily devotional thoughts anonymously.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <Providers>
          <GraceLights />
          {children}
        </Providers>
      </body>
    </html>
  );
}
