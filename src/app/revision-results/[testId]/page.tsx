"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService } from "@/services/weaknessApi";
import {
  Loader2,
  ChevronLeft,
  Target,
  CheckCircle,
  XCircle,
  HelpCircle,
  BarChart2,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

// --- Type Definitions for API Data ---
// (These should match the structure of your backend response)
interface ResultSummaryData {
  testInstanceId: string;
  testName: string;
  score: number;
  totalMarks: number;
  correctQuestions: string; // "15/30"
  numCorrect: number;
  numIncorrect: number;
  numUnattempted: number;
  completedAt: string;
}

interface TopicPerformanceData {
  topicName: string;
  totalAttempted: number;
  totalCorrect: number;
  accuracyPercent: number;
}

interface QuestionData {
  id: number;
  questionNumber: number;
  question: string;
  options: { label: string; value: string }[];
  imageUrl?: string;
  solution: string;
  imagesolurl?: string;
  correctOption: string;
  userAnswer: string | null;
  status: "Correct" | "Incorrect" | "Unattempted";
}

interface RevisionResults {
  summary: ResultSummaryData;
  topicPerformance: TopicPerformanceData[];
  questions: QuestionData[];
}

// --- Main Page Component ---
export default function RevisionResultsPage() {
  const router = useRouter();
  const params = useParams();
  const testInstanceId = params.testId as string;

  const [results, setResults] = useState<RevisionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testInstanceId) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getRevisionTestResults(
          testInstanceId
        );
        if (response) {
          setResults(response);
        } else {
          throw new Error(response.error || "Failed to fetch results.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testInstanceId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-slate-700">Loading Your Results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">An Error Occurred</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">{error}</p>
            <Button onClick={() => router.back()} className="mt-6">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <p>No results found for this test.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Revision Test Results
              </h1>
              <p className="text-sm text-slate-600">
                {results.summary.testName}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <ResultSummary summary={results.summary} />
        <TopicPerformance topics={results.topicPerformance} />
        <QuestionReview questions={results.questions} />
      </main>
    </div>
  );
}

// --- Reusable Sub-Components ---

function ResultSummary({ summary }: { summary: ResultSummaryData }) {
  const accuracy =
    summary.numCorrect + summary.numIncorrect > 0
      ? (summary.numCorrect / (summary.numCorrect + summary.numIncorrect)) * 100
      : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Target className="h-6 w-6 text-blue-600" />
          Test Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-100 rounded-lg">
            <p className="text-sm font-medium text-slate-500">Score</p>
            <p className="text-2xl font-bold text-slate-900">
              {summary.score}{" "}
              <span className="text-base font-normal text-slate-600">
                / {summary.totalMarks}
              </span>
            </p>
          </div>
          <div className="p-4 bg-slate-100 rounded-lg">
            <p className="text-sm font-medium text-slate-500">Accuracy</p>
            <p className="text-2xl font-bold text-slate-900">
              {accuracy.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Correct
            </p>
            <p className="text-2xl font-bold text-green-700">
              {summary.numCorrect}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-600 flex items-center justify-center gap-1">
              <XCircle className="h-4 w-4" />
              Incorrect
            </p>
            <p className="text-2xl font-bold text-red-700">
              {summary.numIncorrect}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TopicPerformance({ topics }: { topics: TopicPerformanceData[] }) {
  if (topics.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BarChart2 className="h-6 w-6 text-blue-600" />
          Topic Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-slate-800">{topic.topicName}</p>
              <p className="text-sm font-medium text-slate-600">
                {topic.totalCorrect}/{topic.totalAttempted} Correct (
                {topic.accuracyPercent.toFixed(0)}%)
              </p>
            </div>
            <Progress value={topic.accuracyPercent} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuestionReview({ questions }: { questions: QuestionData[] }) {
  const getStatusBadge = (status: QuestionData["status"]) => {
    switch (status) {
      case "Correct":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-600">
            Correct
          </Badge>
        );
      case "Incorrect":
        return <Badge variant="destructive">Incorrect</Badge>;
      case "Unattempted":
        return <Badge variant="secondary">Unattempted</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ListChecks className="h-6 w-6 text-blue-600" />
          Detailed Question Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {questions.map((q, index) => (
            <AccordionItem value={`item-${index}`} key={q.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <span className="font-medium text-left">
                    Question {q.questionNumber}
                  </span>
                  {getStatusBadge(q.status)}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div className="p-4 bg-slate-100/50 rounded-lg border">
                  <div className="font-medium text-slate-800">
                    <Latex>{q.question}</Latex>
                  </div>
                  {q.imageUrl && (
                    <img
                      src={q.imageUrl}
                      alt="Question"
                      className="mt-4 rounded-lg max-w-sm mx-auto"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const isCorrect = opt.label === q.correctOption;
                    const isUserChoice = opt.label === q.userAnswer;

                    let variant = "default"; // Normal
                    if (isCorrect) variant = "correct";
                    if (isUserChoice && !isCorrect) variant = "incorrect";

                    return (
                      <div
                        key={opt.label}
                        className={`flex items-start gap-3 p-3 rounded-md border text-sm
                                ${
                                  variant === "correct" &&
                                  "bg-green-50 border-green-400 text-green-900"
                                }
                                ${
                                  variant === "incorrect" &&
                                  "bg-red-50 border-red-400 text-red-900"
                                }
                                ${
                                  variant === "default" &&
                                  "bg-white border-slate-200"
                                }`}
                      >
                        <div
                          className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs
                                ${
                                  variant === "correct" &&
                                  "bg-green-500 text-white"
                                }
                                ${
                                  variant === "incorrect" &&
                                  "bg-red-500 text-white"
                                }
                                ${
                                  variant === "default" &&
                                  "bg-slate-200 text-slate-700"
                                }`}
                        >
                          {opt.label}
                        </div>
                        <div className="font-medium">
                          <Latex>{opt.value}</Latex>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-4 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-lg">
                  <h4 className="font-bold text-blue-800">Solution</h4>
                  <div className="prose prose-sm max-w-none text-slate-800 mt-2">
                    <Latex>{q.solution}</Latex>
                  </div>
                  {q.imagesolurl && (
                    <img
                      src={q.imagesolurl}
                      alt="Solution"
                      className="mt-4 rounded-lg border bg-white p-1 max-w-sm"
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
