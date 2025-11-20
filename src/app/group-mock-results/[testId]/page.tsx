"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { apiService, GroupTestResultsData } from "@/services/weaknessApi";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";

import { TestResultsHeader } from "@/components/study-group-results/TestResultsHeader";
import { OverviewTab } from "@/components/study-group-results/OverviewTab";
import { PerformanceTab } from "@/components/study-group-results/PerformanceTab";
import { ComparisonTab } from "@/components/study-group-results/ComparisonTab";
import { QuestionsTab } from "@/components/study-group-results/QuestionsTab";
import { LeaderboardTab } from "@/components/study-group-results/LeaderboardTab";
import { AiInsightsTab } from "@/components/study-group-results/AiInsightsTab";
import test from "node:test";

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scheduledTestId = params.testId as string;

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<GroupTestResultsData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!scheduledTestId) {
      setError("Scheduled Test ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await apiService.getGroupMockTestResults(scheduledTestId);
        setResultsData(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load test results.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [scheduledTestId]);

  const { performanceBadges, lowestScore, memberMap } = useMemo(() => {
    if (!resultsData?.leaderboard || resultsData.leaderboard.length === 0) {
      return { performanceBadges: {}, lowestScore: 0, memberMap: new Map() };
    }
    const { leaderboard } = resultsData;
    const badges: { [key: string]: string } = {};

    badges.topScorer = leaderboard[0]?.name || "N/A";

    const fastest = [...leaderboard].sort(
      (a, b) => a.timeTaken - b.timeTaken
    )[0];
    badges.fastestSolver = fastest?.name || "N/A";

    const mostAccurate = [...leaderboard].sort(
      (a, b) => b.accuracy - a.accuracy
    )[0];
    badges.mostAccurate = mostAccurate?.name || "N/A";

    const lowest = Math.min(...leaderboard.map((m) => m.score));
    const map = new Map(leaderboard.map((m) => [m.id, m.name]));

    return { performanceBadges: badges, lowestScore: lowest, memberMap: map };
  }, [resultsData?.leaderboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2">Loading Results...</span>
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        <span>{error || "Could not load test data."}</span>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const {
    testResult,
    leaderboard,
    hierarchicalData,
    memberHierarchicalData,
    groupAverageData,
    questionReview,
    aiInsights,
  } = resultsData;

  const me = leaderboard.find((m) => m.id === currentUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      <TestResultsHeader testResult={testResult} />

      <div className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {console.log(testResult, hierarchicalData, groupAverageData)}
            <OverviewTab
              testResult={testResult}
              hierarchicalData={hierarchicalData}
              groupAverageData={groupAverageData}
            />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab
              hierarchicalData={hierarchicalData}
              groupAverageData={groupAverageData}
              testResult={testResult}
            />
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonTab
              leaderboard={leaderboard}
              currentUserId={currentUserId}
              hierarchicalData={hierarchicalData}
              memberHierarchicalData={memberHierarchicalData}
              groupAverageData={groupAverageData}
              memberMap={memberMap}
              me={me}
              testResult={testResult}
              lowestScore={lowestScore}
            />
          </TabsContent>

          <TabsContent value="questions">
            <QuestionsTab
              questionReview={questionReview}
              memberMap={memberMap}
            />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab
              leaderboard={leaderboard}
              currentUserId={currentUserId}
              performanceBadges={performanceBadges}
            />
          </TabsContent>

          <TabsContent value="insights">
            <AiInsightsTab aiInsights={aiInsights} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
