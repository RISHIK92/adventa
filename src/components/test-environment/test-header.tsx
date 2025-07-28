"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TestHeaderProps {
  testName: string;
  durationInMinutes: number;
  onSubmitTest: () => void;
  currentQuestion: number;
  totalQuestions: number;
}

export default function TestHeader({
  testName,
  durationInMinutes,
  onSubmitTest,
  currentQuestion,
  totalQuestions,
}: TestHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsEnding(true);
          onSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [durationInMinutes, onSubmitTest]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const completionPercentage = ((currentQuestion - 1) / totalQuestions) * 100;
  const isCritical = timeLeft <= 300; // 5 minutes warning

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background">
      <header className="flex items-center justify-between h-16 px-6 bg-background">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground">{testName}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Clock
            className={`w-4 h-4 ${
              isCritical ? "text-destructive" : "text-secondary"
            }`}
          />
          <span
            className={`font-mono text-lg font-semibold tabular-nums ${
              isCritical ? "text-destructive" : "text-foreground"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>

        <Button
          onClick={onSubmitTest}
          variant="destructive"
          size="sm"
          className="font-medium hover:scale-105 transition-transform"
        >
          Submit Test
        </Button>
      </header>

      <div className="w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );
}
