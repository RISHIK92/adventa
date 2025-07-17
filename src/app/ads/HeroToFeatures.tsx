"use client";

import React, { useEffect, useRef } from "react";

type GoogleAdProps = {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  adFormat?: string;
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function GoogleAd({
  slot,
  className,
  style,
  adFormat = "auto",
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.adsbygoogle &&
        adRef.current &&
        adRef.current.offsetWidth > 0
      ) {
        try {
          if (!adRef.current.getAttribute("data-ad-loaded")) {
            (window.adsbygoogle as any[]).push({});
            adRef.current.setAttribute("data-ad-loaded", "true");
          }
        } catch (error) {
          console.error("AdSense error:", error);
        }
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={style ? style : { display: "block", width: "full" }}
      data-ad-client="ca-pub-8931411493297537"
      data-ad-slot={slot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
      data-adtest="on"
      ref={adRef}
    />
  );
}
