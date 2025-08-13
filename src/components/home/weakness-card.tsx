"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export const CardLayoutHero = () => {
  return (
    <section className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-medium tracking-tight text-[var(--accent)] font-display">
              AI-Powered Test Prep
            </h2>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] font-display">
              Master Your Weaknesses, Ace Your Exams
            </h1>

            <p className="text-lg text-[var(--muted-foreground)] font-body max-w-lg">
              AI-powered adaptive testing that identifies your weak areas and
              creates personalized practice tests for JEE, NEET, and other
              competitive exams.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="rounded-lg px-8 py-6 text-md shadow-md hover:shadow-lg transition bg-[#ff6b30] text-white">
                Start Free Analysis
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition"
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Right Analytics Card */}
          <div className="relative">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] font-display">
                Weakness Analysis
              </h3>

              {/* Subject Performance */}
              {[
                {
                  category: "Mathematics",
                  color: "bg-[#ff6b35]",
                  inaccuracy: 43,
                },
                {
                  category: "Physics",
                  color: "bg-[#12b981]",
                  inaccuracy: 19,
                },
                {
                  category: "Chemistry",
                  color: "bg-[#f59e0c]",
                  inaccuracy: 14,
                },
                {
                  category: "Biology",
                  color: "bg-[#3c82f6]",
                  inaccuracy: 31,
                },
              ].map((item) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-4 rounded-lg text-white ${item.color}`}
                >
                  <span className="font-semibold">{item.category}</span>
                  <span className="opacity-80 text-sm">
                    Inaccuracy: {item.inaccuracy}%
                  </span>
                </div>
              ))}

              {/* Focus Areas */}
              <div>
                <h4 className="text-sm font-medium text-[var(--foreground)] font-display mb-2">
                  Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Thermodynamics", "Optics", "Waves"].map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 text-xs rounded-full bg-warning/10 text-warning font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtle glow effect like BentoGrid */}
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-tr from-[var(--accent)]/20 to-transparent blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
