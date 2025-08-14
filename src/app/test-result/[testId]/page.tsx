"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { QuizResults } from "@/components/test-environment/quiz-results";
import { Loader2 } from "lucide-react";

// This is the data structure our real backend endpoint will return.
const mockApiResult = {
  quizData: [
    {
      id: 1,
      question: "What is the derivative of x²?",
      topic: "Calculus",
      difficulty: "easy",
      options: [
        { label: "A", value: "2x" },
        { label: "B", value: "x²" },
      ],
      correctAnswer: "2x",
      explanation: "Use the power rule.",
    },
    {
      id: 2,
      question: "Solve for x: 2x + 5 = 13",
      topic: "Algebra",
      difficulty: "easy",
      options: [
        { label: "A", value: "4" },
        { label: "B", value: "3" },
      ],
      correctAnswer: "4",
      explanation: "2x = 8, so x = 4.",
    },
    {
      id: 3,
      question: "What is the area of a circle with radius 5?",
      topic: "Geometry",
      difficulty: "medium",
      options: [
        { label: "A", value: "25π" },
        { label: "B", value: "10π" },
      ],
      correctAnswer: "25π",
      explanation: "Area = πr²",
    },
  ],
  answers: {
    1: "2x", // Correct
    2: "3", // Incorrect
    3: "skipped", // Skipped
  },
  questionTimes: {
    1: 25,
    2: 45,
    3: 0,
  },
  results: {
    correct: 1,
    incorrect: 1,
    skipped: 1,
  },
  totalTime: 70,
  previousTopicAccuracy: {
    Calculus: 75,
    Algebra: 60,
    Geometry: 80,
  },
};

// Mock service to simulate the fetch
const apiService = {
  async getTestResults(testId: string): Promise<any> {
    console.log("MOCK API: Fetching results for testId:", testId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (testId === "mock-test-123") {
          resolve(mockApiResult);
        } else {
          reject(new Error(`No quiz data found for test ID: ${testId}`));
        }
      }, 1000);
    });
  },
};

interface ResultsProps {
  params: {
    testId: string;
  };
}

export default function ResultsPage({ params }: ResultsProps) {
  const { testId } = params;
  const [resultsData, setResultsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) {
      setError("Test ID is missing.");
      setLoading(false);
      return;
    }

    const loadQuizResults = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call the (mock) API service to get the results
        const data = await apiService.getTestResults(testId);
        setResultsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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

  return (
    // The QuizResults component is now fed its props from the fetched data
    // using the spread operator for cleanliness.
    <QuizResults {...resultsData} />
  );
}
