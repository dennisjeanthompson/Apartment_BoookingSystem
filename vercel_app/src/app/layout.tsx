import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/session-provider";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apartment Booking System",
  description: "TypeScript + Next.js apartment booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900">
        <SessionProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-500">
              {new Date().getFullYear()} University Apartment Booking
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
