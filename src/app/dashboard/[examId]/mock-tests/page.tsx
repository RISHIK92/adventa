"use client";

import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Clock,
  FileText,
  Star,
  Trophy,
  Play,
  ChefHat,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface MockTest {
  id: string;
  testNumber: number;
  title: string;
  difficulty: string;
  duration: string;
  questions: number;
  subjects: string[];
  pattern: string;
  rating: number;
  status: "available" | "completed" | "preparing";
  completedAt?: number;
  preparationEndTime?: number;
  score?: number;
  weakAreas?: string[];
}

const CookingAnimation = ({
  timeLeft,
  testNumber,
  hasCompletedTests,
}: {
  timeLeft: string;
  testNumber: number;
  hasCompletedTests: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-[#12b981] rounded-full flex items-center justify-center animate-pulse">
          <ChefHat className="w-8 h-8 text-white animate-bounce" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff6b35] rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#ff6b35] rounded-full animate-ping delay-300"></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-[#12b981] rounded-full animate-ping delay-500"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Preparing Personalized Test {testNumber}
        </h3>
        <p className="text-gray-600 mb-1">
          Analyzing your performance patterns...
        </p>
        {hasCompletedTests && (
          <p className="text-sm text-[#12b981] mb-3 font-medium">
            Based on your performance results and errors, we are generating your
            next challenge
          </p>
        )}
        <div className="text-2xl font-bold text-[#12b981] mb-1">{timeLeft}</div>
        <p className="text-sm text-gray-500">Time remaining</p>

        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800 font-medium mb-1">
            Perfect time for a review!
          </p>
          <p className="text-xs text-orange-700">
            Take a short break and analyze your previous results to identify
            improvement areas
          </p>
        </div>
      </div>
    </div>
  );
};

const getDifficultyByTestNumber = (testNumber: number): string => {
  if (testNumber <= 2) return "Medium";
  if (testNumber <= 4) return "Hard";
  return "Very Hard";
};

const getSubjectsByTestNumber = (testNumber: number): string[] => {
  const allSubjects = ["Physics", "Chemistry", "Mathematics"];
  if (testNumber % 3 === 1) return ["Physics", "Mathematics"];
  if (testNumber % 3 === 2) return ["Chemistry", "Mathematics"];
  return allSubjects;
};

const getWeakAreas = (score: number): string[] => {
  if (score < 220)
    return ["Time Management", "Conceptual Clarity", "Problem Solving"];
  if (score < 250) return ["Advanced Topics", "Speed & Accuracy"];
  return ["Complex Applications", "Tricky Questions"];
};

export default function MockTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<MockTest[]>([
    {
      id: "mock-test-1",
      testNumber: 1,
      title: "Mock Test 1",
      difficulty: "Medium",
      duration: "3 hours",
      questions: 90,
      subjects: ["Physics", "Chemistry", "Mathematics"],
      pattern: "Adaptive Pattern",
      rating: 4.8,
      status: "available",
    },
  ]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if any preparing tests are ready
  useEffect(() => {
    setTests((prevTests) =>
      prevTests.map((test) => {
        if (
          test.status === "preparing" &&
          test.preparationEndTime &&
          test.preparationEndTime <= currentTime
        ) {
          return { ...test, status: "available" };
        }
        return test;
      })
    );
  }, [currentTime]);

  const handleCompleteTest = (testNumber: number) => {
    const randomScore = Math.floor(Math.random() * 100) + 200;

    setTests((prevTests) => {
      const updatedTests = prevTests.map((test) =>
        test.testNumber === testNumber
          ? {
              ...test,
              status: "completed" as const,
              completedAt: Date.now(),
              score: randomScore,
              weakAreas: getWeakAreas(randomScore),
            }
          : test
      );

      // Create next test
      const nextTestNumber = testNumber + 1;
      const preparationEndTime = Date.now() + 30 * 60 * 1000; // 30 minutes from now

      const newTest: MockTest = {
        id: `mock-test-${nextTestNumber}`,
        testNumber: nextTestNumber,
        title: `Mock Test ${nextTestNumber}`,
        difficulty: getDifficultyByTestNumber(nextTestNumber),
        duration: "3 hours",
        questions: 90,
        subjects: getSubjectsByTestNumber(nextTestNumber),
        pattern: "Adaptive Pattern",
        rating: 4.7 + Math.random() * 0.3, // Random rating between 4.7-5.0
        status: "preparing",
        preparationEndTime,
      };

      return [newTest, ...updatedTests];
    });
  };

  const formatTimeLeft = (endTime: number): string => {
    const timeLeft = Math.max(0, endTime - currentTime);
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Sort tests: preparing tests first, then completed tests in reverse chronological order
  const sortedTests = [...tests].sort((a, b) => {
    if (a.status === "preparing" && b.status !== "preparing") return -1;
    if (b.status === "preparing" && a.status !== "preparing") return 1;
    if (a.status === "available" && b.status !== "available") return -1;
    if (b.status === "available" && a.status !== "available") return 1;

    // For completed tests, sort by completion time (newest first)
    if (a.status === "completed" && b.status === "completed") {
      return (b.completedAt || 0) - (a.completedAt || 0);
    }

    return b.testNumber - a.testNumber;
  });

  const completedTestsCount = tests.filter(
    (test) => test.status === "completed"
  ).length;
  const hasCompletedTests = completedTestsCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mock Tests</h1>
                <p className="text-gray-600">
                  AI-powered adaptive examinations tailored to your performance
                </p>
              </div>
            </div>
            {completedTestsCount > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Tests Completed</p>
                <p className="text-2xl font-bold text-[#12b981]">
                  {completedTestsCount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {completedTestsCount > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">
                  Great progress! 🎉 Take a moment to review your results and
                  identify areas for improvement.
                </p>
                <p className="text-blue-600 text-sm">
                  Understanding your mistakes is the key to mastering the
                  concepts. Take a short break and come back stronger!
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid gap-6">
          {sortedTests.map((test) => {
            return (
              <Card
                key={test.id}
                className={`bg-white border transition-all duration-300 shadow-sm hover:shadow-md ${
                  test.status === "completed"
                    ? "border-[#12b981]/30 hover:border-[#12b981]/50 bg-gradient-to-r from-green-50/30 to-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CardContent className="p-6">
                  {test.status === "preparing" && test.preparationEndTime ? (
                    <CookingAnimation
                      timeLeft={formatTimeLeft(test.preparationEndTime)}
                      testNumber={test.testNumber}
                      hasCompletedTests={hasCompletedTests}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {test.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`${
                              test.status === "completed"
                                ? "bg-[#12b981]/10 text-[#12b981] border-[#12b981]/20"
                                : "bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/20"
                            }`}
                          >
                            {test.status === "completed"
                              ? "Completed"
                              : "Ready to Start"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-300 text-gray-600"
                          >
                            {test.difficulty}
                          </Badge>
                          {test.testNumber > 1 && (
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-600 bg-purple-50"
                            >
                              Personalized
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {test.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {test.questions} Questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {test.rating.toFixed(1)} Rating
                          </span>
                          {test.status === "completed" && test.score && (
                            <span className="flex items-center gap-1 text-[#12b981]">
                              <Trophy className="w-4 h-4" />
                              Score: {test.score}/300
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 mb-3">
                          {test.subjects.map((subject) => (
                            <Badge
                              key={subject}
                              variant="outline"
                              className="border-gray-200 text-gray-600 text-xs"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {test.status === "completed" ? (
                          <Button
                            variant="outline"
                            className="border-[#12b981] text-[#12b981] hover:bg-[#12b981]/10 bg-transparent font-medium relative"
                          >
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff6b35] rounded-full animate-pulse"></div>
                            View Results & Analysis
                          </Button>
                        ) : (
                          <Button
                            className="bg-[#12b981] text-white hover:bg-[#12b981]/90 font-semibold"
                            onClick={() => handleCompleteTest(test.testNumber)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Test
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
