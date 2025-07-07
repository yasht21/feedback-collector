import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yap",
  description: "Collect anonymous feedback easily with Yap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-black text-gray-200">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Header */}
          <header className="bg-neutral-950 text-white border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
            {/* Left Side: Logo */}
            <Link href="/" className="text-xl font-bold text-blue-500 hover:text-blue-400 transition">
              Yap
            </Link>

            {/* Right Side: Auth */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>

              <SignedIn>
                <Link href="/" className="text-sm font-medium hover:text-blue-400">
                  Home
                </Link>
                <Link href="/dashboard" className="text-sm font-medium hover:text-blue-400">
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Main Content */}
          {children}

          <ToastContainer position="top-right" autoClose={3000} />
        </body>
      </html>
    </ClerkProvider>
  );
}
