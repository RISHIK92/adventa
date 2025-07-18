"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Menu,
  X,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  BookOpen,
  Trophy,
} from "lucide-react";

export default function WithAppScreenshot() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] 
            -translate-x-1/2 rotate-[30deg] 
            bg-gradient-to-br from-[#e7d4f4] via-[#eecff2] to-[#fdf4ff] 
            opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-bold tracking-tight text-balance text-[#0f172a] sm:text-7xl">
                Ace JEE & NEET with AI-Powered Preparation
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-[#64748b] sm:text-xl/8">
                Get personalized study plans, AI-generated quizzes,
                comprehensive mock tests, and detailed performance analysis.
                Join thousands of students who've cracked their dream exams.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-[#ff6b35] px-3.5 py-2.5 text-sm font-semibold text-[#0f172a] shadow-sm hover:bg-[#ff6b35]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3e6fa]"
                >
                  Start Free Trial
                </a>
                <a href="#" className="text-sm/6 font-semibold text-[#0f172a]">
                  View Demo <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-x-8 text-sm text-[#64748b]">
                <div className="flex items-center gap-x-2">
                  <Users className="h-4 w-4 text-[#c084fc]" />
                  <span className="font-medium">50,000+ Students</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <TrendingUp className="h-4 w-4 text-[#c084fc]" />
                  <span className="font-medium">95% Success Rate</span>
                </div>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-[#0f172a]/5 p-2 ring-1 ring-[#0f172a]/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="rounded-md shadow-2xl ring-1 ring-[#0f172a]/10 bg-white p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Study Analytics */}
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
                        Study Analytics
                      </h3>
                      <div className="bg-gray-200 rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-[#64748b]">
                                  Hours Studied
                                </p>
                                <p className="text-2xl font-bold text-black">
                                  47.5
                                </p>
                              </div>
                              <BarChart3 className="h-8 w-8 text-orange-500" />
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-[#64748b]">
                                  Accuracy
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                  89%
                                </p>
                              </div>
                              <Trophy className="h-8 w-8 text-green-600" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#64748b]">
                              Physics
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full w-20"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#64748b]">
                              Chemistry
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full w-28"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#64748b]">
                              Math/Biology
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full w-24"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Tests */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
                        Upcoming Tests
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-orange-500" />
                            <div>
                              <p className="font-medium text-[#0f172a]">
                                JEE Mock Test 15
                              </p>
                              <p className="text-sm text-gray-500">
                                Tomorrow, 2:00 PM
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-black">
                                NEET Practice
                              </p>
                              <p className="text-sm text-gray-500">
                                Dec 15, 10:00 AM
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-[#64748b]" />
                            <div>
                              <p className="font-medium text-[#0f172a]">
                                Weekly Assessment
                              </p>
                              <p className="text-sm text-[#64748b]">
                                Dec 18, 3:00 PM
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f4d6f5] to-[#f3e6fa] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
}
