"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  Loader2,
  BookCheck,
  ClipboardCheck,
  Clock,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  BrainCircuit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  getQuizResults,
  getTestResults,
  type QuizResult,
  type TestResult,
} from "@/app/actions";
import { Header } from "@/components/header";
import { formatDistanceToNow } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzePerformance } from "@/ai/flows/analyze-performance-flow";
import { AnalyzePerformanceOutput } from "@/ai/flows/analyze-performance-types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import clsx from "clsx";
import { TricolorSpinner } from "@/components/ui/tricolor-spinner";

type EnrichedQuizResult = Omit<QuizResult, "timestamp"> & {
  id: string;
  timestamp: string;
};
type EnrichedTestResult = Omit<TestResult, "timestamp"> & {
  id: string;
  timestamp: string;
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [quizResults, setQuizResults] = React.useState<EnrichedQuizResult[]>(
    []
  );
  const [testResults, setTestResults] = React.useState<EnrichedTestResult[]>(
    []
  );
  const [loadingResults, setLoadingResults] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysis, setAnalysis] =
    React.useState<AnalyzePerformanceOutput | null>(null);
  const [expandedTestId, setExpandedTestId] = React.useState<string | null>(
    null
  );
  const [modalTestId, setModalTestId] = React.useState<string | null>(null);
  const [modalTestResult, setModalTestResult] =
    React.useState<EnrichedTestResult | null>(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (user) {
      const fetchResults = async () => {
        setLoadingResults(true);
        const [quizRes, testRes] = await Promise.all([
          getQuizResults(user.uid),
          getTestResults(user.uid),
        ]);
        if (quizRes.success && quizRes.data) {
          setQuizResults(quizRes.data as EnrichedQuizResult[]);
        }
        if (testRes.success && testRes.data) {
          setTestResults(testRes.data as EnrichedTestResult[]);
        }
        setLoadingResults(false);
      };
      fetchResults();
    }
  }, [user]);

  const handleAnalyzePerformance = async () => {
    if (testResults.length === 0) {
      toast({
        variant: "destructive",
        title: "Not enough data",
        description:
          "You need to complete at least one mock test to get a performance analysis.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      // We only need to send a subset of data to the AI
      const analysisInput = testResults.map((res) => ({
        difficulty: res.difficulty,
        score: res.score,
        totalQuestions: res.totalQuestions,
        questions: res.questions.map((q) => ({
          subject: q.subject,
          isCorrect: q.isCorrect ?? q.userAnswer === q.correctAnswer,
        })),
      }));

      const result = await analyzePerformance({ testResults: analysisInput });
      setAnalysis(result);
    } catch (error) {
      console.error("Performance analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description:
          "Could not generate performance analysis. Please try again later.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenModal = async (testId: string) => {
    setModalTestId(testId);
    setModalLoading(true);
    const result = testResults.find((t) => t.id === testId) || null;
    setModalTestResult(result);
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setModalTestId(null);
    setModalTestResult(null);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <TricolorSpinner size={72} />
      </div>
    );
  }

  const renderTimestamp = (timestamp: string) => {
    try {
      if (timestamp && !isNaN(new Date(timestamp).getTime())) {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      }
    } catch (e) {}
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">
            Welcome, {user.displayName || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's a summary of your learning journey.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <BrainCircuit className="h-7 w-7 text-primary" />
              AI Performance Analysis
            </CardTitle>
            <CardDescription>
              Get personalized insights into your strengths and weaknesses based
              on your mock test history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Overall Summary
                  </h3>
                  <p className="text-muted-foreground">
                    {analysis.overallSummary}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-semibold">
                      <TrendingUp className="h-5 w-5 text-[#12b981]" />{" "}
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {analysis.strengths.map((item, i) => (
                        <li key={i}>
                          <strong>{item.area}</strong> — Accuracy:{" "}
                          {item.accuracy}%<br />
                          {item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-semibold">
                      <TrendingDown className="h-5 w-5 text-red-500" />{" "}
                      Weaknesses
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {analysis.weaknesses.map((item, i) => (
                        <li key={i}>
                          <strong>{item.area}</strong> — Accuracy:{" "}
                          {item.accuracy}%<br />
                          {item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Target className="h-5 w-5 text-[#3c82f6]" />{" "}
                    Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.recommendations.map(
                      (
                        item:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<React.AwaitedReactNode>
                          | null
                          | undefined,
                        i: any
                      ) => (
                        <li key={`rec-${i}`}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="flex items-center justify-center p-8">
                <TricolorSpinner size={64} />
                <p className="ml-4 text-muted-foreground">
                  Analyzing your performance...
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the button to generate your analysis.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnalyzePerformance}
              disabled={isAnalyzing || loadingResults}
            >
              {isAnalyzing ? (
                <>
                  <TricolorSpinner size={32} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {analysis
                    ? "Re-analyze Performance"
                    : "Analyze My Performance"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookCheck className="h-6 w-6 text-accent" />
                Quiz History
              </CardTitle>
              <CardDescription>
                A log of all the quizzes you've taken.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResults ? (
                <div className="flex items-center justify-center p-8">
                  <TricolorSpinner size={32} />
                </div>
              ) : quizResults.length > 0 ? (
                <ul className="space-y-4">
                  {quizResults.map((result) => (
                    <li key={result.id} className="rounded-lg border p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{result.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.difficulty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {result.score}/{result.totalQuestions}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {renderTimestamp(result.timestamp)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">
                  No quiz results yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-6 w-6 text-primary" />
                Mock Test History
              </CardTitle>
              <CardDescription>
                A log of all the mock tests you've completed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResults ? (
                <div className="flex items-center justify-center p-8">
                  <TricolorSpinner size={32} />
                </div>
              ) : testResults.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {testResults.map((result, index) => (
                    <AccordionItem value={`item-${index}`} key={result.id}>
                      <AccordionTrigger>
                        <div className="flex w-full items-center justify-between pr-4">
                          <div className="text-left">
                            <p className="font-semibold">
                              {result.subjects.map((s) => s.subject).join(", ")}{" "}
                              Test
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.difficulty}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {result.score}/{result.totalQuestions}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {renderTimestamp(result.timestamp)}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Time Limit: {result.timeLimit} minutes</span>
                          </div>
                          <h4 className="font-semibold pt-2">
                            Subject-wise Performance:
                          </h4>
                          {Object.entries(result.subjectWiseScores).map(
                            ([subject, scores]) => (
                              <div
                                key={subject}
                                className="flex justify-between text-sm"
                              >
                                <p>{subject}</p>
                                <p className="font-medium">
                                  {scores.correct}/{scores.total}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => handleOpenModal(result.id)}
                        >
                          Check Answers
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center text-muted-foreground">
                  No mock test results yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Dialog
        open={!!modalTestId}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Answers</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <div className="flex items-center justify-center p-8">
              <TricolorSpinner size={32} />
            </div>
          ) : modalTestResult ? (
            <>
              {modalTestResult.questions.map((q, i) => (
                <div key={i} className="border rounded p-3 mb-4">
                  <div className="font-semibold mb-1">
                    Q{i + 1}:{" "}
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      className="inline"
                    >
                      {q.question}
                    </ReactMarkdown>
                  </div>
                  <ul className="mb-1">
                    {q.options.map((opt, idx) => {
                      const isCorrect = idx === q.correctAnswer;
                      const isUser = idx === q.userAnswer;
                      const userGotItWrong =
                        isUser && q.userAnswer !== q.correctAnswer;
                      let optionClass = "pl-2 ";
                      if (isCorrect) optionClass += "text-[#12b981] font-bold ";
                      if (isUser && q.userAnswer === q.correctAnswer)
                        optionClass += "text-blue-600 underline ";
                      if (userGotItWrong)
                        optionClass += "text-red-600 underline ";
                      return (
                        <li key={idx} className={optionClass}>
                          <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            className="inline"
                          >
                            {opt}
                          </ReactMarkdown>
                          {isCorrect && " (Correct)"}
                          {isUser && !isCorrect && " (Your Answer)"}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="text-xs text-muted-foreground">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {q.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Test not found.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
