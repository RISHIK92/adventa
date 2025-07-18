"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Flag,
  RotateCcw,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Circle,
  Eye,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  number: number;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer?: number;
  userAnswer?: number;
  markedForReview?: boolean;
}

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  timeLimit?: number;
  onSubmit?: (answers: Record<string, number | undefined>) => void;
  onQuestionChange?: (questionId: string) => void;
}

export default function QuizInterface({
  questions = [],
  timeLimit = 3600,
  onSubmit,
  onQuestionChange,
}: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsState, setQuestionsState] =
    useState<QuizQuestion[]>(questions);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock questions for demonstration
  const defaultQuestions: QuizQuestion[] = [
    {
      id: "1",
      number: 1,
      subject: "Mathematics",
      difficulty: "Medium",
      question: "What is the derivative of x³ + 2x² - 5x + 3?",
      options: [
        "3x² + 4x - 5",
        "x⁴ + 2x³ - 5x² + 3x",
        "3x² + 4x + 5",
        "6x + 4",
      ],
    },
    {
      id: "2",
      number: 2,
      subject: "Physics",
      difficulty: "Hard",
      question:
        "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
      options: ["10 m", "20 m", "30 m", "40 m"],
    },
    {
      id: "3",
      number: 3,
      subject: "Chemistry",
      difficulty: "Easy",
      question: "What is the chemical symbol for Gold?",
      options: ["Go", "Au", "Ag", "Gl"],
    },
    {
      id: "4",
      number: 4,
      subject: "Biology",
      difficulty: "Medium",
      question: "Which organelle is responsible for cellular respiration?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
    },
  ];

  useEffect(() => {
    if (questions.length === 0) {
      setQuestionsState(defaultQuestions);
    } else {
      setQuestionsState(questions);
    }
  }, [questions]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showReview && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, showReview, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questionsState[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionsState.length) * 100;

  const handleAnswerSelect = (value: string) => {
    const answerIndex = parseInt(value);
    setQuestionsState((prev) =>
      prev.map((q, index) =>
        index === currentQuestionIndex ? { ...q, userAnswer: answerIndex } : q
      )
    );
  };

  const handleMarkForReview = () => {
    setQuestionsState((prev) =>
      prev.map((q, index) =>
        index === currentQuestionIndex
          ? { ...q, markedForReview: !q.markedForReview }
          : q
      )
    );
  };

  const handleClearResponse = () => {
    setQuestionsState((prev) =>
      prev.map((q, index) =>
        index === currentQuestionIndex ? { ...q, userAnswer: undefined } : q
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsState.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      onQuestionChange?.(questionsState[newIndex].id);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      onQuestionChange?.(questionsState[newIndex].id);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    onQuestionChange?.(questionsState[index].id);
  };

  const handleSubmitQuiz = () => {
    const answers = questionsState.reduce((acc, question) => {
      acc[question.id] = question.userAnswer;
      return acc;
    }, {} as Record<string, number | undefined>);

    setIsSubmitted(true);
    onSubmit?.(answers);
  };

  const getQuestionStatus = (question: QuizQuestion) => {
    if (question.userAnswer !== undefined) {
      return question.markedForReview ? "answered-marked" : "answered";
    } else if (question.markedForReview) {
      return "marked";
    } else {
      return "unanswered";
    }
  };

  const getAnsweredCount = () =>
    questionsState.filter((q) => q.userAnswer !== undefined).length;
  const getMarkedCount = () =>
    questionsState.filter((q) => q.markedForReview).length;
  const getUnansweredCount = () =>
    questionsState.filter((q) => q.userAnswer === undefined).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (showReview) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        {/* Main review content */}
        <div className="flex-1 p-6">
          <Card className="bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-display font-semibold">
                Review Your Answers
              </CardTitle>
              <p className="text-muted-foreground">
                Please review your responses before final submission
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {questionsState.map((question, index) => {
                  const status = getQuestionStatus(question);
                  return (
                    <Card
                      key={question.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        status === "answered"
                          ? "border-primary/30 bg-primary/5"
                          : status === "answered-marked"
                          ? "border-warning/30 bg-warning/5"
                          : status === "marked"
                          ? "border-warning/30 bg-warning/5"
                          : "border-border"
                      }`}
                      onClick={() => {
                        setShowReview(false);
                        setCurrentQuestionIndex(index);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Q{question.number}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {status === "answered" && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                            {status === "answered-marked" && (
                              <div className="flex gap-1">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <Flag className="h-4 w-4 text-warning" />
                              </div>
                            )}
                            {status === "marked" && (
                              <Flag className="h-4 w-4 text-warning" />
                            )}
                            {status === "unanswered" && (
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {question.subject}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.question}
                        </p>
                        {question.userAnswer !== undefined && (
                          <p className="text-xs text-primary mt-2 font-medium">
                            Selected: Option {question.userAnswer + 1}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowReview(false)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Quiz
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {getAnsweredCount()} of {questionsState.length} questions
                    answered
                  </p>
                  {getUnansweredCount() > 0 && (
                    <p className="text-sm text-destructive">
                      {getUnansweredCount()} questions remain unanswered
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSubmitQuiz}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <Card className="w-full max-w-md bg-card">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-display font-semibold mb-2">
              Quiz Submitted Successfully
            </h2>
            <p className="text-muted-foreground mb-4">
              Your answers have been recorded and will be evaluated shortly.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-medium">{questionsState.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-medium text-primary">
                  {getAnsweredCount()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <span className="font-medium text-warning">
                  {getMarkedCount()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Question Palette Sidebar */}
      <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Timer */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Remaining</span>
              </div>
              <div
                className={`text-xl font-mono ${
                  timeRemaining < 600 ? "text-destructive" : "text-foreground"
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-xs text-muted-foreground">
                  {currentQuestionIndex + 1}/{questionsState.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Summary */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Question Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <span>Answered</span>
                  </div>
                  <span className="font-medium">{getAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="h-3 w-3 text-warning" />
                    <span>Marked</span>
                  </div>
                  <span className="font-medium">{getMarkedCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 text-muted-foreground" />
                    <span>Unanswered</span>
                  </div>
                  <span className="font-medium">{getUnansweredCount()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Palette */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {questionsState.map((question, index) => {
                  const status = getQuestionStatus(question);
                  const isCurrentQuestion = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionSelect(index)}
                      className={`
                        w-8 h-8 text-xs font-medium rounded transition-all
                        ${
                          isCurrentQuestion
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                            : ""
                        }
                        ${
                          status === "answered"
                            ? "bg-primary text-primary-foreground"
                            : status === "answered-marked"
                            ? "bg-warning text-white"
                            : status === "marked"
                            ? "bg-warning/20 text-warning border border-warning"
                            : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                        }
                      `}
                    >
                      {question.number}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Quiz Content */}
      <div className="flex-1 p-6">
        <Card className="h-full bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Question {currentQuestion?.number}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {currentQuestion?.subject}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getDifficultyColor(
                      currentQuestion?.difficulty || ""
                    )}`}
                  >
                    {currentQuestion?.difficulty}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReview(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Review
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-6">
            <div className="space-y-6">
              {/* Question */}
              <div>
                <p className="text-base leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </div>

              {/* Options */}
              <div>
                <RadioGroup
                  value={currentQuestion?.userAnswer?.toString() || ""}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {currentQuestion?.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 text-base leading-relaxed cursor-pointer"
                      >
                        <span className="font-medium mr-2">
                          ({String.fromCharCode(65 + index)})
                        </span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>

          {/* Navigation Footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkForReview}
                  className={`gap-2 ${
                    currentQuestion?.markedForReview
                      ? "bg-warning/10 text-warning border-warning"
                      : ""
                  }`}
                >
                  <Flag className="h-4 w-4" />
                  {currentQuestion?.markedForReview
                    ? "Unmark"
                    : "Mark for Review"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearResponse}
                  disabled={currentQuestion?.userAnswer === undefined}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Response
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentQuestionIndex === questionsState.length - 1 ? (
                  <Button
                    onClick={() => setShowReview(true)}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Review & Submit
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
