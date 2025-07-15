"use client";

import { VerticalAscentClient } from "@/components/vertical-ascent/client";
import { subjects } from "@/lib/data";
import React from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LearningPage() {
  const router = useRouter();
  return (
    <main>
      {/* Remove the back to home button here */}
      <VerticalAscentClient subjects={subjects} />
    </main>
  );
}
