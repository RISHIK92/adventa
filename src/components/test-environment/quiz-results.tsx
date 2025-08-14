"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AIAnalysisModal } from "../ai-models/quiz-analysis-model";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  SkipForward,
  TrendingUp,
  Brain,
  Target,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanation: string;
}

interface QuizResultsProps {
  quizData: Question[];
  answers: Record<number, string | "skipped">;
  questionTimes: Record<number, number>;
  results: { correct: number; incorrect: number; skipped: number };
  totalTime: number;
  // Add previous accuracy data for comparison
  previousTopicAccuracy?: Record<string, number>;
}

export function QuizResults({
  quizData,
  answers,
  questionTimes,
  results,
  totalTime,
  previousTopicAccuracy = {},
}: QuizResultsProps) {
  const [expandedAnswers, setExpandedAnswers] = useState<
    Record<number, boolean>
  >({});
  const [showTopicAnalysis, setShowTopicAnalysis] = useState(true);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const toggleAnswerExpansion = (questionId: number) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleTopicExpansion = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const calculateTopicStats = () => {
    const topicStats: Record<
      string,
      {
        total: number;
        correct: number;
        incorrect: number;
        skipped: number;
        totalTime: number;
        avgTime: number;
        accuracy: number;
        questions: Array<{
          id: number;
          question: string;
          difficulty: string;
          userAnswer: string | "skipped";
          correctAnswer: string;
          isCorrect: boolean;
          timeSpent: number;
        }>;
      }
    > = {};

    quizData.forEach((question) => {
      const topic = question.topic;
      const userAnswer = answers[question.id];
      const timeSpent = questionTimes[question.id] || 0;
      const isCorrect =
        userAnswer === question.correctAnswer && userAnswer !== "skipped";

      if (!topicStats[topic]) {
        topicStats[topic] = {
          total: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0,
          totalTime: 0,
          avgTime: 0,
          accuracy: 0,
          questions: [],
        };
      }

      topicStats[topic].total++;
      topicStats[topic].totalTime += timeSpent;
      topicStats[topic].questions.push({
        id: question.id,
        question: question.question,
        difficulty: question.difficulty,
        userAnswer: userAnswer || "skipped",
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent,
      });

      if (userAnswer === "skipped" || !userAnswer) {
        topicStats[topic].skipped++;
      } else if (userAnswer === question.correctAnswer) {
        topicStats[topic].correct++;
      } else {
        topicStats[topic].incorrect++;
      }
    });

    Object.keys(topicStats).forEach((topic) => {
      const stats = topicStats[topic];
      stats.avgTime = stats.totalTime / stats.total;
      stats.accuracy =
        stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    });

    return topicStats;
  };

  const calculateProgressComparisons = () => {
    const topicStats = calculateTopicStats();

    const comparisons: Record<
      string,
      {
        currentAccuracy: number;
        previousAccuracy: number;
        accuracyDiff: number;
        progressStatus: "improved" | "declined" | "maintained" | "new";
        progressMessage: string;
      }
    > = {};

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const currentAccuracy = stats.accuracy;
      const previousAccuracy = previousTopicAccuracy[topic];

      let progressStatus: "improved" | "declined" | "maintained" | "new" =
        "new";
      let progressMessage = "First time attempting this topic";
      let accuracyDiff = 0;

      if (previousAccuracy !== undefined) {
        accuracyDiff = currentAccuracy - previousAccuracy;

        if (accuracyDiff > 5) {
          progressStatus = "improved";
          progressMessage = `Improved by ${Math.round(
            accuracyDiff
          )}% from last attempt`;
        } else if (accuracyDiff < -5) {
          progressStatus = "declined";
          progressMessage = `Declined by ${Math.abs(
            Math.round(accuracyDiff)
          )}% from last attempt`;
        } else {
          progressStatus = "maintained";
          progressMessage = `Maintained similar performance (±${Math.abs(
            Math.round(accuracyDiff)
          )}%)`;
        }
      }

      comparisons[topic] = {
        currentAccuracy,
        previousAccuracy: previousAccuracy || 0,
        accuracyDiff,
        progressStatus,
        progressMessage,
      };
    });

    return comparisons;
  };

  const generateAIAnalysis = () => {
    const topicStats = calculateTopicStats();
    const overallAccuracy = (results.correct / quizData.length) * 100;
    const avgTimePerQuestion = totalTime / quizData.length;

    const topicEntries = Object.entries(topicStats);
    const strongestTopic = topicEntries.reduce(
      (max, [topic, stats]) =>
        stats.accuracy > max.accuracy
          ? { topic, accuracy: stats.accuracy }
          : max,
      { topic: "", accuracy: 0 }
    );
    const weakestTopic = topicEntries.reduce(
      (min, [topic, stats]) =>
        stats.accuracy < min.accuracy
          ? { topic, accuracy: stats.accuracy }
          : min,
      { topic: "", accuracy: 100 }
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
      timeManagement:
        avgTimePerQuestion < 30
          ? "Excellent"
          : avgTimePerQuestion < 60
          ? "Good"
          : "Slow",
      recommendations: [
        overallAccuracy < 70
          ? "Focus on fundamental concepts and practice more problems"
          : "Continue practicing to maintain your strong performance",
        results.skipped > 2
          ? "Work on time management and attempt all questions"
          : "Good job attempting most questions",
        weakestTopic.accuracy < 50
          ? `Spend extra time studying ${weakestTopic.topic}`
          : `Continue strengthening your ${weakestTopic.topic} skills`,
      ],
    };
  };

  const score = results.correct;
  const percentage = Math.round((score / quizData.length) * 100);
  const topicStats = calculateTopicStats();
  const aiAnalysis = generateAIAnalysis();
  const progressComparisons = calculateProgressComparisons();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">∑</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600">Mathematics Quiz Completed</p>
            </div>
          </div>
        </div>

        {!showAnswers ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card className="p-6 relative">
                  {/* Check Answers Button - Top Right */}
                  <Button
                    onClick={() => setShowAnswers(true)}
                    variant="outline"
                    className="absolute top-4 right-4 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Check Answers
                  </Button>

                  <div className="text-center mb-6 mt-4">
                    <div className="text-6xl font-bold text-orange-500 mb-2">
                      {score}/{quizData.length}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      {percentage}% Score
                    </div>
                    <div className="text-gray-600">
                      Performance: {aiAnalysis.overallPerformance}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {results.correct}
                      </div>
                      <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">
                        {results.incorrect}
                      </div>
                      <div className="text-sm text-gray-600">Incorrect</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <SkipForward className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {results.skipped}
                      </div>
                      <div className="text-sm text-gray-600">Skipped</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowAIModal(true)}
                      className="mx-auto justify-center bg-[#ff6b35] hover:bg-[#ff6b25]"
                    >
                      <Brain className="w-4 h-4 mr-2 text-white" />
                      <p className="text-white">AI Analysis</p>
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">
                      Time Stats
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Time</span>
                      <span className="text-sm font-medium">
                        {Math.round(totalTime)}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Avg per Question
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round(totalTime / quizData.length)}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Time Management
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          aiAnalysis.timeManagement === "Excellent"
                            ? "text-green-600"
                            : aiAnalysis.timeManagement === "Good"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {aiAnalysis.timeManagement}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900">Strengths</span>
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

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-gray-900">
                      Focus Area
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

            {showTopicAnalysis && (
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Topic Performance Comparison
                  </h3>
                  <div className="text-sm text-gray-500">
                    Past vs Current Test Accuracy
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                          Subject/Topic
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          Questions
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          Past Accuracy
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          Current Test
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          Change
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          Avg Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(topicStats).map(([topic, stats]) => {
                        const progress = progressComparisons[topic];
                        const pastAccuracy = progress.previousAccuracy || 0;
                        const currentAccuracy = progress.currentAccuracy;
                        const change = progress.accuracyDiff;

                        return (
                          <tr key={topic} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                              {topic}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-600">
                              {stats.correct}/{stats.total}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {progress.progressStatus === "new"
                                    ? "N/A"
                                    : `${Math.round(pastAccuracy)}%`}
                                </span>
                                {progress.progressStatus !== "new" && (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span
                                  className={`text-lg font-bold ${
                                    currentAccuracy >= 80
                                      ? "text-green-600"
                                      : currentAccuracy >= 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {Math.round(currentAccuracy)}%
                                </span>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    currentAccuracy >= 80
                                      ? "bg-green-500"
                                      : currentAccuracy >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <span
                                className={`font-semibold ${
                                  progress.progressStatus === "improved"
                                    ? "text-green-600"
                                    : progress.progressStatus === "declined"
                                    ? "text-red-600"
                                    : progress.progressStatus === "maintained"
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {progress.progressStatus === "new"
                                  ? "New"
                                  : change > 0
                                  ? `+${Math.round(change)}%`
                                  : change < 0
                                  ? `${Math.round(change)}%`
                                  : "0%"}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <div className="flex items-center justify-center">
                                {progress.progressStatus === "improved" ? (
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="text-xs text-green-600 font-medium">
                                      Improved
                                    </span>
                                  </div>
                                ) : progress.progressStatus === "declined" ? (
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                                    <span className="text-xs text-red-600 font-medium">
                                      Declined
                                    </span>
                                  </div>
                                ) : progress.progressStatus === "maintained" ? (
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                                    <span className="text-xs text-blue-600 font-medium">
                                      Stable
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                                    <span className="text-xs text-gray-600 font-medium">
                                      First
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-600">
                              {Math.round(stats.avgTime)}s
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-900">
                        Improved Topics
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {
                        Object.values(progressComparisons).filter(
                          (p) => p.progressStatus === "improved"
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
                      <span className="font-medium text-red-900">
                        Declined Topics
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {
                        Object.values(progressComparisons).filter(
                          (p) => p.progressStatus === "declined"
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-blue-400 rounded-full"></div>
                      <span className="font-medium text-blue-900">
                        Stable Topics
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        Object.values(progressComparisons).filter(
                          (p) => p.progressStatus === "maintained"
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                      <span className="font-medium text-gray-900">
                        New Topics
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-600">
                      {
                        Object.values(progressComparisons).filter(
                          (p) => p.progressStatus === "new"
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <AIAnalysisModal
              isOpen={showAIModal}
              onClose={() => setShowAIModal(false)}
              quizData={quizData}
              answers={answers}
              questionTimes={questionTimes}
              results={results}
              totalTime={totalTime}
            />

            <div className="mt-6 flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Take Quiz Again
              </Button>
              <Button variant="outline">View Learning Resources</Button>
            </div>
          </>
        ) : (
          <>
            {/* Question Review Section - When showing answers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Question Review
                </h3>
                <Button
                  onClick={() => setShowAnswers(false)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <EyeOff className="w-4 h-4" />
                  Hide Answers
                </Button>
              </div>

              <div className="space-y-4">
                {quizData.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const isSkipped = userAnswer === "skipped" || !userAnswer;
                  const isExpanded = expandedAnswers[question.id];
                  const timeSpent = questionTimes[question.id] || 0;

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Question {index + 1}
                            </span>
                            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                              {question.topic}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(timeSpent)}s
                            </span>
                            {isSkipped ? (
                              <SkipForward className="w-4 h-4 text-yellow-500" />
                            ) : isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            {question.question}
                          </h4>

                          <div className="space-y-2 mb-3">
                            {question.options.map((option) => {
                              const isUserAnswer = userAnswer === option.value;
                              const isCorrectAnswer =
                                option.value === question.correctAnswer;

                              let bgColor = "bg-gray-50";
                              let textColor = "text-gray-900";
                              let borderColor = "border-gray-200";

                              if (isCorrectAnswer) {
                                bgColor = "bg-green-50";
                                textColor = "text-green-900";
                                borderColor = "border-green-200";
                              } else if (
                                isUserAnswer &&
                                !isCorrect &&
                                !isSkipped
                              ) {
                                bgColor = "bg-red-50";
                                textColor = "text-red-900";
                                borderColor = "border-red-200";
                              }

                              return (
                                <div
                                  key={option.label}
                                  className={`flex items-center gap-3 p-3 rounded-lg border ${bgColor} ${borderColor}`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                      isCorrectAnswer
                                        ? "bg-green-500 text-white"
                                        : isUserAnswer &&
                                          !isCorrect &&
                                          !isSkipped
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {option.label}
                                  </div>
                                  <span className={`${textColor} font-medium`}>
                                    {option.value}
                                  </span>
                                  {isUserAnswer && !isSkipped && (
                                    <span className="text-sm text-gray-500 ml-auto">
                                      Your answer
                                    </span>
                                  )}
                                  {isCorrectAnswer && (
                                    <span className="text-sm text-green-600 ml-auto">
                                      Correct answer
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {isSkipped && (
                              <div className="flex items-center gap-3 p-3 rounded-lg border bg-yellow-50 border-yellow-200">
                                <SkipForward className="w-5 h-5 text-yellow-500" />
                                <span className="text-yellow-800 font-medium">
                                  Question was skipped
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnswerExpansion(question.id)}
                          className="ml-4"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">
                            Explanation:
                          </h5>
                          <p className="text-blue-800">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="mt-6 flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Take Quiz Again
              </Button>
              <Button variant="outline">View Learning Resources</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
