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
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService, WeaknessTestHistoryItem } from "@/services/weaknessApi";
import { examIdMap } from "../../../../lib/utils";
import { useParams } from "next/navigation";
import { WeaknessTestHistory } from "@/components/test-environment/weakness-history";

interface WeakestTopicsData {
  examId: number;
  examName: string;
  expectedQuestions: number;
  estimatedTimeMinutes: number;
  subjectBreakdown: {
    // The key is the subject name (e.g., "Physics")
    [subject: string]: {
      topicId: number;
      topicName: string;
      accuracy: number;
    }[];
  };
}

const subjectUIMap: {
  [key: string]: {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
  };
} = {
  Physics: {
    icon: Zap,
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  Chemistry: {
    icon: FlaskConical,
    gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  },
  Mathematics: {
    icon: Calculator,
    gradient: "bg-[#ff6b35]",
  },
  Default: {
    icon: Brain,
    gradient: "bg-gradient-to-br from-gray-400 to-gray-600",
  },
};

export const WeakTopicsPreview: React.FC<{
  data: WeakestTopicsData | null;
  onStartTest: () => void;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
  completedWeaknessTests: number | 0;
}> = ({
  data,
  onStartTest,
  onBack,
  loading,
  error,
  completedWeaknessTests,
}) => {
  const router = useRouter();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg bg-gray-50 rounded-xl shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <Lightbulb className="w-16 h-16 text-[#ff6b35]" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-4 font-display">
            Not Enough Data Yet!
          </h2>

          {/* Main Message */}
          <p className="text-text-secondary mb-4 font-body">
            We need more performance data to create your personalized weakness
            test.
          </p>

          {/* Encouraging Text */}
          <p className="text-text-secondary text-sm mb-6 font-body opacity-90">
            Don't worry! Take a few more smart tests or quizzes to help us
            understand your learning patterns better.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="px-6 py-3 border-primary text-primary hover:bg-primary/5 font-medium rounded-lg transition-colors"
            >
              Try Again
            </Button>
          </div>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data
            ? Object.entries(data.subjectBreakdown).map(
                ([subjectName, topics]) => {
                  const subjectInfo =
                    subjectUIMap[subjectName] || subjectUIMap.Default;
                  const Icon = subjectInfo.icon;
                  return (
                    <Card
                      key={subjectName}
                      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden"
                    >
                      <div
                        className={`${subjectInfo.gradient} p-6 text-white relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 transition-colors duration-300" />
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Icon className="h-6 w-6" />
                          </div>
                          <h2 className="text-xl font-semibold text-white">
                            {subjectName}
                          </h2>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Weakest Topics
                          </h3>
                          <div className="space-y-3">
                            {topics.slice(0, 5).map((topic) => {
                              const weaknessPercentage = Math.round(
                                topic.accuracy
                              );
                              return (
                                <div
                                  key={topic.topicId}
                                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                                >
                                  <span className="text-sm font-medium text-gray-900">
                                    {topic.topicName}
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
              )
            : // Skeleton loader for subject cards
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border-0 overflow-hidden">
                  <div className="p-6 bg-gray-200 animate-pulse h-[88px]" />
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="space-y-3">
                        <div className="h-12 bg-gray-100 rounded animate-pulse" />
                        <div className="h-12 bg-gray-100 rounded animate-pulse" />
                        <div className="h-12 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
};

export default function WeaknessTestPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [weaknessData, setWeaknessData] = useState<WeakestTopicsData | null>(
    null
  );
  const [historyData, setHistoryData] = useState<
    WeaknessTestHistoryItem[] | null
  >(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const router = useRouter();
  const { examId } = useParams<{ examId: string }>();

  useEffect(() => {
    const currentExamId = examIdMap[examId];
    setSelectedExamId(currentExamId);

    const initialize = async () => {
      try {
        setPageLoading(true);
        setHistoryLoading(true);
        setError(null);

        const [weakness, history] = await Promise.all([
          apiService.getWeakestTopics(currentExamId),
          apiService.getWeaknessTestHistory(),
        ]);

        setWeaknessData(weakness);
        setHistoryData(history);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load weakness data."
        );
      } finally {
        setPageLoading(false);
        setHistoryLoading(false);
      }
    };

    initialize();
  }, []);

  const handleStartTest = async () => {
    if (!selectedExamId) return;
    try {
      setIsGeneratingTest(true);
      setError(null);
      const { testInstanceId } = await apiService.generateWeaknessTest(
        selectedExamId
      );
      router.push(`/weakness-test/${testInstanceId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate the test."
      );
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleBackToDashboard = () => router.back();

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
        <span className="ml-3 text-gray-700">
          Analyzing your performance...
        </span>
      </div>
    );
  }

  return (
    <>
      <WeakTopicsPreview
        data={weaknessData}
        onStartTest={handleStartTest}
        onBack={handleBackToDashboard}
        loading={isGeneratingTest}
        error={error}
        completedWeaknessTests={historyData?.length ?? 0}
      />
      <div className="p-6 max-w-7xl mx-auto">
        <WeaknessTestHistory
          history={historyData}
          loading={historyLoading}
          error={error && !weaknessData ? "Failed to load history." : null}
        />
      </div>
    </>
  );
}
