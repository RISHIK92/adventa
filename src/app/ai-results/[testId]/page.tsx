"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  X,
  RotateCcw,
  TrendingUp,
  Brain,
  Zap,
  ChevronLeftIcon,
  Clock,
  Target,
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiService, TestResultsData } from "@/services/weaknessApi";
import { toast } from "sonner";

export default function PracticeResultsPage() {
  const params = useParams();
  const router = useRouter();

  const testInstanceId = params.testId as string;

  const [results, setResults] = useState<TestResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Add this state for expanded solutions
  const [expandedSolutions, setExpandedSolutions] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (!testInstanceId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDrillResults(testInstanceId);
        setResults(data);
      } catch (error: any) {
        console.error("Failed to fetch results:", error);
        toast.error("Could not load results", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testInstanceId]);

  const accuracy = useMemo(() => {
    if (!results) return 0;
    const { numCorrect, numIncorrect } = results.summary;
    const attempted = numCorrect + numIncorrect;
    return attempted > 0 ? Math.round((numCorrect / attempted) * 100) : 0;
  }, [results]);

  const prevAccuracy = useMemo(
    () => results?.summary.previousOverallAccuracy ?? null,
    [results]
  );

  const delta = useMemo(() => {
    if (prevAccuracy === null) return null;
    return Math.round((accuracy - prevAccuracy) * 10) / 10;
  }, [accuracy, prevAccuracy]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  };

  const averageTimePerQuestion = useMemo(() => {
    if (!results) return 0;
    const { timeTakenSec, totalQuestions } = results.summary;
    return Math.round(timeTakenSec / totalQuestions);
  }, [results]);

  const scorePercentage = useMemo(() => {
    if (!results) return 0;
    const { score, totalMarks } = results.summary;
    return Math.round((score / totalMarks) * 100);
  }, [results]);

  const deltaBadge = () => {
    if (delta === null) return null;
    const up = delta > 0;
    const neutral = delta === 0;
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={
          "ml-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium " +
          (neutral
            ? "bg-[#f0f2f5] text-[#667085]"
            : up
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700")
        }
      >
        {neutral ? "±0%" : up ? `+${delta}%` : `${delta}%`}
        {up && <TrendingUp className="w-3 h-3 ml-1" />}
      </motion.span>
    );
  };

  const performanceLevel = useMemo(() => {
    if (accuracy >= 90)
      return { level: "Excellent", color: "text-green-600", icon: Zap };
    if (accuracy >= 70)
      return { level: "Good", color: "text-blue-600", icon: Check };
    if (accuracy >= 50)
      return { level: "Fair", color: "text-yellow-600", icon: TrendingUp };
    return { level: "Needs Improvement", color: "text-red-600", icon: X };
  }, [accuracy]);

  const LevelIcon = performanceLevel.icon;

  // Add this function to toggle solution visibility
  const toggleSolution = (questionId: number) => {
    setExpandedSolutions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-heading">Session Results</h1>
            {results && (
              <p className="text-[#667085] mt-2">
                {results.summary.testName} • Completed{" "}
                {new Date(results.summary.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/test-dashboard")}
            className="text-sm text-[#667085] hover:text-[#0a0a0a] transition-colors"
          >
            ← Back to Dashboard
          </motion.button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-[#e0e0e0] rounded-xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Accuracy */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#ff5c00]" />
                    <p className="text-sm text-[#667085] font-medium">
                      Accuracy
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-4xl font-bold font-heading tabular-nums text-[#ff5c00]">
                      {Math.round(accuracy)}%
                    </p>
                    {deltaBadge()}
                  </div>
                  {prevAccuracy !== null && (
                    <p className="text-sm text-[#667085] mt-2">
                      Previous: {Math.round(prevAccuracy)}%
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span
                      className={`${performanceLevel.color} text-sm font-medium`}
                    >
                      {performanceLevel.level}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-[#ff5c00]" />
                    <p className="text-sm text-[#667085] font-medium">Score</p>
                  </div>
                  <p className="text-4xl font-bold font-heading tabular-nums text-[#ff5c00]">
                    {results?.summary.score}/{results?.summary.totalMarks}
                  </p>
                  <p className="text-sm text-[#667085] mt-2">
                    {scorePercentage}% of total marks
                  </p>
                </div>

                {/* Time */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#ff5c00]" />
                    <p className="text-sm text-[#667085] font-medium">Time</p>
                  </div>
                  <p className="text-4xl font-bold font-heading tabular-nums text-[#ff5c00]">
                    {formatTime(results?.summary.timeTakenSec || 0)}
                  </p>
                  <p className="text-sm text-[#667085] mt-2">
                    Avg: {formatTime(averageTimePerQuestion)}/question
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-sm text-[#667085] mb-3">
                  <LevelIcon className="w-4 h-4" />
                  <p>
                    {accuracy >= 90
                      ? "Outstanding work! You're mastering this material."
                      : accuracy >= 70
                      ? "Great job! Keep up the consistent practice."
                      : accuracy >= 50
                      ? "Good effort! Focus on weaker areas to improve."
                      : "Let's review the fundamentals and keep practicing."}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {results?.summary.numCorrect}
                    </p>
                    <p className="text-xs text-[#667085]">Correct</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {results?.summary.numIncorrect}
                    </p>
                    <p className="text-xs text-[#667085]">Incorrect</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {results?.summary.numUnattempted}
                    </p>
                    <p className="text-xs text-[#667085]">Unattempted</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Topic Performance */}
            {results?.topicPerformance &&
              results.topicPerformance.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 }}
                  className="bg-card border border-[#e0e0e0] rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-[#ff5c00]" />
                    <h3 className="text-xl font-semibold">Topic Performance</h3>
                  </div>
                  <div className="space-y-4">
                    {results.topicPerformance.map((topic) => (
                      <div
                        key={topic.topicId}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{topic.topicName}</h4>
                          <span className="text-2xl font-bold text-[#ff5c00]">
                            {topic.accuracyPercent}%
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[#667085]">Questions</p>
                            <p className="font-semibold">
                              {topic.totalAttempted}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#667085]">Correct</p>
                            <p className="font-semibold text-green-600">
                              {topic.totalCorrect}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#667085]">Avg Time</p>
                            <p className="font-semibold">
                              {formatTime(
                                Math.round(topic.avgTimePerQuestionSec)
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Topic accuracy bar */}
                        <div className="mt-3">
                          <div className="h-2 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.accuracyPercent}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#ff5c00] to-orange-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            {/* Question-by-question review */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-[#e0e0e0] rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4">Detailed Review</h3>
              {!results ? (
                <p className="text-sm text-[#667085]">
                  No detailed review available for this session.
                </p>
              ) : (
                <div className="space-y-6">
                  {results.questions.map((q: any, i: any) => {
                    const isCorrect = q.status === "Correct";
                    const isUnattempted = q.status === "Unattempted";
                    const statusClass = isUnattempted
                      ? "bg-gray-100 text-gray-700"
                      : isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700";
                    const isSolutionExpanded = expandedSolutions.has(q.id);

                    return (
                      <div key={q.id} className="border rounded-lg p-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <p className="font-medium text-lg leading-relaxed">
                              {i + 1}. {q.question}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-[#667085] bg-gray-50 px-2 py-1 rounded">
                              {formatTime(q.timeTakenSec)}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
                            >
                              {q.status}
                            </span>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 mb-4">
                          {q.options.map((option: any) => {
                            const isUserAnswer = q.userAnswer === option.label;
                            const isCorrectAnswer =
                              q.correctOption === option.label;

                            let optionClass =
                              "border rounded-lg p-3 transition-all duration-200";

                            if (isCorrectAnswer && isUserAnswer) {
                              // User selected correct answer
                              optionClass +=
                                " bg-green-50 border-green-200 text-green-800";
                            } else if (isCorrectAnswer) {
                              // Correct answer (not selected by user)
                              optionClass +=
                                " bg-green-50 border-green-200 text-green-700";
                            } else if (isUserAnswer) {
                              // User's incorrect answer
                              optionClass +=
                                " bg-red-50 border-red-200 text-red-700";
                            } else {
                              // Regular option
                              optionClass +=
                                " bg-gray-50 border-gray-200 text-gray-700";
                            }

                            return (
                              <div key={option.label} className={optionClass}>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs font-medium">
                                      {option.label}
                                    </span>
                                  </div>
                                  <span className="flex-1">{option.value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Solution Toggle */}
                        {q.solution && (
                          <div className="border-t pt-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleSolution(q.id)}
                              className="flex items-center gap-2 text-[#ff5c00] hover:text-orange-600 transition-colors text-sm font-medium"
                            >
                              {isSolutionExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide Solution
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  View Solution
                                </>
                              )}
                            </motion.button>

                            <motion.div
                              initial={false}
                              animate={{
                                height: isSolutionExpanded ? "auto" : 0,
                                opacity: isSolutionExpanded ? 1 : 0,
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="text-black font-medium text-sm">
                                      Detailed Solution
                                    </span>
                                  </div>
                                  <div className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                                    {q.solution}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          <aside className="space-y-6">
            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#fef4ec] rounded-xl p-6 text-[#ff5c00] shadow-sm"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance Insights
              </h3>
              <div className="text-sm leading-relaxed space-y-2">
                <p>
                  {delta !== null && delta > 0
                    ? `🎉 You improved by ${delta}% from your previous attempt!`
                    : delta !== null && delta < 0
                    ? `📊 Your accuracy dipped by ${Math.abs(
                        delta
                      )}% - let's bounce back!`
                    : delta !== null
                    ? "📈 Consistent performance! Try to push higher next time."
                    : "🌟 This is your first attempt - great starting point!"}
                </p>
                <p>
                  {averageTimePerQuestion > 60
                    ? "⏰ Consider practicing speed alongside accuracy."
                    : "⚡ Great time management! You're efficient with your answers."}
                </p>
              </div>
            </motion.div>

            {/* Improvement Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-[#e0e0e0] rounded-xl p-6 shadow-sm"
            >
              <h3 className="font-semibold mb-3">Improvement Tips</h3>
              <div className="text-sm text-[#667085] leading-relaxed space-y-2">
                <p>
                  {accuracy < 50
                    ? "• Focus on understanding basic concepts before attempting more questions"
                    : accuracy < 70
                    ? "• Review incorrect answers and practice similar question types"
                    : "• Challenge yourself with advanced topics to reach mastery level"}
                </p>
                <p>
                  • Practice regularly to maintain and improve your performance
                </p>
                <p>• Time yourself to build speed alongside accuracy</p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card border border-[#e0e0e0] rounded-xl p-6 shadow-sm"
            >
              <h3 className="font-semibold mb-3">Next Milestone</h3>
              <p className="text-sm text-[#667085]">
                {accuracy < 50
                  ? "Target 50% accuracy on your next attempt by reviewing fundamentals."
                  : accuracy < 70
                  ? `Aim for 70% accuracy by focusing on your weak areas.`
                  : accuracy < 90
                  ? `You're close to excellence! Target 90% on your next try.`
                  : "Maintain your excellent performance and help others learn!"}
              </p>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
