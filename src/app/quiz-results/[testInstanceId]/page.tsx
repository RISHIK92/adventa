"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import QuizResultsPage from "@/components/quiz/quiz-results";
import { apiService, QuizResultsData } from "@/services/weaknessApi";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultsPage() {
  const params = useParams();
  const testInstanceId = params.testInstanceId as string;

  const [resultsData, setResultsData] = useState<QuizResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testInstanceId) {
      setIsLoading(false);
      setError("Test ID is missing from the URL.");
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await apiService.getQuizResults(testInstanceId);

        const summary = res.summary;
        const topicPerformance = res.topicPerformance;
        const questions = res.questions;

        const transformed: QuizResultsData = {
          quizName: summary.testName,
          completedAt: summary.completedAt,
          totalQuestions: summary.totalQuestions,
          correctAnswers: summary.numCorrect,
          incorrectAnswers: summary.numIncorrect,
          unattemptedQuestions: summary.numUnattempted,
          timeTaken: `${summary.timeTakenSec} sec`,
          topics: topicPerformance.map((t: any) => ({
            name: t.topicName,
            questionsAttempted: t.totalAttempted,
            correctAnswers: t.totalCorrect,
            accuracy: t.accuracyPercent,
            avgTimePerQuestionSec: t.avgTimePerQuestionSec,
          })),
          questions: questions.map((q: any) => ({
            id: q.id,
            questionNumber: q.questionNumber,
            questionText: q.question,
            topic: q.topicName ?? "", // fallback if missing
            status: q.status.toLowerCase() as
              | "correct"
              | "incorrect"
              | "unattempted",
            selectedAnswer: q.userAnswer,
            correctAnswer: q.correctOption,
            options: q.options.map((o: any) => o.value),
            explanation: q.solution,
            imageUrl: q.imageUrl ?? undefined,
            imagesolurl: q.imagesolurl ?? undefined,
            timeTakenSec: q.timeTakenSec,
          })),
        };

        setResultsData(transformed);
      } catch (err: any) {
        console.error("Error fetching results:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [testInstanceId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        <p className="mt-4 text-lg text-gray-700">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-red-50 border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-red-800">
              Could not load results
            </h2>
            <p className="mt-2 text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>No results data found.</p>
      </div>
    );
  }

  return <QuizResultsPage data={resultsData} />;
}
