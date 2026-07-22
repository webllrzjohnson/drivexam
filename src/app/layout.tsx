import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = { title: { default: "drivexam", template: "%s | drivexam" }, description: "A trustworthy Ontario G1, G2, and full G driving exam study companion.", manifest: "/manifest.webmanifest" };
export const viewport: Viewport = { themeColor: "#14532d" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="flex min-h-full flex-col">{children}</body></html>; }
