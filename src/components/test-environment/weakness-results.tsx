"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIAnalysisModal } from "../ai-models/quiz-analysis-model";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  SkipForward,
  Brain,
  Target,
  Zap,
  Eye,
  EyeOff,
  ChevronLeft,
  Sparkles,
  Users,
  BarChart3,
  Icon,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  BookOpen,
  Clock,
  ArrowRight,
  Trophy,
  Activity,
  Lightbulb,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Latex from "react-latex-next";
import { Badge } from "../ui/badge";

interface UserPerformanceRecord {
  totalAttempted: number;
  totalCorrect: number;
  accuracyPercent: string;
  avgTimePerQuestionSec: string;
}

interface Question {
  questionId: number;
  question: string;
  userAnswer: string | null;
  correctOption: string;
  solution: string;
  isCorrect: boolean;
  timeTakenSec: number;
  topicName?: string;
  options?: Record<string, string>;
  imageUrl?: string;
  imagesolurl?: string;
}

export interface QuizResultsProps {
  testSummary: {
    testInstanceId: string;
    testName: string;
    score: number;
    totalMarks: number;
    totalCorrect: number;
    totalIncorrect: number;
    totalUnattempted: number;
    completedAt: string;
    userOverallAverageAccuracy: string;
    timeTakenSec: number;
    avgTimePerQuestionSec: string;
  };
  subjectAnalysis: {
    [subjectName: string]: {
      accuracy: string;
      totalTimeTakenSec: number;
      avgTimePerQuestionSec: string;
      topics: {
        [topicName: string]: {
          accuracy: string;
          communityAverageAccuracy: string;
          userOverallPerformance: UserPerformanceRecord | null;
          totalTimeTakenSec: number;
          avgTimePerQuestionSec: string;
          difficultyBreakdown?: {
            [difficulty: string]: {
              totalQuestions: number;
              correctAnswers: number;
              accuracy: string;
              userOverallPerformance: UserPerformanceRecord | null;
              totalTimeTakenSec: number;
              avgTimePerQuestionSec: string;
            };
          };
          subtopics: {
            [subtopicName: string]: {
              accuracy: string;
              communityAverageAccuracy: string;
              userOverallPerformance: UserPerformanceRecord | null;
              totalTimeTakenSec: number;
              avgTimePerQuestionSec: string;
              questions: Question[];
            };
          };
        };
      };
    };
  };
  accuracyComparison: {
    topicName: string;
    accuracyBefore: string;
    accuracyAfter: string;
    change: string;
    communityAverageAccuracy: string;
  }[];
}

interface PerformanceStatProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  colorClass?: string;
  tooltip?: string;
}

const PerformanceStat = ({
  title,
  value,
  icon: Icon,
  colorClass = "text-blue-500",
  tooltip,
}: PerformanceStatProps) => (
  <div
    className="flex flex-col items-center text-center w-20 group"
    title={tooltip}
  >
    {Icon && <Icon className={`w-5 h-5 mb-1 ${colorClass}`} />}
    <div className="text-xs text-slate-500">{title}</div>
    <div className="font-bold text-slate-800 text-sm">
      {value === "N/A" ? "N/A" : `${value}%`}
    </div>
  </div>
);

export function QuizResults({
  testSummary,
  subjectAnalysis,
  accuracyComparison,
}: QuizResultsProps) {
  const [expandedAnswers, setExpandedAnswers] = useState<
    Record<number, boolean>
  >({});
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleAnswerExpansion = (questionId: number) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleQuestionExpansion = (questionId: any) => {
    setExpandedQuestions((prev: any) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getStatusIcon = (question: any) => {
    if (question.userAnswer === null) {
      return <SkipForward className="w-4 h-4 text-amber-500" />;
    }
    return question.isCorrect ? (
      <CheckCircle className="w-4 h-4 text-emerald-500" />
    ) : (
      <XCircle className="w-4 h-4 text-rose-500" />
    );
  };

  const getStatusColor = (question: any) => {
    if (question.userAnswer === null)
      return "border-l-amber-400 bg-amber-50/30";
    return question.isCorrect
      ? "border-l-emerald-400 bg-emerald-50/30"
      : "border-l-rose-400 bg-rose-50/30";
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const TimeStat = ({
    value,
    tooltip,
  }: {
    value: number | string;
    tooltip: string;
  }) => (
    <div
      className="flex items-center gap-1 text-xs text-slate-500 font-medium"
      title={tooltip}
    >
      <Clock className="w-3 h-3" />
      <span>{formatTime(parseFloat(String(value)))}</span>
    </div>
  );

  const RenderContent = ({ content }: { content: string }) => {
    const isImage =
      typeof content === "string" &&
      (content.startsWith("http://") || content.startsWith("https://"));

    if (isImage) {
      return (
        <img
          src={content}
          alt="Question option"
          className="max-h-32 max-w-72 object-contain rounded-md"
        />
      );
    }

    return <Latex>{content}</Latex>;
  };

  const allQuestions = useMemo((): Question[] => {
    const questions: Question[] = [];
    for (const subject in subjectAnalysis) {
      for (const topicName in subjectAnalysis[subject].topics) {
        const topic = subjectAnalysis[subject].topics[topicName];
        for (const subtopic in topic.subtopics) {
          topic.subtopics[subtopic].questions.forEach((q) => {
            questions.push({ ...q, topicName });
          });
        }
      }
    }
    return questions.sort((a, b) => a.questionId - b.questionId);
  }, [subjectAnalysis]);

  const topicStats = useMemo(() => {
    const stats: Record<
      string,
      { total: number; correct: number; avgTime: number; accuracy: number }
    > = {};
    for (const subject in subjectAnalysis) {
      for (const topicName in subjectAnalysis[subject].topics) {
        const topicData = subjectAnalysis[subject].topics[topicName];
        let total = 0;
        let correct = 0;
        let totalTime = 0;

        for (const subtopic in topicData.subtopics) {
          const questions = topicData.subtopics[subtopic].questions;
          total += questions.length;
          questions.forEach((q) => {
            if (q.isCorrect) correct++;
            totalTime += q.timeTakenSec;
          });
        }

        stats[topicName] = {
          total,
          correct,
          accuracy: parseFloat(topicData.accuracy),
          avgTime: total > 0 ? totalTime / total : 0,
        };
      }
    }
    return stats;
  }, [subjectAnalysis]);

  const aiAnalysis = useMemo(() => {
    const totalAttempted =
      testSummary.totalCorrect + testSummary.totalIncorrect;
    const overallAccuracy =
      totalAttempted > 0
        ? (testSummary.totalCorrect / totalAttempted) * 100
        : 0;

    const topicEntries = Object.entries(topicStats);
    const strongestTopic = topicEntries.reduce(
      (max, [topic, stats]) =>
        stats.accuracy > max.accuracy
          ? { topic, accuracy: stats.accuracy }
          : max,
      { topic: "N/A", accuracy: -1 }
    );
    const weakestTopic = topicEntries.reduce(
      (min, [topic, stats]) =>
        stats.accuracy < min.accuracy
          ? { topic, accuracy: stats.accuracy }
          : min,
      { topic: "N/A", accuracy: 101 }
    );

    return {
      overallPerformance:
        overallAccuracy >= 80
          ? "Excellent"
          : overallAccuracy >= 60
          ? "Good"
          : "Needs Improvement",
      strongestTopic,
      weakestTopic,
    };
  }, [testSummary, topicStats]);

  const weaknessAnalysis = useMemo(() => {
    const analysis = {
      targeting: {} as any,
      success: {} as any,
      difficulty: {} as any,
      recommendations: [] as any[],
    };

    // 1. Weakness Targeting Effectiveness
    accuracyComparison.forEach((topic) => {
      const improvement = parseFloat(topic.change);
      const currentAcc = parseFloat(topic.accuracyAfter);
      const communityAcc = parseFloat(topic.communityAverageAccuracy);

      let severity;
      if (currentAcc >= communityAcc) {
        severity = "good";
      } else if (currentAcc <= communityAcc - 10) {
        severity = "improving";
      } else if (currentAcc <= communityAcc / 2) {
        severity = "critical";
      } else {
        severity = "caution";
      }

      analysis.targeting[topic.topicName] = {
        improvement,
        status: improvement >= 0 ? "improving" : "declining",
        vsComm: communityAcc,
        severity,
        currentAccuracy: currentAcc,
      };
    });

    // 2. Success Metrics
    const improved = accuracyComparison.filter((t) => parseFloat(t.change) > 0);
    const breakthroughs = accuracyComparison.filter(
      (t) => parseFloat(t.change) >= 10
    );
    const communityBeaters = accuracyComparison.filter(
      (t) =>
        parseFloat(t.accuracyAfter) >= parseFloat(t.communityAverageAccuracy)
    );

    analysis.success = {
      totalTargeted: accuracyComparison.length,
      improved: improved.length,
      breakthroughs: breakthroughs.length,
      communityBeaters: communityBeaters.length,
      avgImprovement:
        accuracyComparison.reduce((sum, t) => sum + parseFloat(t.change), 0) /
        accuracyComparison.length,
    };

    // 3. Difficulty Analysis
    for (const subject in subjectAnalysis) {
      for (const topicName in subjectAnalysis[subject].topics) {
        const topicData = subjectAnalysis[subject].topics[topicName];
        if (topicData.difficultyBreakdown) {
          analysis.difficulty[topicName] = topicData.difficultyBreakdown;
        }
      }
    }

    // 4. Smart Recommendations
    Object.entries(analysis.targeting).forEach(
      ([topic, data]: [string, any]) => {
        if (data.currentAccuracy < 50) {
          analysis.recommendations.push({
            priority: "CRITICAL",
            topic,
            action: `Review ${topic} fundamentals`,
            reason: `Only ${data.currentAccuracy.toFixed(
              1
            )}% accuracy - needs immediate attention`,
            nextAction: "Focus on Easy difficulty questions first",
            color: "red",
            urgency: "high",
          });
        } else if (data.currentAccuracy < 70) {
          analysis.recommendations.push({
            priority: "HIGH",
            topic,
            action: `Strengthen ${topic} concepts`,
            reason: `${data.currentAccuracy.toFixed(
              1
            )}% accuracy - below target level`,
            nextAction: "Practice Mixed difficulty questions",
            color: "orange",
            urgency: "medium",
          });
        } else if (data.currentAccuracy < 85 && data.improvement > 0) {
          analysis.recommendations.push({
            priority: "MEDIUM",
            topic,
            action: `Master ${topic} advanced concepts`,
            reason: `${data.currentAccuracy.toFixed(
              1
            )}% accuracy - showing good progress`,
            nextAction: "Focus on Hard questions to reach mastery",
            color: "blue",
            urgency: "low",
          });
        }
      }
    );

    analysis.recommendations.sort((a, b) =>
      a.priority === "CRITICAL" ? -1 : b.priority === "CRITICAL" ? 1 : 0
    );

    return analysis;
  }, [subjectAnalysis, accuracyComparison]);

  const score = testSummary.score;
  const percentage =
    testSummary.totalMarks > 0
      ? Math.round((score / testSummary.totalMarks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header remains the same */}
      <header className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {testSummary.testName}
                  </h1>
                  <div className="hidden lg:inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700">
                      Results Analysis
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm md:text-base">
                  Completed on{" "}
                  {new Date(testSummary.completedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content Wrapper */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {!showAnswers ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card className="p-6 relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
                  <Button
                    onClick={() => setShowAnswers(true)}
                    variant="outline"
                    className="absolute top-0 md:top-4 right-4 flex items-center gap-2 bg-white/50 border-slate-300/70 hover:bg-white/80"
                  >
                    <Eye className="w-4 h-4" /> Check Answers
                  </Button>
                  <div className="text-center mb-6 mt-4">
                    <div className="text-6xl font-bold text-orange-500 mb-2">
                      {score}/{testSummary.totalMarks}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {percentage}% Score
                    </div>
                    <div className="text-gray-600 flex items-center justify-center gap-4 text-sm">
                      <span>Performance: {aiAnalysis.overallPerformance}</span>
                      <div className="h-4 w-px bg-slate-300" />
                      <div
                        className="flex items-center gap-1.5"
                        title="Your average accuracy across all topics you've practiced"
                      >
                        <BarChart3 className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">
                          {testSummary.userOverallAverageAccuracy}% Overall
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-100/50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {testSummary.totalCorrect}
                      </div>
                      <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    <div className="text-center p-4 bg-red-100/50 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">
                        {testSummary.totalIncorrect}
                      </div>
                      <div className="text-sm text-gray-600">Incorrect</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-100/50 rounded-lg">
                      <SkipForward className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {testSummary.totalUnattempted}
                      </div>
                      <div className="text-sm text-gray-600">Skipped</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowAIModal(true)}
                      className="mx-auto justify-center bg-[#ff6b35] hover:bg-[#ff6b25] text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <Brain className="w-4 h-4 mr-2" /> AI Analysis
                    </Button>
                  </div>
                  <div className="flex justify-center items-center gap-6 border-t mt-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-500">
                        Total Time Taken
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {formatTime(testSummary.timeTakenSec)}
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-center">
                      <div className="text-sm text-slate-500">
                        Avg. Time / Q
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {formatTime(
                          parseFloat(testSummary.avgTimePerQuestionSec)
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="p-4 bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900">
                      Strongest Topic{" "}
                      <span className="text-xs text-gray-500">{`(current test)`}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-green-600 mb-1">
                      {aiAnalysis.strongestTopic.topic}
                    </div>
                    <div>
                      {Math.round(aiAnalysis.strongestTopic.accuracy)}% accuracy
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-gray-900">
                      Weakest Topic{" "}
                      <span className="text-xs text-gray-500">{`(current test)`}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-orange-600 mb-1">
                      {aiAnalysis.weakestTopic.topic}
                    </div>
                    <div>
                      {Math.round(aiAnalysis.weakestTopic.accuracy)}% accuracy
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Rest of the original components... */}
            <Card className="p-6 mb-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Topic Performance Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100/70">
                      <th className="px-4 py-3 text-left font-medium text-slate-600">
                        Topic
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-600">
                        Past Acc.
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-600">
                        Current Acc.
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-600">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          title="Average accuracy of all users on this platform"
                        >
                          <Users className="w-4 h-4" />
                          <span>Community Avg.</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-slate-600">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {accuracyComparison.map((comp) => (
                      <tr
                        key={comp.topicName}
                        className="border-b border-slate-200/80 last:border-b-0"
                      >
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {comp.topicName}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600">
                          {comp.accuracyBefore}%
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-800">
                          {comp.accuracyAfter}%
                        </td>
                        <td className="px-4 py-3 text-center text-blue-600 font-medium">
                          {comp.communityAverageAccuracy}%
                        </td>
                        <td
                          className={`px-4 py-3 text-center font-bold ${
                            parseFloat(comp.change) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {parseFloat(comp.change) > 0 ? "+" : ""}
                          {comp.change}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detailed Subject Analysis
              </h3>
              <Accordion
                type="single"
                collapsible
                className="w-full overflow-x-auto"
              >
                {Object.entries(subjectAnalysis).map(
                  ([subjectName, subjectData]) => (
                    <div key={subjectName}>
                      <h4 className="text-lg font-semibold text-slate-700 mt-4 mb-2">
                        {subjectName}
                      </h4>
                      <Badge variant="outline" className="font-mono text-xs">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {formatTime(
                          parseFloat(subjectData.avgTimePerQuestionSec)
                        )}{" "}
                        avg/q
                      </Badge>
                      {Object.entries(subjectData.topics).map(
                        ([topicName, topicData]) => (
                          <AccordionItem key={topicName} value={topicName}>
                            <AccordionTrigger className="hover:bg-slate-100/70 px-4 rounded-lg">
                              <div className="flex-1 text-left">
                                <p className="font-medium text-slate-900">
                                  {topicName}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {Object.values(topicData.subtopics).reduce(
                                    (acc, st) => acc + st.questions.length,
                                    0
                                  )}{" "}
                                  questions in this test
                                </p>
                                <TimeStat
                                  value={topicData.avgTimePerQuestionSec}
                                  tooltip="Average time per question in this topic (for this test)"
                                />
                              </div>
                              <div className="flex items-center gap-6 mr-4">
                                <PerformanceStat
                                  title="This Test"
                                  value={topicData.accuracy}
                                  icon={Target}
                                  colorClass="text-orange-500"
                                  tooltip="Your accuracy in this test"
                                />
                                <PerformanceStat
                                  title="Your Overall"
                                  value={
                                    topicData.userOverallPerformance
                                      ?.accuracyPercent ?? "N/A"
                                  }
                                  icon={Activity}
                                  colorClass="text-purple-500"
                                  tooltip="Your historical accuracy in this topic"
                                />
                                <PerformanceStat
                                  title="Community"
                                  value={topicData.communityAverageAccuracy}
                                  icon={Users}
                                  colorClass="text-blue-500"
                                  tooltip="The average accuracy of all users"
                                />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-slate-50/80">
                              <ul className="space-y-3 overflow-x-auto">
                                {Object.entries(topicData.subtopics).map(
                                  ([subtopicName, subtopicData]) => (
                                    <li
                                      key={subtopicName}
                                      className="flex items-center justify-between p-3 bg-white rounded-md border"
                                    >
                                      <p className="font-medium text-sm text-slate-800">
                                        {subtopicName}
                                      </p>
                                      <TimeStat
                                        value={
                                          subtopicData.avgTimePerQuestionSec
                                        }
                                        tooltip="Average time per question in this subtopic (for this test)"
                                      />
                                      <div className="flex items-center gap-5">
                                        <PerformanceStat
                                          title="This Test"
                                          value={subtopicData.accuracy}
                                          icon={Target}
                                          colorClass="text-orange-500"
                                          tooltip="Your accuracy in this subtopic for this test"
                                        />
                                        <PerformanceStat
                                          title="Your Overall"
                                          value={
                                            subtopicData.userOverallPerformance
                                              ?.accuracyPercent ?? "N/A"
                                          }
                                          icon={Activity}
                                          colorClass="text-purple-500"
                                          tooltip="Your historical accuracy in this subtopic"
                                        />
                                        <PerformanceStat
                                          title="Community"
                                          value={
                                            subtopicData.communityAverageAccuracy
                                          }
                                          icon={Users}
                                          colorClass="text-blue-500"
                                          tooltip="The average accuracy of all users in this subtopic"
                                        />
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </div>
                  )
                )}
              </Accordion>
            </Card>

            <Card className="p-6 mb-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg mt-4">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  Weakness Test Success Metrics
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {weaknessAnalysis.success.improved}/
                    {weaknessAnalysis.success.totalTargeted}
                  </div>
                  <div className="text-sm text-green-700">Topics Improved</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {weaknessAnalysis.success.breakthroughs}
                  </div>
                  <div className="text-sm text-purple-700">
                    Major Breakthroughs
                  </div>
                  <div className="text-xs text-purple-600">
                    10%+ improvement
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {weaknessAnalysis.success.communityBeaters}
                  </div>
                  <div className="text-sm text-blue-700">
                    Beat Community Avg
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {weaknessAnalysis.success.avgImprovement >= 0 ? "+" : ""}
                    {weaknessAnalysis.success.avgImprovement.toFixed(1)}%
                  </div>
                  <div className="text-sm text-orange-700">Avg Improvement</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 mb-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  Weakness Targeting Effectiveness
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(weaknessAnalysis.targeting).map(
                  ([topic, data]: [string, any]) => (
                    <div
                      key={topic}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-slate-800">
                            {topic}
                          </h4>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              data.severity === "critical"
                                ? "bg-red-100 text-red-700"
                                : data.severity === "improving"
                                ? "bg-orange-100 text-orange-700"
                                : data.severity === "caution"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {data.severity === "critical" && (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                            {data.severity === "improving" && (
                              <TrendingUp className="w-3 h-3" />
                            )}
                            {data.severity === "caution" && (
                              <Clock className="w-3 h-3" />
                            )}
                            {data.severity === "good" && (
                              <Award className="w-3 h-3" />
                            )}
                            <span className="capitalize">{data.severity}</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Current: {data.currentAccuracy.toFixed(1)}% • vs
                          Community: {data.vsComm > 0 ? "+" : ""}
                          {data.vsComm.toFixed(1)}%
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 font-bold ${
                          data.improvement >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {data.improvement >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {data.improvement > 0 ? "+" : ""}
                        {data.improvement.toFixed(1)}%
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>

            {Object.keys(weaknessAnalysis.difficulty).length > 0 && (
              <Card className="p-6 mb-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Difficulty-Specific Performance
                  </h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(weaknessAnalysis.difficulty).map(
                    ([topic, difficulties]: [string, any]) => (
                      <div
                        key={topic}
                        className="border border-slate-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-slate-800 mb-3">
                          {topic}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(difficulties).map(
                            ([level, stats]: [string, any]) => (
                              <div
                                key={level}
                                className={`flex-1 min-w-[120px] p-3 rounded-lg text-center ${
                                  parseFloat(stats.accuracy) >= 80
                                    ? "bg-green-100 border border-green-200"
                                    : parseFloat(stats.accuracy) >= 60
                                    ? "bg-yellow-100 border border-yellow-200"
                                    : "bg-red-100 border border-red-200"
                                }`}
                              >
                                <div className="font-medium text-slate-700">
                                  {level}
                                </div>
                                <div className="text-2xl font-bold text-slate-800">
                                  {stats.accuracy}%
                                </div>
                                <div className="text-xs text-slate-600">
                                  {stats.correctAnswers}/{stats.totalQuestions}{" "}
                                  correct
                                </div>

                                {level === "Easy" &&
                                  parseFloat(stats.accuracy) < 80 && (
                                    <div className="text-red-600 text-xs mt-1 font-medium">
                                      Master fundamentals first
                                    </div>
                                  )}
                                {level === "Medium" &&
                                  parseFloat(stats.accuracy) >= 80 && (
                                    <div className="text-green-600 text-xs mt-1 font-medium">
                                      Ready for advanced topics
                                    </div>
                                  )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}

            {/* NEW: Smart Next Steps */}
            {weaknessAnalysis.recommendations.length > 0 && (
              <Card className="p-6 mb-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Recommended Next Steps
                  </h3>
                </div>
                <div className="space-y-3">
                  {weaknessAnalysis.recommendations
                    .slice(0, 3)
                    .map((rec, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${
                          rec.color === "red"
                            ? "bg-red-50 border-red-400"
                            : rec.color === "orange"
                            ? "bg-orange-50 border-orange-400"
                            : "bg-blue-50 border-blue-400"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  rec.priority === "CRITICAL"
                                    ? "bg-red-100 text-red-700"
                                    : rec.priority === "HIGH"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {rec.priority}
                              </span>
                              <h4 className="font-medium text-slate-800">
                                {rec.action}
                              </h4>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {rec.reason}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <ArrowRight className="w-3 h-3" />
                              <span>{rec.nextAction}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className={`ml-4 ${
                              rec.color === "red"
                                ? "bg-red-500 hover:bg-red-600"
                                : rec.color === "orange"
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          >
                            Practice Now
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            )}
            <AIAnalysisModal
              isOpen={showAIModal}
              onClose={() => setShowAIModal(false)}
              {...{ testSummary, subjectAnalysis, accuracyComparison }}
            />
          </>
        ) : (
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  Question Review
                </h3>
                <p className="text-sm text-slate-600">
                  {allQuestions.filter((q) => q.isCorrect).length} correct •{" "}
                  {
                    allQuestions.filter(
                      (q) => !q.isCorrect && q.userAnswer !== null
                    ).length
                  }{" "}
                  incorrect •{" "}
                  {allQuestions.filter((q) => q.userAnswer === null).length}{" "}
                  skipped
                </p>
              </div>
              <Button
                onClick={() => setShowAnswers(false)}
                variant="outline"
                className="flex items-center gap-2 bg-white/70 border-slate-300 hover:bg-white text-slate-700 px-4 py-2"
              >
                <EyeOff className="w-4 h-4" /> Hide Analysis
              </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {allQuestions.map((q: any, index: any): any => {
                const isExpanded = expandedQuestions[q.questionId];
                return (
                  <div
                    key={q.questionId}
                    className={`border-l-4 rounded-r-lg bg-white/50 backdrop-blur-sm transition-all duration-200 ${getStatusColor(
                      q
                    )}`}
                  >
                    {/* Compact Question Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-white/40 transition-colors"
                      onClick={() => toggleQuestionExpansion(q.questionId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(q)}
                              <span className="text-sm font-semibold text-slate-600">
                                Q{index + 1}
                              </span>
                            </div>

                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-300"
                            >
                              {q.topicName}
                            </Badge>

                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {formatTime(q.timeTakenSec)}
                            </div>
                          </div>

                          <h4 className="font-medium text-slate-800 text-sm leading-relaxed pr-4">
                            <RenderContent content={q.question} />
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-white/60"
                          >
                            {isExpanded ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t border-slate-200/50 bg-slate-50/30">
                        {/* Question Image */}
                        {q.imageUrl && (
                          <div className="pt-4 flex justify-center">
                            <img
                              src={q.imageUrl}
                              alt="Question visual aid"
                              className="max-w-60 md:max-w-72 h-auto rounded-lg border bg-white p-2 shadow-sm"
                            />
                          </div>
                        )}

                        {/* Options */}
                        {q.options && (
                          <div className="pt-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-3">
                              Answer Options:
                            </h5>
                            <div className="grid gap-2">
                              {Object.entries(q.options).map(([key, text]) => {
                                const isCorrect = key === q.correctOption;
                                const isUserSelection = key === q.userAnswer;
                                const isWrong = isUserSelection && !q.isCorrect;

                                let optionClass =
                                  "flex items-start p-3 rounded-md border text-sm transition-colors ";
                                if (isCorrect) {
                                  optionClass +=
                                    "border-emerald-300 bg-emerald-50 text-emerald-800";
                                } else if (isWrong) {
                                  optionClass +=
                                    "border-rose-300 bg-rose-50 text-rose-800";
                                } else {
                                  optionClass +=
                                    "border-slate-200 bg-white/60 text-slate-700";
                                }

                                return (
                                  <div key={key} className={optionClass}>
                                    <span className="font-semibold mr-3 text-xs bg-white/80 rounded px-2 py-1 min-w-6 text-center">
                                      {key}
                                    </span>
                                    <span className="flex-1">
                                      <RenderContent content={text} />
                                    </span>
                                    {isCorrect && (
                                      <CheckCircle className="w-4 h-4 ml-2 text-emerald-600 flex-shrink-0" />
                                    )}
                                    {isWrong && (
                                      <XCircle className="w-4 h-4 ml-2 text-rose-600 flex-shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/50">
                          <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Explanation
                          </h5>

                          {q.imagesolurl && (
                            <div className="mb-4 flex justify-center">
                              <img
                                src={q.imagesolurl}
                                alt="Solution visual aid"
                                className="max-w-64 md:max-w-64 h-auto rounded-lg border bg-white p-2 shadow-sm"
                              />
                            </div>
                          )}

                          <div className="text-sm text-blue-800 leading-relaxed">
                            {q.solution
                              ?.split("\n")
                              .map((line: any, index: any) => (
                                <p key={index} className="my-2">
                                  <Latex>{line}</Latex>
                                </p>
                              )) || "No detailed solution available."}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
