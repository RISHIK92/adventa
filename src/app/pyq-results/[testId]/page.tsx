"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Scorecard } from "@/components/pyq/scorecard";
import { PerformanceAnalysis } from "@/components/pyq/performance-analysis";
import { QuestionReview } from "@/components/pyq/question-review";
import { ActionPanel } from "@/components/pyq/action-panel";
import { Loader2, AlertCircle } from "lucide-react";
import {
  apiService,
  CombinedResultsData,
  PyqPercentileData,
} from "@/services/weaknessApi";
import { TopicAnalysis } from "@/components/pyq/topic-analysis";
import { DifficultyAnalysis } from "@/components/pyq/difficulty-analysis";

// This will be our combined state for all fetched data
interface PyqPageResultsData {
  mainResults: CombinedResultsData;
  percentileData: PyqPercentileData;
}

interface DifficultyTopicData {
  topicName: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Elite";
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface SubjectDataForAnalysis {
  subject: string;
  overallAccuracy: number;
  communityAccuracy: number;
  totalQuestions: number;
  avgTime: number;
  status: "Cutoff Cleared" | "Close to Cutoff" | "Needs Work";
  topics: {
    name: string;
    accuracy: number;
    communityAccuracy: number;
    questions: number;
    avgTime: number;
    status: "Cutoff Cleared" | "Close to Cutoff" | "Needs Work";
    subtopics: {
      name: string;
      accuracy: number;
      communityAccuracy: number;
      questions: number;
      difficulty: "Easy" | "Medium" | "Hard" | "Elite";
      avgTime: number;
    }[];
    difficultyBreakdown: {
      easy: { accuracy: number; communityAccuracy: number; questions: number };
      medium: {
        accuracy: number;
        communityAccuracy: number;
        questions: number;
      };
      hard: { accuracy: number; communityAccuracy: number; questions: number };
    };
  }[];
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const params = useParams();
  const testInstanceId = params.testId as string;

  const [resultsData, setResultsData] = useState<PyqPageResultsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const topicAnalysisData = useMemo((): SubjectDataForAnalysis[] => {
    if (!resultsData) return [];

    const getStatus = (
      accuracy: number
    ): "Cutoff Cleared" | "Close to Cutoff" | "Needs Work" => {
      if (accuracy >= 80) return "Cutoff Cleared";
      if (accuracy >= 60) return "Close to Cutoff";
      return "Needs Work";
    };

    const apiSubjectAnalysis = resultsData.mainResults.subjectAnalysis;

    return Object.entries(apiSubjectAnalysis).map(
      ([subjectName, subjectData]) => {
        const topics = Object.entries(subjectData.topics).map(
          ([topicName, topicData]) => {
            // Transform subtopics
            const subtopics = Object.entries(topicData.subtopics).map(
              ([subtopicName, subtopicData]) => ({
                name: subtopicName,
                accuracy: parseFloat(subtopicData.accuracy),
                communityAccuracy: parseFloat(
                  subtopicData.communityAverageAccuracy
                ),
                questions: subtopicData.questions.length,
                avgTime: parseFloat(subtopicData.avgTimePerQuestionSec),
                // Infer difficulty from the first question as the API provides it per-question
                difficulty:
                  ((subtopicData.questions[0]?.humanDifficultyLevel
                    ?.charAt(0)
                    .toUpperCase() +
                    subtopicData.questions[0]?.humanDifficultyLevel
                      ?.slice(1)
                      .toLowerCase()) as "Easy" | "Medium" | "Hard") ||
                  "Medium",
              })
            );

            // Transform difficulty breakdown, ensuring keys are lowercase
            const difficultyBreakdown = {
              easy: topicData.difficultyBreakdown.Easy
                ? {
                    accuracy: parseFloat(
                      topicData.difficultyBreakdown.Easy.accuracy
                    ),
                    communityAccuracy: 0,
                    questions:
                      topicData.difficultyBreakdown.Easy.totalQuestions,
                  }
                : { accuracy: 0, communityAccuracy: 0, questions: 0 },
              medium: topicData.difficultyBreakdown.Medium
                ? {
                    accuracy: parseFloat(
                      topicData.difficultyBreakdown.Medium.accuracy
                    ),
                    communityAccuracy: 0,
                    questions:
                      topicData.difficultyBreakdown.Medium.totalQuestions,
                  }
                : { accuracy: 0, communityAccuracy: 0, questions: 0 },
              hard: topicData.difficultyBreakdown.Hard
                ? {
                    accuracy: parseFloat(
                      topicData.difficultyBreakdown.Hard.accuracy
                    ),
                    communityAccuracy: 0,
                    questions:
                      topicData.difficultyBreakdown.Hard.totalQuestions,
                  }
                : { accuracy: 0, communityAccuracy: 0, questions: 0 },
            };

            const topicAccuracy = parseFloat(topicData.accuracy);

            return {
              name: topicName,
              accuracy: topicAccuracy,
              communityAccuracy: parseFloat(topicData.communityAverageAccuracy),
              questions: topicData.totalQuestions,
              avgTime: parseFloat(topicData.avgTimePerQuestionSec),
              status: getStatus(topicAccuracy),
              subtopics,
              difficultyBreakdown,
            };
          }
        );

        // Calculate weighted community accuracy for the subject
        const totalTopicQuestions = topics.reduce(
          (acc, t) => acc + t.questions,
          0
        );
        const weightedCommunityScore = topics.reduce(
          (acc, t) => acc + t.communityAccuracy * t.questions,
          0
        );
        const subjectCommunityAccuracy =
          totalTopicQuestions > 0
            ? weightedCommunityScore / totalTopicQuestions
            : 0;
        const subjectAccuracy = parseFloat(subjectData.accuracy);

        return {
          subject: subjectName,
          overallAccuracy: subjectAccuracy,
          communityAccuracy: parseFloat(subjectCommunityAccuracy.toFixed(2)),
          totalQuestions: subjectData.totalQuestions,
          avgTime: parseFloat(subjectData.avgTimePerQuestionSec),
          status: getStatus(subjectAccuracy),
          topics,
        };
      }
    );
  }, [resultsData]);

  const difficultyAnalysisData = useMemo((): DifficultyTopicData[] => {
    if (!resultsData) return [];
    const difficultyData: DifficultyTopicData[] = [];

    for (const subjectName in resultsData.mainResults.subjectAnalysis) {
      const subject = resultsData.mainResults.subjectAnalysis[subjectName];
      for (const topicName in subject.topics) {
        const topic = subject.topics[topicName];
        if (topic.difficultyBreakdown) {
          for (const difficultyKey in topic.difficultyBreakdown) {
            if (
              ["Easy", "Medium", "Hard", "Elite"].includes(difficultyKey) &&
              topic.difficultyBreakdown[difficultyKey].totalQuestions > 0
            ) {
              const breakdown = topic.difficultyBreakdown[difficultyKey];
              const accuracy = parseFloat(breakdown.accuracy);
              const totalQuestions = breakdown.totalQuestions;
              difficultyData.push({
                topicName: topicName,
                difficulty: difficultyKey as
                  | "Easy"
                  | "Medium"
                  | "Hard"
                  | "Elite",
                accuracy: accuracy,
                totalQuestions: totalQuestions,
                correctAnswers: Math.round((accuracy / 100) * totalQuestions),
              });
            }
          }
        }
      }
    }
    return difficultyData;
  }, [resultsData]);

  useEffect(() => {
    if (!testInstanceId) {
      setError("Test ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main results and percentile data in parallel for speed
        const [mainResults, percentileData] = await Promise.all([
          apiService.getTestResults(testInstanceId),
          apiService.getPyqPercentile(testInstanceId),
        ]);

        setResultsData({ mainResults, percentileData });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load test results."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [testInstanceId]);

  // Use useMemo to flatten the questions array only when resultsData changes
  const allQuestions = useMemo(() => {
    if (!resultsData) return [];
    const questions: any = [];
    const optionLetterToIndex: { [key: string]: number } = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    };
    for (const subject in resultsData.mainResults.subjectAnalysis) {
      for (const topicName in resultsData.mainResults.subjectAnalysis[subject]
        .topics) {
        const topic =
          resultsData.mainResults.subjectAnalysis[subject].topics[topicName];
        for (const subtopic in topic.subtopics) {
          topic.subtopics[subtopic].questions.forEach((q) => {
            const optionsArray = q.options
              ? Object.keys(q.options)
                  .sort()
                  .map((key) => q.options[key])
              : [];

            // 2. Map the API data to the component's expected prop shape
            questions.push({
              id: q.questionId.toString(),
              question: q.question,
              options: optionsArray,
              userAnswer:
                q.userAnswer !== null
                  ? optionLetterToIndex[q.userAnswer]
                  : undefined,
              correctAnswer: optionLetterToIndex[q.correctOption],
              explanation: q.solution,
              subject: subject,
              type: "MCQ",
              isCorrect: q.isCorrect,
              imageUrl: q.imageUrl,
              imagesolurl: q.imagesolurl,
            });
          });
        }
      }
    }
    return questions.sort((a: any, b: any) => a.questionId - b.questionId);
  }, [resultsData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            Analyzing Your Performance...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700">
            Error Loading Results
          </h2>
          <p className="text-gray-600">
            {error || "No data was found for this test."}
          </p>
        </div>
      </div>
    );
  }

  const { testSummary, subjectAnalysis } = resultsData.mainResults;
  const { percentile } = resultsData.percentileData;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/60 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-white/20">
            {[
              { id: "overview", label: "Overview" },
              { id: "analysis", label: "Analysis" },
              { id: "questions", label: "Questions" },
              // { id: "actions", label: "Next Steps" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2">
                <Scorecard
                  score={testSummary.score}
                  totalScore={testSummary.totalMarks}
                  percentile={percentile}
                  timeTaken={formatTime(testSummary.timeTakenSec)}
                  examTitle={testSummary.testName || "PYQ Test"}
                  totalCorrect={testSummary.totalCorrect}
                  totalIncorrect={testSummary.totalIncorrect}
                  totalUnattempted={testSummary.totalUnattempted}
                />
              </div>
              <div className="xl:col-span-3">
                <PerformanceAnalysis subjectAnalysis={subjectAnalysis} />
              </div>
            </div>
          )}

          {activeTab === "analysis" && (
            <>
              <TopicAnalysis performanceData={topicAnalysisData} />
              <DifficultyAnalysis data={difficultyAnalysisData} />
            </>
          )}

          {activeTab === "questions" && (
            <QuestionReview questions={allQuestions} />
          )}

          {/* {activeTab === "actions" && <ActionPanel />} */}
        </div>
      </div>
    </div>
  );
}
