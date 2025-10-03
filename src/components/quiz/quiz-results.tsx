"use client";

import { useRef, useState } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowUpDown,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  continueInBackground,
  handleExplainConcept,
} from "@/utils/videoHelper";
import { VideoGenerator } from "@/components/ui/videoGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuizResultsData {
  quizName: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  timeTaken: string;
  topics: {
    name: string;
    questionsAttempted: number;
    correctAnswers: number;
    accuracy: number;
    avgTimePerQuestionSec: number;
  }[];
  questions: {
    id: number;
    questionText: string;
    topic: string;
    status: "correct" | "incorrect" | "unattempted";
    selectedAnswer?: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
    imageUrl?: string;
    questionNumber?: string;
    imagesolurl?: string;
    timeTakenSec?: number;
  }[];
}

interface QuizResultsPageProps {
  data: QuizResultsData;
}

export default function QuizResultsPage({ data }: QuizResultsPageProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof QuizResultsData["topics"][0];
    direction: "asc" | "desc";
  } | null>(null);
  const [bgVideoJob, setBgVideoJob] = useState<any>(null);
  const [genTopic, setGenTopic] = useState("");
  const [genContext, setGenContext] = useState("");
  const [showVideoGen, setShowVideoGen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const router = useRouter();

  const handleSort = (key: keyof QuizResultsData["topics"][0]) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTopics = Array.isArray(data.topics)
    ? [...data.topics].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const accuracy =
    data.totalQuestions > 0
      ? Math.round((data.correctAnswers / data.totalQuestions) * 100)
      : 0;

  const getAccuracyColor = (accuracy: any) => {
    if (accuracy >= 80) return "#22c55e";
    if (accuracy >= 60) return "#eab308";
    return "#ef4444";
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const handleVisualizeQuestion = (question: any) => {
    const session = {
      title: `Q${question.questionNumber}: ${question.questionText?.slice(
        0,
        50
      )}${question.questionText?.length > 50 ? "..." : ""}`,
      // You can add more session properties here if needed
    };
    setSelectedQuestion(question);
    setShowVideoModal(true);
    handleExplainConcept(
      session,
      bgVideoJob,
      timersRef,
      setBgVideoJob,
      setGenTopic,
      setGenContext,
      setShowVideoGen
    );
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    setShowVideoModal(isOpen);
    if (!isOpen) {
      setSelectedQuestion(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
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
                    {data.quizName}
                  </h1>
                  <div className="hidden lg:inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700">
                      Results Analysis
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm md:text-base">
                  Completed on{" "}
                  {new Date(data.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Correct Answers
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {data.correctAnswers}
              </div>
              <p className="text-xs text-gray-600">{accuracy}% accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Incorrect Answers
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {data.incorrectAnswers}
              </div>
              <p className="text-xs text-gray-600">
                {data.totalQuestions > 0
                  ? Math.round(
                      (data.incorrectAnswers / data.totalQuestions) * 100
                    )
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Unattempted
              </CardTitle>
              <User className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                {data.unattemptedQuestions}
              </div>
              <p className="text-xs text-gray-600">
                {data.totalQuestions > 0
                  ? Math.round(
                      (data.unattemptedQuestions / data.totalQuestions) * 100
                    )
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Time Taken
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {data.timeTaken}
              </div>
              <p className="text-xs text-gray-600">Total duration</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Topic-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="h-auto p-0 font-semibold"
                      >
                        Topic
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-900">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("questionsAttempted")}
                        className="h-auto p-0 font-semibold"
                      >
                        Attempted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-900">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("correctAnswers")}
                        className="h-auto p-0 font-semibold"
                      >
                        Correct
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-900">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("accuracy")}
                        className="h-auto p-0 font-semibold"
                      >
                        Accuracy
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-900">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("avgTimePerQuestionSec")}
                        className="h-auto p-0 font-semibold"
                      >
                        Avg. Time
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-900">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopics.map((topic, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-gray-900">
                        {topic.name}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {topic.questionsAttempted}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {topic.correctAnswers}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {topic.accuracy.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {formatTime(topic.avgTimePerQuestionSec)}
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${topic.accuracy}%`,
                              backgroundColor: getAccuracyColor(
                                Number(topic.accuracy)
                              ),
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              {data.questions.map((question) => (
                <AccordionItem
                  key={question.id}
                  value={`question-${question.id}`}
                  className="border border-gray-300 rounded-lg"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">
                          Q{question.questionNumber}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {question.topic}
                        </Badge>
                        <Badge
                          variant={
                            question.status === "correct"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            question.status === "correct"
                              ? "bg-green-500 text-white"
                              : question.status === "incorrect"
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {question.status}
                        </Badge>
                        {question.timeTakenSec && (
                          <div className="flex items-center text-xs px-2 py-1 bg-gray-200 rounded-xl text-gray-700">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(question.timeTakenSec)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisualizeQuestion(question);
                          }}
                          className="text-xs px-3 py-1 h-7 bg-gradient-to-r hover:text-gray-200 from-orange-500 to-orange-500 text-white border-0 hover:from-orange-600 hover:to-orange-600 mr-2"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Visualize
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-900 font-medium">
                          <Latex>{question.questionText}</Latex>
                        </p>
                      </div>

                      {question.imageUrl && (
                        <div className="rounded-lg border border-gray-300 p-2">
                          <img
                            src={question.imageUrl}
                            alt="Question illustration"
                            className="max-w-96 h-auto rounded"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const optionLetter = String.fromCharCode(
                            65 + optionIndex
                          );
                          const isSelected =
                            question.selectedAnswer === optionLetter;
                          const isCorrect =
                            question.correctAnswer === optionLetter;
                          const isOptionImageUrl =
                            typeof option === "string" &&
                            option.startsWith("http");

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border-2 transition-colors ${
                                isCorrect
                                  ? "border-green-500 bg-green-500/10"
                                  : isSelected && !isCorrect
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-gray-300 bg-card"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrect && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {isSelected && !isCorrect && (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span
                                  className={`${
                                    isCorrect
                                      ? "font-medium text-green-800"
                                      : isSelected && !isCorrect
                                      ? "font-medium text-red-800"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {optionLetter}.{" "}
                                  {isOptionImageUrl ? (
                                    <img
                                      src={option}
                                      alt={`Option ${optionLetter}`}
                                      className="max-h-32 rounded-md inline-block align-middle ml-2 border"
                                    />
                                  ) : (
                                    <Latex>{option}</Latex>
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {question.explanation && (
                        <div className="bg-muted/50 rounded-lg p-4 border border-gray-300 space-y-3">
                          <h4 className="font-medium text-gray-900">
                            Explanation:
                          </h4>
                          {question.imagesolurl && (
                            <div className="rounded-lg border border-gray-300 p-2">
                              <img
                                src={question.imagesolurl}
                                alt="Explanation illustration"
                                className="max-w-96 h-auto rounded"
                              />
                            </div>
                          )}
                          {question.explanation
                            ?.split("\n")
                            .map((line, index) => (
                              <p key={index}>
                                <Latex>{line}</Latex>
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showVideoGen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Video Explanation</DialogTitle>
          </DialogHeader>

          {/* Render the VideoGenerator only when a question is selected */}
          {selectedQuestion && (
            <VideoGenerator
              questionId={selectedQuestion.id}
              startGeneration={showVideoModal} // The component starts its work when this is true
              topicTitle={`Q${selectedQuestion.questionNumber}: ${selectedQuestion.topic}`}
              context={selectedQuestion.questionText}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
