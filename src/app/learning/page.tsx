"use client";

import { VerticalAscentClient } from "@/components/vertical-ascent/client";
import { subjects } from "@/lib/data";
import React from "react";

export default function LearningPage() {
  return (
    <main>
      <VerticalAscentClient subjects={subjects} />
    </main>
  );
}
