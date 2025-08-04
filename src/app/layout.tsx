import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import "katex/dist/katex.min.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { TricolorSpinner } from "@/components/ui/tricolor-spinner";
import React from "react";
import { InitialLoader } from "@/components/ui/initial-loader";
import AdsenseLoader from "@/components/AdsenseLoader";
import GoogleAd from "./ads/HeroToFeatures";
import HighlightBubble from "@/components/highlightBubble";

export const metadata: Metadata = {
  title: "Vertical Ascent",
  description: "An interactive learning journey to broaden your knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AdsenseLoader />
        <AuthProvider>
          <Header />
          <HighlightBubble />
          {children}
          <Toaster />
        </AuthProvider>

        <div className="sticky bottom-0 left-0 right-0 z-50 bg-gray-100 border-t border-gray-300 shadow-lg">
          <div className="max-w-full mx-auto px-2">
            {/* <GoogleAd
              slot="2915602014"
              className="w-full"
              style={{
                display: "block",
                width: "100%",
                height: "100px",
              }}
            /> */}
          </div>
        </div>
      </body>
    </html>
  );
}
