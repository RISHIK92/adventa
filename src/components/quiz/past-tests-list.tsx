"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Play,
  Eye,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface QuizAttempt {
  id: string;
  quizId: string;
  title: string;
  description?: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Completed" | "In Progress" | "Not Started";
  dateStarted?: Date;
  dateCompleted?: Date;
  score?: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeSpent?: number; // in minutes
  accuracy?: number; // percentage
}

interface PastTestsListProps {
  attempts: QuizAttempt[];
  loading?: boolean;
  onViewResults: (attemptId: string) => void;
  onContinueQuiz?: (attemptId: string) => void;
  onStartQuiz: (quizId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Not Started":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getSubjectColor = (subject: string) => {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
  ];

  if (!subject) {
    return "bg-gray-200 text-gray-700";
  }

  const hash = subject
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatTimeSpent = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const TestSkeleton = () => (
  <Card className="transition-all duration-200">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <BookOpen className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No quiz attempts found</h3>
    <p className="text-muted-foreground max-w-md">
      You haven't taken any quizzes yet. Start your learning journey by taking
      your first quiz!
    </p>
  </div>
);

export const PastTestsList: React.FC<PastTestsListProps> = ({
  attempts,
  loading = false,
  onViewResults,
  onContinueQuiz,
  onStartQuiz,
}) => {
  // Sort attempts by date (newest first)
  const sortedAttempts = React.useMemo(() => {
    return [...attempts].sort((a, b) => {
      const dateA = a.dateCompleted || a.dateStarted || new Date(0);
      const dateB = b.dateCompleted || b.dateStarted || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [attempts]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <TestSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (attempts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {sortedAttempts.map((attempt) => {
        const progress =
          (attempt.answeredQuestions / attempt.totalQuestions) * 100;
        const displayDate = attempt.dateCompleted || attempt.dateStarted;

        return (
          <Card
            key={attempt.id}
            className="transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/5 border-gray-200"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-foreground truncate">
                    {attempt.title}
                  </CardTitle>
                  {attempt.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {attempt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={getSubjectColor(attempt.subject)}
                    >
                      {attempt.subject}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={getDifficultyColor(attempt.difficulty)}
                    >
                      {attempt.difficulty}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(attempt.status)}
                    >
                      {attempt.status === "Completed" && (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      )}
                      {attempt.status === "In Progress" && (
                        <Play className="w-3 h-3 mr-1" />
                      )}
                      {attempt.status === "Not Started" && (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {attempt.status}
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats and Action Button */}
                <div className="flex flex-col justify-center items-end gap-2 text-right min-w-0 h-full">
                  {attempt.status === "Completed" && attempt.accuracy && (
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <Target className="w-3 h-3" />
                      {attempt.accuracy}%
                    </div>
                  )}

                  {/* Action Button centered vertically */}
                  {attempt.status === "Completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewResults(attempt.id)}
                      className="transition-colors  bg-[#ff7b37] border-white text-white hover:bg-[#ff7b37]/80 hover:border-white hover:text-gray-200"
                    >
                      <Eye className="w-4 h-4 mr-2 text-white" />
                      View Results
                    </Button>
                  )}

                  {onContinueQuiz && attempt.status === "In Progress" && (
                    <Button
                      size="sm"
                      onClick={() => onContinueQuiz(attempt.id)}
                      className="bg-[#ff7b37] hover:bg-[#ff7b37]/90 text-gray-200"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  )}

                  {attempt.status === "Not Started" && (
                    <Button
                      size="sm"
                      onClick={() => onStartQuiz(attempt.quizId)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  )}

                  {displayDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(displayDate)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Progress Section */}
                {attempt.status === "In Progress" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {attempt.answeredQuestions}/{attempt.totalQuestions}{" "}
                        questions
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Completed Stats */}
                {attempt.status === "Completed" && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-medium text-green-600">
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                    </div>
                    {attempt.timeSpent && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                          {formatTimeSpent(attempt.timeSpent)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
