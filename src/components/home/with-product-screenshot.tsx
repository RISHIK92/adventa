"use client";

import { Brain, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";

const features = [
  {
    name: "Adaptive Difficulty",
    description:
      "AI dynamically adjusts question difficulty based on your performance, ensuring optimal challenge levels for maximum learning efficiency.",
    icon: Brain,
  },
  {
    name: "Instant Feedback",
    description:
      "Get immediate explanations for each answer with detailed reasoning to understand concepts better.",
    icon: CheckCircle,
  },
  {
    name: "Topic-wise Analysis",
    description:
      "Comprehensive breakdown of your performance across different subjects and topics for targeted improvement.",
    icon: BarChart3,
  },
  {
    name: "Performance Tracking",
    description:
      "Monitor your progress over time with detailed analytics and personalized recommendations.",
    icon: TrendingUp,
  },
];

export default function WithProductScreenshot() {
  return (
    <div className="overflow-hidden bg-neutral-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-[#ff6b35]">
                Smart Learning
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-neutral-text sm:text-5xl">
                AI-Powered Adaptive Quizzes
              </p>
              <p className="mt-6 text-lg/8 text-neutral-text">
                Our advanced AI analyzes your performance and creates
                personalized quizzes that adapt to your learning pace. Get
                instant feedback, detailed explanations, and track your
                improvement across all topics.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-neutral-text lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-neutral-text">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-[#ff6b35]"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <button className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-orange-600 hover:bg-orange-600/90 rounded-lg transition-colors duration-200">
                  Try Quiz Demo
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full max-w-none rounded-xl bg-neutral-card shadow-xl ring-1 ring-gray-400/10 p-6">
              {/* Quiz Interface Mock */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-text">
                        Mathematics Quiz
                      </h3>
                      <p className="text-sm text-gray-500">Question 3 of 10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="font-semibold text-neutral-text">02:45</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>

                {/* Question */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-neutral-text">
                    What is the derivative of f(x) = 3x² + 2x - 1?
                  </h4>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {[
                      { label: "A", answer: "6x + 2", correct: true },
                      { label: "B", answer: "3x + 2", correct: false },
                      { label: "C", answer: "6x - 1", correct: false },
                      { label: "D", answer: "3x² + 2", correct: false },
                    ].map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          option.correct
                            ? "bg-[#12b981]/10 border border-[#12b981]"
                            : "bg-muted hover:bg-muted/80 border border-border"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                            option.correct
                              ? "bg-[#12b981] text-white"
                              : "bg-border text-neutral-text"
                          }`}
                        >
                          {option.label}
                        </div>
                        <span className="text-neutral-text">
                          {option.answer}
                        </span>
                        {option.correct && (
                          <CheckCircle className="w-5 h-5 text-[#12b981] ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div className="bg-[#12b981]/10 border border-[#12b981] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#12b981] mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#12b981]">Correct!</p>
                        <p className="text-sm text-neutral-text mt-1">
                          The derivative of a polynomial is found by multiplying
                          each term by its power and reducing the power by 1.
                          For 3x², the derivative is 6x, and for 2x, it's 2.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Accuracy</p>
                    <p className="font-semibold text-neutral-text">85%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Streak</p>
                    <p className="font-semibold text-neutral-text">3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-semibold text-neutral-text">
                      Intermediate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
