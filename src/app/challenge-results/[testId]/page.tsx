"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { apiService, ChallengeResultsData } from "@/services/weaknessApi";
import MistakeBankAndRevision from "@/components/study-group/MistakeBankAndRevision";
import PostTestResults from "@/components/study-group/PostTestResults";

export default function ChallengeResults() {
  const params = useParams();
  const testId = params.testId as string;

  const [results, setResults] = useState<ChallengeResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) {
      setError("Test ID is missing.");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await apiService.getChallengeResults(testId);
        setResults(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load challenge results.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="mt-2">{error || "Could not load results data."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PostTestResults
        className="bg-white rounded-lg border md:py-12 md:px-20 py-6 px-4"
        leaderboard={results.leaderboard}
        predictionAnalysis={results.predictionAnalysis}
        questionReview={results.questionReview}
      />
      <MistakeBankAndRevision
        questionReview={results.questionReview}
        members={results.leaderboard}
      />
    </div>
  );
}
