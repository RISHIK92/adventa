"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, BrainCircuit } from "lucide-react";
import { RevisionTestModal } from "@/components/revision/revision-test-modal";
import { PastTestsList } from "@/components/quiz/past-tests-list";
import { apiService } from "@/services/weaknessApi";
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
    title: test.testName || "Revision Test",
    status: "Completed" as const,
    dateCompleted: new Date(test.completedAt),
    score: test.score,
    totalQuestions: test.totalQuestions,
    description: `A focused revision test with ${test.totalQuestions} questions.`,
    answeredQuestions: test.totalQuestions,
  }));
};

export default function Page() {
  const router = useRouter();
  const { examId } = useParams<{ examId: string }>();
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [pastTests, setPastTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const Id = examIdMap[examId];

  useEffect(() => {
    if (!Id) return;

    const fetchPastTests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the new API service function
        const dashboardData = await apiService.getRevisionTestDashboard(Id);

        const transformedData = transformApiData(dashboardData.pastTests);
        setPastTests(transformedData);
      } catch (err) {
        console.error("Error fetching past revision tests:", err);
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
  }, [Id]);

  const handleViewResults = (testId: string) => {
    // Note the different results route if you have one
    router.push(`/revision-results/${testId}`);
  };

  const handleStartQuiz = (testId: string) => {
    // Specify the test type in the URL
    router.push(`/revision-test/${testId}?type=revision-test`);
  };

  const handleTestGenerated = (testInstanceId: string) => {
    setShowRevisionModal(false);
    // Navigate to the test taking page
    router.push(`/revision-test/${testInstanceId}?type=revision-test`);
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
                    Revision Center
                  </h1>
                </div>
                <p className="text-slate-600 text-sm md:text-base mt-1">
                  Strengthen your weak areas with targeted practice tests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center pt-4">
          <Button
            onClick={() => setShowRevisionModal(true)}
            size="lg"
            className="bg-[#ff7b37] hover:bg-[#ff7b37]/90 text-white shadow-lg rounded-sm hover:shadow-xl transition-all duration-200"
          >
            <BrainCircuit className="w-5 h-5 mr-2" />
            Start New Revision Test
          </Button>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Your Revision History
            </h2>
            <p className="text-muted-foreground mt-2">
              Review your completed revision tests below.
            </p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <PastTestsList
            attempts={pastTests}
            loading={loading}
            onViewResults={handleViewResults}
            onStartQuiz={handleStartQuiz}
          />
        </div>

        <RevisionTestModal
          examId={Id}
          open={showRevisionModal}
          onOpenChange={setShowRevisionModal}
          onTestGenerated={handleTestGenerated}
        />
      </div>
    </div>
  );
}
