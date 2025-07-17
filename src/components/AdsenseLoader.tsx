// components/AdsenseLoader.tsx
"use client";

import Script from "next/script";

export default function AdsenseLoader() {
  return (
    <>
      <Script
        id="adsense-init"
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8931411493297537"
        crossOrigin="anonymous"
      />
    </>
  );
}
