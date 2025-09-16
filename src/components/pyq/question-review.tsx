"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Minus,
  ChevronDown,
  ChevronUp,
  Grid3X3,
} from "lucide-react";
import Latex from "react-latex-next";

interface Question {
  id: string;
  question: string;
  options: string[];
  userAnswer?: number;
  correctAnswer: number;
  explanation: string;
  subject: string;
  type: string;
  isCorrect?: boolean;
  imageUrl?: string | null;
  imagesolurl?: string | null;
}

interface QuestionReviewProps {
  questions: Question[];
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  questions,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const getQuestionStatus = (q: Question) => {
    if (q.userAnswer === undefined) return "unattempted";
    return q.isCorrect ? "correct" : "incorrect";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-500";
      case "incorrect":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <Check className="w-4 h-4" />;
      case "incorrect":
        return <X className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const navigateToQuestion = useCallback((index: number) => {
    setCurrentQuestion(index);
    setShowExplanation(false);
    setShowOverview(false);
  }, []);

  const navigateNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      navigateToQuestion(currentQuestion + 1);
    }
  };

  const navigatePrevious = () => {
    if (currentQuestion > 0) {
      navigateToQuestion(currentQuestion - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigatePrevious();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "Escape") setShowOverview(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, totalQuestions]);

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const attemptedCount = questions.filter(
    (q) => q.userAnswer !== undefined
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange0590 via-orange-50 to-orange-100 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-display font-bold bg-clip-text">
              Question Review
            </h1>
            <Button
              onClick={() => setShowOverview(!showOverview)}
              variant="outline"
              className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between text-sm font-mono text-orange-500 mb-2">
              <span>
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span>
                {correctCount}/{attemptedCount} Correct
              </span>
            </div>
            <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-300 to-orange-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Overview Grid */}
        {showOverview && (
          <Card className="mb-8 backdrop-blur-md bg-white/60 border-white/30 shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-display font-semibold mb-4">
                All Questions
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(q);
                  return (
                    <button
                      key={q.id}
                      onClick={() => navigateToQuestion(index)}
                      className={`
                        relative aspect-video rounded-lg transition-all duration-300 transform hover:shadow-lg
                        ${
                          currentQuestion === index
                            ? "ring-2 ring-orange-800 ring-offset-2"
                            : ""
                        }
                        bg-gradient-to-br ${getStatusColor(
                          status
                        )} text-white font-mono font-semibold text-sm
                        flex items-center justify-center
                      `}
                    >
                      {index + 1}
                      <div className="absolute -top-1 -right-1">
                        {getStatusIcon(status)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Main Question Card */}
        <Card className="backdrop-blur-md bg-white/60 border-white/30 shadow-2xl mb-8 overflow-hidden">
          <div className="p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 font-mono"
                >
                  Q{currentQuestion + 1}
                </Badge>
                <Badge
                  variant="secondary"
                  className="backdrop-blur-sm bg-white/50 border-white/30"
                >
                  {question.subject}
                </Badge>
                <Badge
                  variant="outline"
                  className="backdrop-blur-sm bg-white/30 border-white/40"
                >
                  {question.type}
                </Badge>
              </div>

              {/* Status Indicator */}
              <div
                className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-white font-medium text-sm
                bg-gradient-to-r ${getStatusColor(getQuestionStatus(question))}
              `}
              >
                {getStatusIcon(getQuestionStatus(question))}
                <span className="capitalize">
                  {getQuestionStatus(question)}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-xl font-body leading-relaxed text-slate-800">
                <Latex>{question.question}</Latex>
                {question.imageUrl && (
                  <div className="mt-4 p-4 bg-white/50 rounded-lg flex justify-center">
                    <img
                      src={question.imageUrl}
                      alt="Question"
                      className="max-w-72 h-auto rounded-md"
                    />
                  </div>
                )}
              </h2>
            </div>

            {/* Options */}
            <div className="grid gap-4 mb-8">
              {question.options.map((option, index) => {
                const isUserAnswer = question.userAnswer === index;
                const isCorrectAnswer = question.correctAnswer === index;

                let cardClass =
                  "p-4 rounded-lg border-2 transition-all duration-300 ";

                if (isCorrectAnswer) {
                  cardClass +=
                    "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg";
                } else if (isUserAnswer && !isCorrectAnswer) {
                  cardClass +=
                    "border-red-400 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg";
                } else {
                  cardClass +=
                    "border-white/40 bg-white/30 backdrop-blur-sm hover:bg-white/40 hover:border-white/60";
                }

                return (
                  <div key={index} className={cardClass}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-mono font-semibold text-sm
                        ${
                          isCorrectAnswer
                            ? "bg-emerald-500 text-white"
                            : isUserAnswer
                            ? "bg-red-500 text-white"
                            : "bg-slate-200 text-slate-600"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-slate-800 font-body">
                        {" "}
                        <div className="text-slate-800 font-body flex-grow">
                          {option.startsWith("http") ? (
                            <img
                              src={option}
                              alt={`Option ${String.fromCharCode(65 + index)}`}
                              className="max-w-64 h-auto rounded-md"
                            />
                          ) : (
                            <Latex>{option}</Latex>
                          )}
                        </div>
                      </span>

                      {/* Answer indicators */}
                      <div className="ml-auto flex gap-2">
                        {isUserAnswer && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              isCorrectAnswer
                                ? "border-emerald-500 text-emerald-700"
                                : "border-red-500 text-red-700"
                            }`}
                          >
                            Your Answer
                          </Badge>
                        )}
                        {isCorrectAnswer && (
                          <Badge
                            variant="outline"
                            className="text-xs border-emerald-500 text-emerald-700"
                          >
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Section */}
            <div className="border-t border-white/30 pt-6">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium"
              >
                {showExplanation ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
                Explanation
              </button>

              <div
                className={`
                overflow-hidden transition-all duration-500 ease-in-out overflow-y-scroll
                ${
                  showExplanation
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }
              `}
              >
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  {question.imagesolurl && (
                    <div className="mb-4 p-2 bg-white/50 rounded-lg flex justify-center">
                      <img
                        src={question.imagesolurl}
                        alt="Solution"
                        className="max-w-72 h-auto rounded-md"
                      />
                    </div>
                  )}
                  <div className="text-slate-700 font-body leading-relaxed space-y-2">
                    {question.explanation?.split("\n").map((line, index) => (
                      <p key={index}>
                        <Latex>{line}</Latex>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={navigatePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
            className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 px-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/30 border border-white/40">
            <span className="font-mono text-sm text-slate-700">
              {currentQuestion + 1} / {totalQuestions}
            </span>
          </div>

          <Button
            onClick={navigateNext}
            disabled={currentQuestion === totalQuestions - 1}
            size="lg"
            className=" bg-[#ff6b35] hover:bg-[#ff6b35]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 px-6"
          >
            <span className="text-white">Next</span>
            <ChevronRight className="w-5 h-5 ml-2 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
