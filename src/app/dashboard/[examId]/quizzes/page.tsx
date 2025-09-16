"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Sparkles } from "lucide-react";
import { CustomQuizModal } from "@/components/quiz/custom-quiz-modal";
import { PastTestsList } from "@/components/quiz/past-tests-list";
import { apiService } from "@/services/quizApi";
import { examIdMap } from "@/lib/utils";

interface PastTest {
  id: string;
  testName: string;
  score: number;
  totalMarks: number;
  completedAt: string;
  totalQuestions: number;
}

const transformApiData = (apiData: PastTest[]) => {
  return apiData.map((test) => ({
    id: test.id,
    title: test.testName || "Custom Quiz",
    status: "Completed" as const,
    dateCompleted: new Date(test.completedAt),
    score: test.score,
    totalQuestions: test.totalQuestions,
    description: `A custom quiz with ${test.totalQuestions} questions.`,
    answeredQuestions: test.totalQuestions,
  }));
};

export default function Page() {
  const router = useRouter();
  const { examId } = useParams<{ examId: string }>();
  const [showCustomQuizModal, setShowCustomQuizModal] = useState(false);
  const [pastTests, setPastTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let Id = examIdMap[examId];

  useEffect(() => {
    const fetchPastTests = async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardData = await apiService.getCustomQuizDashboard(Id);

        const transformedData = transformApiData(dashboardData.pastTests);
        setPastTests(transformedData);
      } catch (err) {
        console.error("Error fetching past tests:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load past tests. Please try again."
        );
        setPastTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPastTests();
  }, [examId]);

  const handleViewResults = (testId: string) => {
    router.push(`/quiz-results/${testId}`);
  };

  const handleContinueQuiz = (testId: string) => {
    router.push(`/test/${testId}?type=custom-quiz`);
  };

  const handleStartQuiz = (testId: string) => {
    router.push(`/test/${testId}?type=custom-quiz`);
  };

  const handleQuizGenerated = (testInstanceId: string) => {
    setShowCustomQuizModal(false);
    router.push(`/test/${testInstanceId}?type=custom-quiz`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
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
                    Custom Quizzes
                  </h1>
                  <div className="hidden lg:inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-3 py-w border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700">
                      Practice Center
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm md:text-base mt-1">
                  Create personalized tests to focus on your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center pt-4">
          <Button
            onClick={() => setShowCustomQuizModal(true)}
            size="lg"
            className="bg-[#ff7b37] hover:bg-[#ff7b37]/90 text-white shadow-lg rounded-sm hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Custom Quiz
          </Button>
        </div>

        {/* Past Tests Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Your Past Tests
            </h2>
            <p className="text-muted-foreground mt-2">
              Review your completed quiz history below.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/80 border border-red-500/80 rounded-lg p-4 text-center">
              <p className="text-red-500 font-semibold">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          <PastTestsList
            attempts={pastTests}
            loading={loading}
            onViewResults={handleViewResults}
            onContinueQuiz={handleContinueQuiz}
            onStartQuiz={handleStartQuiz}
          />
        </div>

        {/* Modal remains unchanged */}
        <CustomQuizModal
          examId={Id}
          open={showCustomQuizModal}
          onOpenChange={setShowCustomQuizModal}
          onQuizGenerated={handleQuizGenerated}
        />
      </div>
    </div>
  );
}
