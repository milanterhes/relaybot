import type { Metadata } from "next";
import localFont from "next/font/local";
import NextAuthProvider from "../components/session-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProviderWrapper } from "./query-client";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Relaybot",
  description: "A Discord bot for scheduling messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProviderWrapper>
          <NextAuthProvider>
            {children}
            <Toaster />
          </NextAuthProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
