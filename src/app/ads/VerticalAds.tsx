"use client";

import GoogleAd from "./HeroToFeatures";

export function VerticalAdSlot({ slot }: { slot: string }) {
  return (
    <div className="hidden lg:block w-full">
      <GoogleAd
        slot={slot}
        style={{ display: "block", width: "160px", height: "600px" }}
      />
    </div>
  );
}
