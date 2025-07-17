"use client";
import React from "react";
import { TricolorSpinner } from "@/components/ui/tricolor-spinner";

export function InitialLoader() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (hydrated) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <TricolorSpinner size={64} />
    </div>
  );
} 