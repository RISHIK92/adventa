"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { totalmem } from "os";

interface ScorecardProps {
  score: number;
  totalScore: number;
  percentile: number;
  timeTaken: string;
  examTitle: string;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
}

export const Scorecard: React.FC<ScorecardProps> = ({
  score,
  totalScore,
  percentile,
  timeTaken,
  examTitle,
  totalCorrect,
  totalIncorrect,
  totalUnattempted,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const percentage = Math.round((score / totalScore) * 100);

  useEffect(() => {
    setIsVisible(true);

    // Animate score counter
    const scoreAnimation = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev >= score) {
          clearInterval(scoreAnimation);
          return score;
        }
        return prev + Math.ceil((score - prev) / 10);
      });
    }, 50);

    // Animate percentage counter
    const percentageAnimation = setInterval(() => {
      setAnimatedPercentage((prev) => {
        if (prev >= percentage) {
          clearInterval(percentageAnimation);
          return percentage;
        }
        return prev + Math.ceil((percentage - prev) / 15);
      });
    }, 60);

    return () => {
      clearInterval(scoreAnimation);
      clearInterval(percentageAnimation);
    };
  }, [score, percentage]);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card
        className={`relative overflow-hidden transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Gradient Border */}
        <div className="absolute inset-0 rounded-lg p-[1px]">
          <div
            className="h-full w-full rounded-lg"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Floating Animation Background */}
          <div
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 animate-pulse"
            style={
              {
                // background: "linear-gradient(135deg, #ff6b35, #ff9f68)",
                // filter: "blur(20px)",
              }
            }
          />

          {/* Exam Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: "Space Grotesk, Inter, sans-serif",
                background: "linear-gradient(135deg, #ff6b35, #ff9f68)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {examTitle}
            </h1>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Score Section */}
            <div className="text-center lg:text-left space-y-6">
              {/* Score Display */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span
                    className="text-6xl font-bold transition-all duration-300"
                    style={{
                      fontFamily: "Space Grotesk, Inter, sans-serif",
                      background: "linear-gradient(135deg, #ff6b35, #ff9f68)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {animatedScore}
                  </span>
                  <span className="text-2xl text-gray-500 font-medium">
                    / {totalScore}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Your Score</p>
              </div>

              {/* Accuracy Badge */}
              <div className="inline-flex items-center gap-2">
                <div
                  className="px-4 py-2 rounded-full text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {animatedPercentage}% Accuracy
                </div>
              </div>

              {/* Time Taken */}
              <div className="space-y-1">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Time Taken
                </p>
                <p
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {timeTaken}
                </p>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 140, 85, 0.08), transparent)",
                    filter: "blur(20px)",
                    transform: "scale(1.1)",
                  }}
                />

                {/* Progress Ring */}
                <div className="relative">
                  <svg
                    width="280"
                    height="280"
                    viewBox="0 0 280 280"
                    className="transform -rotate-90"
                  >
                    {/* Background Circle */}
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      stroke="rgba(229, 231, 235, 0.3)"
                      strokeWidth="8"
                      fill="none"
                    />

                    {/* Progress Circle */}
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-2000 ease-out"
                    />

                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ff6b35" />
                        <stop offset="100%" stopColor="#ff9f68" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className="text-5xl font-bold mb-2"
                        style={{
                          fontFamily: "Space Grotesk, Inter, sans-serif",
                          background:
                            "linear-gradient(135deg, #ff6b35, #ff9f68)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {percentile}th
                      </div>
                      <p className="text-gray-600 font-medium">Percentile</p>
                      <p className="text-xs">in</p>
                      <span className="text-sm">{examTitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-100 to-green-200 hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {totalCorrect}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-rose-100 to-red-100 hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {totalIncorrect}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-bold text-black mb-1">
                {totalUnattempted}
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Unattempted
              </div>
            </div>

            {/* <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {percentile}%
              </div>
              <div className="text-sm text-gray-600">Better Than</div>
            </div> */}

            {/* <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-md transition-all duration-300">
              <div
                className="text-2xl font-bold text-amber-600 mb-1"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {timeTaken}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div> */}
          </div>
        </div>
      </Card>
    </div>
  );
};
