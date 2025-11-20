"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { QuizResults } from "@/components/test-environment/weakness-results";
import { Loader2 } from "lucide-react";
import { apiService, CombinedResultsData } from "@/services/weaknessApi";

export default function ResultsPage() {
  const params = useParams();
  const testId = params.testId as string;
  const [resultsData, setResultsData] = useState<CombinedResultsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) {
      setError("Test ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const loadQuizResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getCombinedTestResults(testId);
        setResultsData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load results."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuizResults();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            Calculating Your Results...
          </h2>
          <p className="text-gray-600">
            Please wait while we analyze your performance.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Results
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No results data available for this test.</p>
      </div>
    );
  }

  return <QuizResults {...resultsData} />;
}
