"use client";

import { Clock, BarChart3, Target, TrendingUp } from "lucide-react";

const features = [
  {
    name: "Real Exam Format",
    description:
      "Practice with questions that mirror the actual exam structure, difficulty level, and format to build familiarity.",
    icon: Target,
  },
  {
    name: "Detailed Analytics",
    description:
      "Get comprehensive performance insights with subject-wise analysis and improvement recommendations.",
    icon: BarChart3,
  },
  {
    name: "Time Management Training",
    description:
      "Learn to optimize your time allocation across sections with built-in timers and pacing guidance.",
    icon: Clock,
  },
  {
    name: "Comparative Analysis",
    description:
      "See how you stack up against other test-takers with percentile rankings and performance comparisons.",
    icon: TrendingUp,
  },
];

export default function WithProductScreenshotOnLeft() {
  return (
    <div className="overflow-hidden bg-[var(--background)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pt-4 lg:pl-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-orange-600">
                Mock Testing
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-[var(--foreground)] sm:text-5xl">
                Full-Scale Mock Tests
              </p>
              <p className="mt-6 text-lg/8 text-[var(--muted-foreground)]">
                Experience real exam conditions with our comprehensive mock
                tests. Get detailed analysis, performance insights, and
                personalized recommendations to improve your score.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-[var(--muted-foreground)] lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-[var(--foreground)]">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-orange-600"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10">
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--primary-foreground)] bg-orange-600 hover:bg-orange-600/90 transition-colors">
                  Take Mock Test
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <div className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-[var(--border)] sm:w-[28rem] bg-[var(--card)]">
              {/* Mock Exam Interface */}
              <div className="p-6 space-y-6">
                {/* Header with timer */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-[var(--foreground)]">
                      Mock Test 1
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      Section A: Quantitative Aptitude
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">24:35</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      Progress
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      12/50 questions
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-[#12b981] h-2 rounded-full"
                      style={{ width: "24%" }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[var(--foreground)]">
                      Question 12
                    </h3>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      5 marks
                    </span>
                  </div>
                  <div className="text-[var(--foreground)]">
                    <p className="mb-4">
                      What is the compound interest on Rs. 15,000 at 8% per
                      annum for 2 years, compounded annually?
                    </p>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          className="text-orange-600"
                        />
                        <span>Rs. 2,496</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          className="text-orange-600"
                        />
                        <span>Rs. 2,400</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          className="text-orange-600"
                          defaultChecked
                        />
                        <span>Rs. 2,592</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          className="text-orange-600"
                        />
                        <span>Rs. 2,688</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <button className="px-4 py-2 border border-[var(--border)] rounded-md text-[var(--foreground)] hover:bg-gray-300 transition-colors">
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-[#12b981] text-[var(--primary-foreground)] rounded-md hover:bg-[#12b981]/90 transition-colors">
                      Save & Next
                    </button>
                    <button className="px-4 py-2 border border-[var(--border)] rounded-md text-[var(--foreground)] hover:bg-gray-300 transition-colors">
                      Mark for Review
                    </button>
                  </div>
                </div>

                {/* Question grid */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-[var(--foreground)]">
                    Question Navigator
                  </h4>
                  <div className="grid grid-cols-10 gap-1">
                    {Array.from({ length: 50 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center text-[var(--primary-foreground)] font-medium ${
                          i < 12
                            ? "bg-[#12b981]"
                            : i === 12
                            ? "bg-orange-600"
                            : "bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-[#12b981] rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-orange-600 rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span>Not Visited</span>
                    </div>
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
