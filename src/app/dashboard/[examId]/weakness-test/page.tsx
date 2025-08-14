"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Brain,
  Target,
  TrendingUp,
  Clock,
  FileText,
  Play,
  AlertCircle,
  Zap,
  FlaskConical,
  Calculator,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

//==============================================================================
// TYPES (Typically in a separate types/index.ts file)
//==============================================================================
interface Exam {
  id: number;
  name: string;
}

interface WeakestTopicsData {
  examId: number;
  examName: string;
  expectedQuestions: number;
  estimatedTimeMinutes: number;
  subjectBreakdown: {
    [subject: string]: {
      subtopicId: number;
      subtopicName: string;
      accuracy: number;
    }[];
  };
}

interface TestData {
  testInstanceId: string;
  testName: string;
  totalQuestions: number;
  totalMarks: number;
  timeLimit: number;
  instructions: string[];
  questions: {
    id: number;
    questionNumber: number;
    question: string;
    options: string[];
    imageUrl?: string;
  }[];
}

interface TestResults {
  summary: {
    testInstanceId: string;
    score: number;
    totalMarks: number;
    accuracyPercentage: string;
    totalCorrect: number;
    totalIncorrect: number;
    totalUnattempted: number;
  };
  detailedResults: any[];
}

// FIX: Re-added missing types for mockSubjects
interface WeakTopic {
  name: string;
  weaknessPercentage: number;
}

interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  weakTopics: WeakTopic[];
}

//==============================================================================
// MOCK API SERVICE (Typically in a separate services/api.ts file)
//==============================================================================
const mockWeakestTopicsData: WeakestTopicsData = {
  examId: 1,
  examName: "JEE Main",
  expectedQuestions: 15,
  estimatedTimeMinutes: 30,
  subjectBreakdown: {
    Physics: [
      { subtopicId: 101, subtopicName: "Rotational Motion", accuracy: 35.5 },
      {
        subtopicId: 102,
        subtopicName: "Electromagnetic Induction",
        accuracy: 42.1,
      },
      {
        subtopicId: 104,
        subtopicName: "magnetic Induction",
        accuracy: 22.1,
      },
    ],
    Chemistry: [
      { subtopicId: 201, subtopicName: "Organic Reactions", accuracy: 28.9 },
      { subtopicId: 202, subtopicName: "Chemical Equilibrium", accuracy: 38.7 },
      { subtopicId: 203, subtopicName: "Chemical Bonding", accuracy: 18.7 },
    ],
    Mathematics: [
      { subtopicId: 301, subtopicName: "Definite Integrals", accuracy: 32.0 },
      {
        subtopicId: 302,
        subtopicName: "Vectors and 3D Geometry",
        accuracy: 40.5,
      },
      { subtopicId: 303, subtopicName: "InDefinite Integrals", accuracy: 42.0 },
    ],
  },
};

const mockTestData: TestData = {
  testInstanceId: "mock-test-123",
  testName: "JEE Main - Weakness Test",
  totalQuestions: 15,
  totalMarks: 60,
  timeLimit: 1800,
  instructions: ["This is a mock test."],
  questions: [
    {
      id: 1,
      questionNumber: 1,
      question: "What is the moment of inertia of a disc about its diameter?",
      options: ["MR²/2", "MR²/4", "MR²/8", "2MR²"],
    },
    {
      id: 2,
      questionNumber: 2,
      question: "Which of the following is an example of an electrophile?",
      options: ["NH₃", "H₂O", "BF₃", "CN⁻"],
    },
    {
      id: 3,
      questionNumber: 3,
      question: "Evaluate ∫(1 to 2) (x^2) dx.",
      options: ["7/3", "1", "3", "7"],
    },
  ],
};

// FIX: Re-added the mockSubjects constant definition
const mockSubjects: Subject[] = [
  {
    id: "physics",
    name: "Physics",
    icon: Zap,
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    weakTopics: [
      { name: "Mechanics", weaknessPercentage: 75 },
      { name: "Thermodynamics", weaknessPercentage: 68 },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: FlaskConical,
    gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    weakTopics: [
      { name: "Organic Chemistry", weaknessPercentage: 80 },
      { name: "Physical Chemistry", weaknessPercentage: 71 },
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    gradient: "bg-gradient-to-br from-orange-300 to-orange-500",
    weakTopics: [
      { name: "Calculus", weaknessPercentage: 73 },
      { name: "Coordinate Geometry", weaknessPercentage: 69 },
    ],
  },
];

export const apiService = {
  async getWeakestTopics(examId: number): Promise<WeakestTopicsData> {
    console.log("MOCK API: Fetching weakest topics for examId:", examId);
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockWeakestTopicsData), 1000)
    );
  },

  async generateWeaknessTest(
    examId: number
  ): Promise<{ testInstanceId: string }> {
    console.log("MOCK API: Generating test for examId:", examId);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ testInstanceId: "mock-test-123" }), 1500)
    );
  },

  async getTestForTaking(testId: string): Promise<TestData> {
    console.log("MOCK API: Fetching test data for testId:", testId);
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockTestData), 1000)
    );
  },

  async submitWeaknessTest(
    testInstanceId: string,
    answers: any,
    timeTakenSec: number
  ): Promise<TestResults> {
    console.log("MOCK API: Submitting test with ID:", testInstanceId, {
      answers,
      timeTakenSec,
    });
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            summary: {
              testInstanceId: "mock-test-123",
              score: 45,
              totalMarks: 60,
              accuracyPercentage: "75.00",
              totalCorrect: 9,
              totalIncorrect: 3,
              totalUnattempted: 3,
            },
            detailedResults: [],
          }),
        1200
      )
    );
  },
};
// const Card = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
//     {children}
//   </div>
// );
// const CardContent = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => <div className={`px-6 py-4 ${className}`}>{children}</div>;
// const Button = ({
//   children,
//   onClick,
//   disabled = false,
//   variant = "default",
//   size = "default",
//   className = "",
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   disabled?: boolean;
//   variant?: "default" | "ghost";
//   size?: "default" | "lg";
//   className?: string;
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//   const variants = {
//     default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//     ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
//   };
//   const sizes = { default: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// const Badge = ({
//   children,
//   className = "",
//   variant = "default",
// }: {
//   children: React.ReactNode;
//   className?: string;
//   variant?: "default" | "secondary" | "outline";
// }) => {
//   const variants = {
//     default: "bg-blue-100 text-blue-800",
//     secondary: "bg-gray-100 text-gray-800",
//     outline: "border border-gray-300 text-gray-700 bg-white",
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
//     >
//       {children}
//     </span>
//   );
// };

//==============================================================================
// WEAK TOPICS PREVIEW COMPONENT
//==============================================================================
export const WeakTopicsPreview: React.FC<{
  data?: WeakestTopicsData;
  onStartTest?: () => void;
  onBack?: () => void;
  loading?: boolean;
  error?: string;
}> = ({ data, onStartTest, onBack, loading, error }) => {
  const completedWeaknessTests = 2; // Mock data for completed tests count

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={onBack}
                className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Weakness Tests
                </h1>
                <p className="text-gray-600">
                  AI-powered analysis to identify and strengthen your weak
                  topics
                </p>
              </div>
            </div>
            {completedWeaknessTests > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Tests Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedWeaknessTests}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress banner */}
      {completedWeaknessTests > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">
                  Keep improving! 🎯 Your personalized weakness analysis is
                  ready.
                </p>
                <p className="text-blue-600 text-sm">
                  Based on your previous performance, we've identified new areas
                  to focus on.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Test Overview Card */}
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {data?.examName} - Weakness Analysis Test
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-600 border-orange-200"
                  >
                    Ready to Start
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-600 bg-purple-50"
                  >
                    AI Personalized
                  </Badge>
                </div>
                {data && (
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {data.estimatedTimeMinutes} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {data.expectedQuestions} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Weakness Focused
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      AI Generated
                    </span>
                  </div>
                )}
                <div className="flex gap-2 mb-3">
                  {data?.subjectBreakdown &&
                    Object.keys(data.subjectBreakdown).map((subject) => (
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
                <Button
                  variant="default"
                  className="!bg-[#12b981] !text-white hover:!bg-[#12b981]/90 font-semibold flex items-center justify-center"
                  onClick={onStartTest}
                  disabled={loading || !data}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      <span>Start Weakness Test</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Analysis Cards Grid */}
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data.subjectBreakdown).map(
              ([subjectName, subtopics]) => {
                const subjectInfo =
                  mockSubjects.find((s) => s.name === subjectName) ||
                  mockSubjects[0];
                return (
                  <Card
                    key={subjectName}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden"
                  >
                    <div
                      className={`${subjectInfo.gradient} p-6 text-white relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="relative flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <subjectInfo.icon className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold">{subjectName}</h2>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Weakest Topics
                        </h3>
                        <div className="space-y-3">
                          {subtopics.slice(0, 5).map((topic) => {
                            const weaknessPercentage = Math.round(
                              100 - topic.accuracy
                            );
                            return (
                              <div
                                key={topic.subtopicId}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                              >
                                <span className="text-sm font-medium text-gray-900">
                                  {topic.subtopicName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                                      style={{
                                        width: `${weaknessPercentage}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-500 w-8">
                                    {weaknessPercentage}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden"
              >
                <div className={`${subject.gradient} p-6 text-white relative`}>
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <subject.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold">{subject.name}</h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Weakest Topics
                    </h3>
                    <div className="space-y-3">
                      {subject.weakTopics.map((topic) => (
                        <div
                          key={topic.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {topic.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-red-500"
                                style={{
                                  width: `${topic.weaknessPercentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-500">
                              {topic.weaknessPercentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function WeaknessTestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [weaknessData, setWeaknessData] = useState<WeakestTopicsData | null>(
    null
  );
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        const examInfo = { id: 1, name: "JEE Main" }; // Mocked
        setSelectedExam(examInfo);
        const weakness = await apiService.getWeakestTopics(examInfo.id);
        setWeaknessData(weakness);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleStartTest = async () => {
    if (!selectedExam) return;
    try {
      setGenerating(true);
      setError(null);
      const response = await apiService.generateWeaknessTest(selectedExam.id);
      router.push(`/test/${response.testInstanceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate test");
      setGenerating(false);
    }
  };

  const handleBackToDashboard = () => router.push("/dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <WeakTopicsPreview
      data={weaknessData}
      onStartTest={handleStartTest}
      onBack={handleBackToDashboard}
      loading={generating}
      error={error}
    />
  );
}
