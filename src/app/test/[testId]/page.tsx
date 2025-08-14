"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Quiz } from "@/components/test-environment/quiz";
import { Loader2 } from "lucide-react";
import { apiService } from "@/app/dashboard/[examId]/weakness-test/page";

interface TestData {
  testInstanceId: string;
  testName: string;
  timeLimit: number;
  questions: {
    id: number;
    questionNumber: number;
    question: string;
    options: string[];
    imageUrl?: string;
  }[];
}

export default function TestPage() {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const testId = params.testId as string;

  useEffect(() => {
    if (!testId) {
      setError("Test ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchTest = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getTestForTaking(testId);
        setTestData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Preparing your test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Could not load the test.</p>
      </div>
    );
  }

  return <Quiz quizData={testData} />;
}
