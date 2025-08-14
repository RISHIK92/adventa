"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Download,
  Share2,
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

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: Question[];
  answers: Record<number, string | "skipped">;
  questionTimes: Record<number, number>;
  results: { correct: number; incorrect: number; skipped: number };
  totalTime: number;
}

export function AIAnalysisModal({
  isOpen,
  onClose,
  quizData,
  answers,
  questionTimes,
  results,
  totalTime,
}: AIAnalysisModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisGenerated, setAnalysisGenerated] = useState(false);

  const generateDetailedAnalysis = async () => {
    setIsGenerating(true);
    // Simulate AI analysis generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setAnalysisGenerated(true);
  };

  const calculateTopicStats = () => {
    const topicStats: Record<
      string,
      { correct: number; total: number; avgTime: number; totalTime: number }
    > = {};

    quizData.forEach((question) => {
      const topic = question.topic;
      const userAnswer = answers[question.id];
      const timeSpent = questionTimes[question.id] || 0;

      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0, avgTime: 0, totalTime: 0 };
      }

      topicStats[topic].total++;
      topicStats[topic].totalTime += timeSpent;

      if (userAnswer === question.correctAnswer && userAnswer !== "skipped") {
        topicStats[topic].correct++;
      }
    });

    Object.keys(topicStats).forEach((topic) => {
      const stats = topicStats[topic];
      stats.avgTime = stats.totalTime / stats.total;
    });

    return topicStats;
  };

  const generateComprehensiveReport = () => {
    const topicStats = calculateTopicStats();
    const overallAccuracy = (results.correct / quizData.length) * 100;
    const avgTimePerQuestion = totalTime / quizData.length;

    // Learning style analysis
    const fastSolver = avgTimePerQuestion < 35;
    const methodicalSolver = avgTimePerQuestion > 60;
    const balancedSolver = !fastSolver && !methodicalSolver;

    // Difficulty pattern analysis
    const easyQuestions = quizData.filter((q) => q.difficulty === "easy");
    const mediumQuestions = quizData.filter((q) => q.difficulty === "medium");
    const hardQuestions = quizData.filter((q) => q.difficulty === "hard");

    const easyAccuracy = easyQuestions.length
      ? (easyQuestions.filter((q) => answers[q.id] === q.correctAnswer).length /
          easyQuestions.length) *
        100
      : 0;
    const mediumAccuracy = mediumQuestions.length
      ? (mediumQuestions.filter((q) => answers[q.id] === q.correctAnswer)
          .length /
          mediumQuestions.length) *
        100
      : 0;
    const hardAccuracy = hardQuestions.length
      ? (hardQuestions.filter((q) => answers[q.id] === q.correctAnswer).length /
          hardQuestions.length) *
        100
      : 0;

    return {
      overallAccuracy,
      avgTimePerQuestion,
      topicStats,
      learningStyle: fastSolver
        ? "Quick Thinker"
        : methodicalSolver
        ? "Methodical Analyzer"
        : "Balanced Learner",
      learningStyleDescription: fastSolver
        ? "You process information quickly and make decisions rapidly. Consider double-checking your work to avoid careless errors."
        : methodicalSolver
        ? "You take time to think through problems carefully. Work on building confidence to solve problems more efficiently."
        : "You have a balanced approach to problem-solving, taking appropriate time for each question.",
      difficultyPattern: {
        easy: easyAccuracy,
        medium: mediumAccuracy,
        hard: hardAccuracy,
      },
      strengths: Object.entries(topicStats)
        .filter(([, stats]) => (stats.correct / stats.total) * 100 >= 75)
        .map(([topic]) => topic),
      weaknesses: Object.entries(topicStats)
        .filter(([, stats]) => (stats.correct / stats.total) * 100 < 50)
        .map(([topic]) => topic),
      recommendations: [
        overallAccuracy >= 80
          ? "Excellent performance! Continue practicing to maintain your strong foundation."
          : overallAccuracy >= 60
          ? "Good understanding of concepts. Focus on areas where you struggled to reach the next level."
          : "Consider reviewing fundamental concepts and practicing more problems in your weak areas.",
        results.skipped > 2
          ? "Work on time management strategies to attempt all questions within the time limit."
          : "Good job attempting most questions. Continue building confidence in your abilities.",
        fastSolver && overallAccuracy < 70
          ? "Slow down and double-check your work to avoid careless mistakes."
          : methodicalSolver && overallAccuracy >= 70
          ? "Your careful approach is paying off. Try to build speed while maintaining accuracy."
          : "Continue with your current problem-solving approach.",
      ],
    };
  };

  const report = analysisGenerated ? generateComprehensiveReport() : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-orange-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            AI Performance Analysis
          </DialogTitle>
          <DialogDescription>
            Get detailed insights into your learning patterns, strengths, and
            personalized recommendations for improvement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!analysisGenerated && !isGenerating && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Analyze Your Performance
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Our AI will analyze your quiz performance, learning patterns,
                and provide personalized recommendations for improvement.
              </p>
              <Button
                onClick={generateDetailedAnalysis}
                className="bg-gradient-to-r from-[#ff6b35] to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Analysis
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Your Performance...
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI is processing your quiz data and generating personalized
                insights.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Analyzing response patterns...</span>
                  <span>33%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-[#ff6b35] to-blue-600 h-2 rounded-full w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {analysisGenerated && report && (
            <div className="space-y-6">
              {/* Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        {Math.round(report.overallAccuracy)}%
                      </div>
                      <div className="text-sm text-green-600">
                        Overall Accuracy
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-700">
                        {Math.round(report.avgTimePerQuestion)}s
                      </div>
                      <div className="text-sm text-blue-600">
                        Avg per Question
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-[#ff6b35]" />
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {report.learningStyle}
                      </div>
                      <div className="text-sm text-[#ff6b35]">
                        Learning Style
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Learning Style Analysis */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Learning Style Analysis
                  </h3>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    You are a {report.learningStyle}
                  </h4>
                  <p className="text-yellow-700">
                    {report.learningStyleDescription}
                  </p>
                </div>
              </Card>

              {/* Difficulty Pattern Analysis */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Difficulty Pattern Analysis
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">
                        Easy Questions
                      </span>
                      <span className="text-lg font-bold text-green-700">
                        {Math.round(report.difficultyPattern.easy)}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${report.difficultyPattern.easy}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">
                        Medium Questions
                      </span>
                      <span className="text-lg font-bold text-yellow-700">
                        {Math.round(report.difficultyPattern.medium)}%
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${report.difficultyPattern.medium}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-800">
                        Hard Questions
                      </span>
                      <span className="text-lg font-bold text-red-700">
                        {Math.round(report.difficultyPattern.hard)}%
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${report.difficultyPattern.hard}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Your Strengths
                    </h3>
                  </div>
                  {report.strengths.length > 0 ? (
                    <div className="space-y-3">
                      {report.strengths.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-green-800 font-medium">
                            {topic}
                          </span>
                          <span className="text-sm text-green-600 ml-auto">
                            {Math.round(
                              (report.topicStats[topic].correct /
                                report.topicStats[topic].total) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Keep practicing to identify your strong areas!
                    </p>
                  )}
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Areas for Improvement
                    </h3>
                  </div>
                  {report.weaknesses.length > 0 ? (
                    <div className="space-y-3">
                      {report.weaknesses.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                        >
                          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span className="text-orange-800 font-medium">
                            {topic}
                          </span>
                          <span className="text-sm text-orange-600 ml-auto">
                            {Math.round(
                              (report.topicStats[topic].correct /
                                report.topicStats[topic].total) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Great job! No significant weak areas identified.
                    </p>
                  )}
                </Card>
              </div>

              {/* Personalized Recommendations */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Personalized Recommendations
                  </h3>
                </div>
                <div className="space-y-4">
                  {report.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                    >
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-indigo-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
                <Button className="bg-gradient-to-r from-[#ff6b35] to-orange-600 hover:from-orange-700 hover:to-orange-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Study Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
