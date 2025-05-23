import type { Metadata } from "next";
import localFont from "next/font/local";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "mvxmt",
  description: "RAG Pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${sourceSans.variable} ${geistMono.variable} bg-background antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
