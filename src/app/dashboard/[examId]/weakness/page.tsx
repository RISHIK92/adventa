"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Target,
  TrendingUp,
  Clock,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  Trophy,
  Zap,
  BookOpen,
  ArrowRight,
  BarChart3,
  Timer,
  Award,
  Sparkles,
  Users,
  Star,
  Rocket,
  TestTube,
  Calculator,
  Atom,
  History,
  MousePointer,
  Layers,
  FlaskConical,
} from "lucide-react";

// Types
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

interface Question {
  id: number;
  questionNumber: number;
  question: string;
  options: string[];
  imageUrl?: string;
}

interface TestData {
  testInstanceId: string;
  testName: string;
  totalQuestions: number;
  totalMarks: number;
  timeLimit: number;
  instructions: string[];
  questions: Question[];
}

interface Answer {
  questionId: number;
  userAnswer: string | null;
  timeTaken: number;
}

interface TestResults {
  testInstanceId: string;
  score: number;
  totalMarks: number;
  accuracyPercentage: string;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
}

interface SubtopicComparison {
  subtopicId: number;
  subtopicName: string;
  accuracyBefore: string;
  accuracyAfter: string;
  change: string;
}

// URL parameter extraction utility
const getExamFromPath = (): string | null => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const match = path.match(/\/dashboard\/([^/]+)\/weakness-test/);
    return match ? match[1] : null;
  }
  return null;
};

// Exam mapping utility
const mapExamTypeToName = (
  examType: string
): { id: number; name: string } | null => {
  const examMappings: Record<string, { id: number; name: string }> = {
    jee: { id: 1, name: "JEE Main" },
    "jee-advanced": { id: 2, name: "JEE Advanced" },
    neet: { id: 3, name: "NEET" },
  };

  return examMappings[examType.toLowerCase()] || null;
};

// Mock API functions
const api = {
  getAvailableExams: async (): Promise<Exam[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { id: 1, name: "JEE Main" },
      { id: 2, name: "JEE Advanced" },
      { id: 3, name: "NEET" },
    ];
  },

  getWeakestTopics: async (
    examId: number,
    examName: string
  ): Promise<WeakestTopicsData> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockData: Record<string, any> = {
      "JEE Main": {
        subjectBreakdown: {
          Physics: [
            { subtopicId: 1, subtopicName: "Mechanics", accuracy: 45.2 },
            { subtopicId: 2, subtopicName: "Thermodynamics", accuracy: 52.1 },
            { subtopicId: 3, subtopicName: "Electromagnetism", accuracy: 38.9 },
          ],
          Chemistry: [
            {
              subtopicId: 4,
              subtopicName: "Organic Chemistry",
              accuracy: 41.7,
            },
            {
              subtopicId: 5,
              subtopicName: "Physical Chemistry",
              accuracy: 48.3,
            },
          ],
          Mathematics: [
            { subtopicId: 6, subtopicName: "Calculus", accuracy: 44.6 },
            { subtopicId: 7, subtopicName: "Algebra", accuracy: 51.2 },
            {
              subtopicId: 8,
              subtopicName: "Coordinate Geometry",
              accuracy: 39.8,
            },
          ],
        },
        expectedQuestions: 45,
        estimatedTimeMinutes: 90,
      },
      "JEE Advanced": {
        subjectBreakdown: {
          Physics: [
            { subtopicId: 1, subtopicName: "Modern Physics", accuracy: 35.8 },
            {
              subtopicId: 2,
              subtopicName: "Quantum Mechanics",
              accuracy: 42.3,
            },
            { subtopicId: 3, subtopicName: "Optics", accuracy: 38.1 },
          ],
          Chemistry: [
            {
              subtopicId: 4,
              subtopicName: "Inorganic Chemistry",
              accuracy: 39.4,
            },
            {
              subtopicId: 5,
              subtopicName: "Physical Chemistry",
              accuracy: 43.7,
            },
          ],
          Mathematics: [
            {
              subtopicId: 6,
              subtopicName: "Differential Equations",
              accuracy: 37.2,
            },
            { subtopicId: 7, subtopicName: "Complex Numbers", accuracy: 41.8 },
          ],
        },
        expectedQuestions: 54,
        estimatedTimeMinutes: 120,
      },
      NEET: {
        subjectBreakdown: {
          Physics: [
            { subtopicId: 1, subtopicName: "Mechanics", accuracy: 48.5 },
            { subtopicId: 2, subtopicName: "Thermodynamics", accuracy: 43.2 },
          ],
          Chemistry: [
            {
              subtopicId: 4,
              subtopicName: "Organic Chemistry",
              accuracy: 46.8,
            },
            {
              subtopicId: 5,
              subtopicName: "Inorganic Chemistry",
              accuracy: 41.3,
            },
          ],
          Biology: [
            { subtopicId: 9, subtopicName: "Cell Biology", accuracy: 44.7 },
            { subtopicId: 10, subtopicName: "Genetics", accuracy: 39.6 },
            {
              subtopicId: 11,
              subtopicName: "Human Physiology",
              accuracy: 42.1,
            },
          ],
        },
        expectedQuestions: 50,
        estimatedTimeMinutes: 100,
      },
    };

    const data = mockData[examName] || mockData["JEE Main"];

    return {
      examId,
      examName,
      expectedQuestions: data.expectedQuestions,
      estimatedTimeMinutes: data.estimatedTimeMinutes,
      subjectBreakdown: data.subjectBreakdown,
    };
  },

  generateWeaknessTest: async (
    examId: number,
    examName: string
  ): Promise<TestData> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      testInstanceId: "test-123",
      testName: `${examName} - Weakness Test`,
      totalQuestions: 45,
      totalMarks: 180,
      timeLimit: 5400,
      instructions: [
        `This test focuses on your weakest topics in ${examName}.`,
        "Each correct answer carries 4 marks.",
        "Each incorrect answer will result in a penalty of 1 mark(s).",
        "Unattempted questions will receive 0 marks.",
      ],
      questions: Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        questionNumber: i + 1,
        question: `This is ${examName} weakness test question ${
          i + 1
        }. What is the solution to this problem?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      })),
    };
  },

  submitWeaknessTest: async (
    testInstanceId: string,
    answers: Answer[],
    timeTakenSec: number
  ): Promise<TestResults> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      testInstanceId,
      score: 142,
      totalMarks: 180,
      accuracyPercentage: "78.89",
      totalCorrect: 35,
      totalIncorrect: 8,
      totalUnattempted: 2,
    };
  },

  getAccuracyComparison: async (
    testInstanceId: string
  ): Promise<SubtopicComparison[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [
      {
        subtopicId: 1,
        subtopicName: "Mechanics",
        accuracyBefore: "45.20",
        accuracyAfter: "62.50",
        change: "+17.30",
      },
      {
        subtopicId: 2,
        subtopicName: "Thermodynamics",
        accuracyBefore: "52.10",
        accuracyAfter: "68.75",
        change: "+16.65",
      },
      {
        subtopicId: 4,
        subtopicName: "Organic Chemistry",
        accuracyBefore: "41.70",
        accuracyAfter: "58.33",
        change: "+16.63",
      },
    ];
  },
};

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

const mockSubjects: Subject[] = [
  {
    id: "physics",
    name: "Physics",
    icon: Zap,
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    weakTopics: [
      { name: "Mechanics", weaknessPercentage: 75 },
      { name: "Thermodynamics", weaknessPercentage: 68 },
      { name: "Electromagnetism", weaknessPercentage: 62 },
      { name: "Modern Physics", weaknessPercentage: 58 },
      { name: "Optics", weaknessPercentage: 55 },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: FlaskConical,
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    weakTopics: [
      { name: "Organic Chemistry", weaknessPercentage: 80 },
      { name: "Physical Chemistry", weaknessPercentage: 71 },
      { name: "Chemical Bonding", weaknessPercentage: 65 },
      { name: "Inorganic Chemistry", weaknessPercentage: 60 },
      { name: "Stoichiometry", weaknessPercentage: 52 },
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    weakTopics: [
      { name: "Calculus", weaknessPercentage: 73 },
      { name: "Coordinate Geometry", weaknessPercentage: 69 },
      { name: "Trigonometry", weaknessPercentage: 64 },
      { name: "Algebra", weaknessPercentage: 58 },
      { name: "Statistics", weaknessPercentage: 51 },
    ],
  },
];

export const WeakTopicsPreview: React.FC<{
  data?: WeakestTopicsData;
  onStartTest?: () => void;
  onBack?: () => void;
  loading?: boolean;
}> = ({ data, onStartTest, onBack, loading }) => {
  const completedWeaknessTests = 2; // Mock data for completed tests count

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matching mock tests style */}
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
                <p className="text-2xl font-bold text-[#12b981]">
                  {completedWeaknessTests}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional progress banner for returning users */}
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
                  to focus on for maximum improvement.
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
                    className="bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/20"
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

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {data?.estimatedTimeMinutes} minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {data?.expectedQuestions} Questions
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
                  className="bg-[#12b981] text-white hover:bg-[#12b981]/90 font-semibold"
                  onClick={onStartTest}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Weakness Test
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Analysis Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSubjects.map((subject, index) => (
            <Card
              key={subject.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Gradient Header */}
              <div
                className={`${subject.gradient} p-6 text-white relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
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

                  {/* Weak Topics List */}
                  <div className="space-y-3">
                    {subject.weakTopics.slice(0, 5).map((topic, topicIndex) => (
                      <div
                        key={topic.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 animate-in fade-in slide-in-from-left-2"
                        style={{
                          animationDelay: `${index * 100 + topicIndex * 50}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {topic.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: `${topic.weaknessPercentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 w-8">
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

        {/* Info Section */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">
                  How It Works
                </h3>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                Our AI analyzes your past performance to identify topics where
                you struggle most. The weakness test focuses specifically on
                these areas to help you improve faster and more efficiently.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Expected Benefits
                </h3>
              </div>
              <p className="text-green-800 text-sm leading-relaxed">
                By focusing on your weak areas, you can expect to see
                significant improvement in overall accuracy. Most students see
                15-25% improvement in their problem areas after taking weakness
                tests.
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

const TestEnvironmentView: React.FC<{
  testData: TestData;
  onSubmitTest: (answers: Answer[], timeTaken: number) => void;
  onBack: () => void;
}> = ({ testData, onSubmitTest, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = testData.questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    const formattedAnswers: Answer[] = testData.questions.map((q) => ({
      questionId: q.id,
      userAnswer: answers[q.id] || null,
      timeTaken: Math.floor(Math.random() * 120) + 30,
    }));

    const timeTaken = testData.timeLimit - timeLeft;
    await onSubmitTest(formattedAnswers, timeTaken);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Exit Test
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-xl font-bold">{testData.testName}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-white/60">Time Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {currentQuestionIndex + 1}/{testData.totalQuestions}
              </div>
              <div className="text-xs text-white/60">Question</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Question {currentQuestion.questionNumber}
                </h2>
                <Badge
                  variant="outline"
                  className="border-white/30 text-white/70"
                >
                  {Math.floor(Math.random() * 3) + 1} marks
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-white/90 text-base leading-relaxed">
                {currentQuestion.question}
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index);
                  const isSelected =
                    answers[currentQuestion.id] === optionLetter;

                  return (
                    <label
                      key={index}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-500/30 border border-blue-400"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={optionLetter}
                        checked={isSelected}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          isSelected
                            ? "border-blue-400 bg-blue-400"
                            : "border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white/20"></div>
                        )}
                      </div>
                      <span className="font-medium mr-3">{optionLetter}.</span>
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-80 p-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(
                        testData.questions.length - 1,
                        currentQuestionIndex + 1
                      )
                    )
                  }
                  disabled={
                    currentQuestionIndex === testData.questions.length - 1
                  }
                >
                  Next
                </Button>
              </div>

              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleSubmitTest}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Test"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-sm">
                Questions Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {testData.questions.map((question, index) => {
                  const isAnswered = answers[question.id];
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : isAnswered
                          ? "bg-green-500/70 text-white"
                          : "bg-white/20 text-white/70 hover:bg-white/30"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TestResultsView: React.FC<{
  results: TestResults;
  comparison: SubtopicComparison[];
  onRetakeTest: () => void;
  onBackToDashboard: () => void;
}> = ({ results, comparison, onRetakeTest, onBackToDashboard }) => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-6">
          <Trophy className="w-8 h-8 text-amber-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Test Results</h1>
            <p className="text-slate-600">
              Your weakness test performance analysis
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="relative z-10 p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-xl inline-block mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {results.score}/{results.totalMarks}
            </h3>
            <p className="text-slate-600">Score</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-xl inline-block mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-1">
              {results.totalCorrect}
            </h3>
            <p className="text-slate-600">Correct</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-red-100 rounded-xl inline-block mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-1">
              {results.totalIncorrect}
            </h3>
            <p className="text-slate-600">Incorrect</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-amber-100 rounded-xl inline-block mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-amber-600 mb-1">
              {results.totalUnattempted}
            </h3>
            <p className="text-slate-600">Unattempted</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg mb-8">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-green-600">
                {results.accuracyPercentage}%
              </h2>
              <p className="text-lg text-slate-600">Overall Accuracy</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${results.accuracyPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            Accuracy Improvement by Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparison.map((item) => (
              <div
                key={item.subtopicId}
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100"
              >
                <h4 className="font-semibold text-slate-900 mb-3">
                  {item.subtopicName}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Before:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-red-200 rounded-full">
                        <div
                          className="h-2 bg-red-500 rounded-full"
                          style={{ width: `${item.accuracyBefore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        {item.accuracyBefore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">After:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-green-200 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${item.accuracyAfter}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {item.accuracyAfter}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-green-200">
                    <span className="text-sm font-semibold text-slate-900">
                      Improvement:
                    </span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">
                        {item.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Trophy className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    Strengths Identified
                  </h4>
                  <p className="text-sm text-green-600">
                    Your performance improved significantly in targeted weak
                    areas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Focused Practice
                  </h4>
                  <p className="text-sm text-blue-600">
                    This weakness test addressed your specific problem areas
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">
                    AI Recommendations
                  </h4>
                  <p className="text-sm text-purple-600">
                    Continue practicing similar questions to maintain
                    improvement
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Rocket className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800">Next Steps</h4>
                  <p className="text-sm text-amber-600">
                    Take another weakness test to track continued progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onRetakeTest}
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Rocket className="w-5 h-5 mr-3" />
          Take Another Test
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onBackToDashboard}
          className="px-8 py-4 text-lg font-semibold border-slate-300 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowRight className="w-5 h-5 mr-3" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 border border-green-200">
          <Star className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">
            Great job! You've successfully targeted and improved your weak
            areas.
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Main App Component
const WeaknessTestApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "weakness-preview" | "test-environment" | "results"
  >("weakness-preview");
  const [loading, setLoading] = useState(false);

  // Data state
  const [selectedExam, setSelectedExam] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [weaknessData, setWeaknessData] = useState<WeakestTopicsData | null>(
    null
  );
  const [testData, setTestData] = useState<TestData | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [accuracyComparison, setAccuracyComparison] = useState<
    SubtopicComparison[]
  >([]);

  // Initialize app with URL parameters
  useEffect(() => {
    const examType = getExamFromPath();
    if (examType) {
      const examInfo = mapExamTypeToName(examType);
      if (examInfo) {
        setSelectedExam(examInfo);
        loadWeaknessData(examInfo.id, examInfo.name);
      } else {
        console.error(`Unknown exam type: ${examType}`);
        // Fallback to JEE Main
        const fallbackExam = { id: 1, name: "JEE Main" };
        setSelectedExam(fallbackExam);
        loadWeaknessData(fallbackExam.id, fallbackExam.name);
      }
    } else {
      // Fallback if no exam type in URL
      const fallbackExam = { id: 1, name: "JEE Main" };
      setSelectedExam(fallbackExam);
      loadWeaknessData(fallbackExam.id, fallbackExam.name);
    }
  }, []);

  const loadWeaknessData = async (examId: number, examName: string) => {
    setLoading(true);
    try {
      const weakness = await api.getWeakestTopics(examId, examName);
      setWeaknessData(weakness);
      setCurrentView("weakness-preview");
    } catch (error) {
      console.error("Failed to load weakness data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (!selectedExam) return;

    setLoading(true);
    try {
      const test = await api.generateWeaknessTest(
        selectedExam.id,
        selectedExam.name
      );
      setTestData(test);
      setCurrentView("test-environment");
    } catch (error) {
      console.error("Failed to generate test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async (answers: Answer[], timeTaken: number) => {
    if (!testData) return;

    try {
      const results = await api.submitWeaknessTest(
        testData.testInstanceId,
        answers,
        timeTaken
      );
      setTestResults(results);

      const comparison = await api.getAccuracyComparison(
        testData.testInstanceId
      );
      setAccuracyComparison(comparison);

      setCurrentView("results");
    } catch (error) {
      console.error("Failed to submit test:", error);
    }
  };

  const handleRetakeTest = () => {
    if (selectedExam) {
      loadWeaknessData(selectedExam.id, selectedExam.name);
    }
    setTestData(null);
    setTestResults(null);
    setAccuracyComparison([]);
  };

  const handleBackToDashboard = () => {
    // In a real app, you'd navigate back to the dashboard
    if (typeof window !== "undefined") {
      const examType = getExamFromPath();
      window.location.href = `/dashboard/${examType}`;
    }
  };

  const handleBackToExams = () => {
    // Navigate back to dashboard
    handleBackToDashboard();
  };

  const handleBackFromTest = () => {
    setCurrentView("weakness-preview");
    setTestData(null);
  };

  // Show loading state if still initializing
  if (!selectedExam || !weaknessData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading weakness analysis...</p>
        </div>
      </div>
    );
  }

  // Render current view
  switch (currentView) {
    case "weakness-preview":
      return (
        <WeakTopicsPreview
          data={weaknessData}
          onStartTest={handleStartTest}
          onBack={handleBackToExams}
          loading={loading}
        />
      );

    case "test-environment":
      return testData ? (
        <TestEnvironmentView
          testData={testData}
          onSubmitTest={handleSubmitTest}
          onBack={handleBackFromTest}
        />
      ) : null;

    case "results":
      return testResults ? (
        <TestResultsView
          results={testResults}
          comparison={accuracyComparison}
          onRetakeTest={handleRetakeTest}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : null;

    default:
      return null;
  }
};

export default WeaknessTestApp;
