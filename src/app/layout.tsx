import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "오늘의 코드 게임 | 매일 새로운 도전",
  description: "매일 한국시간 00:00에 새로운 10자리 코드가 생성됩니다. 코드를 맞춰서 특별한 선물을 받아보세요! 자동 코드 생성기로 쉽고 재미있게 참여하세요.",
  keywords: "코드게임, 이벤트, 선물, 게임, 프로모션, 온라인게임",
  authors: [{ name: "Daily Code Game" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "오늘의 코드 게임",
    description: "매일 새로운 코드를 맞춰서 선물을 받아보세요!",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘의 코드 게임",
    description: "매일 새로운 코드를 맞춰서 선물을 받아보세요!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
    <head>
      <link rel="canonical" href="/"/>
      <meta name="theme-color" content="#4F46E5"/>
      <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/x-icon" href="/favicon.ico"/>

      {/* Google AdSense */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9734166484318003"
              crossOrigin="anonymous"></script>
    </head>
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <AuthProvider>
      {children}
    </AuthProvider>
      </body>
    </html>
  );
}
