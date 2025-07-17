"use client";

import GoogleAd from "./HeroToFeatures";

export function WideVerticalSlot({ slot }: { slot: string }) {
  return (
    <div className="hidden lg:block w-full">
      <GoogleAd
        slot={slot}
        style={{ display: "block", width: "300px", height: "600px" }}
      />
    </div>
  );
}
