import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ReactQueryProvider from "@/providers/ReactQueryProvider";
import AuthGuard from "@/component/auth/AuthGuard";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anunsai.com"),
  title: "아는 사이 | 지인 기반 소개팅",
  description: "초대로만 가입하는 신뢰 기반 지인 소개팅. 안전하고 설레는 연결을 시작해보세요.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://anunsai.com",
    title: "아는 사이 | 지인 기반 소개팅",
    description: "초대로만 가입하는 신뢰 기반 지인 소개팅.",
    siteName: "아는 사이",
    locale: "ko_KR",
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4578305115618020" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
