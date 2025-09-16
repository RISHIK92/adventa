"use-client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiService, TestType } from "@/services/weaknessApi";

// --- 1. IMPORT LATEX AND ITS CSS ---
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type QuestionOption = {
  label: string;
  value: string;
};

interface TestData {
  testInstanceId: string;
  testName: string;
  timeLimit: number;
  questions: {
    id: number;
    questionNumber: number;
    question: string;
    options: QuestionOption[];
    imageUrl?: string;
  }[];
}

interface QuizProps {
  quizData: TestData;
  testType: TestType;
}

export function Quiz({
  quizData,
  testType,
}: {
  quizData: TestData;
  testType: TestType;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const questionStartTimeRef = useRef(Date.now());

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const currentIndexRef = useRef(currentQuestionIndex);
  currentIndexRef.current = currentQuestionIndex;

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { testInstanceId, questions } = quizData;

  const saveCurrentProgress = useCallback(
    async (isFinalSave = false) => {
      const timeSpentChunk = (Date.now() - questionStartTimeRef.current) / 1000;
      questionStartTimeRef.current = Date.now();

      if (timeSpentChunk > 0.1 || isFinalSave) {
        const questionId = questions[currentIndexRef.current].id;
        const userAnswer = answersRef.current[questionId] || null;
        await apiService.saveProgress(
          testInstanceId,
          questionId,
          userAnswer,
          timeSpentChunk
        );
      }
    },
    [testInstanceId, questions]
  );

  useEffect(() => {
    const restoreProgress = async () => {
      try {
        const { answers: savedAnswers, totalTime } =
          await apiService.getSavedProgress(testInstanceId);

        // Convert keys from string to number for consistency
        const parsedAnswers = Object.entries(savedAnswers).reduce(
          (acc, [key, value]) => {
            acc[Number(key)] = value;
            return acc;
          },
          {} as Record<number, string | null>
        );

        setAnswers(parsedAnswers);
        setTimeLeft(quizData.timeLimit - totalTime);
      } catch (error) {
        console.error("Could not restore progress:", error);
      } finally {
        setIsInitializing(false);
        questionStartTimeRef.current = Date.now();
      }
    };

    restoreProgress();
  }, [testInstanceId, quizData.timeLimit]);

  const resetAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setInterval(() => {
      saveCurrentProgress();
    }, 10000);
  }, [saveCurrentProgress]);

  useEffect(() => {
    resetAutoSaveTimer();
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [resetAutoSaveTimer]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await saveCurrentProgress(true);
    if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);

    try {
      const result = await apiService.submitTest(testInstanceId, testType);
      if (testType === "custom") {
        router.push(`/quiz-results/${result.summary.testInstanceId}`);
      } else {
        router.push(`/test-result/${result.summary.testInstanceId}`);
      }
    } catch (error) {
      console.error("Failed to submit test:", error);
      alert("There was an error submitting your test. Please try again.");
      setIsSubmitting(false);
    }
  }, [isSubmitting, testInstanceId, router, saveCurrentProgress]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleSubmit]);

  const handleSelectOption = (selectedOptionValue: string) => {
    const questionId = questions[currentQuestionIndex].id;

    const saveSelection = async () => {
      const timeSpentChunk = (Date.now() - questionStartTimeRef.current) / 1000;
      questionStartTimeRef.current = Date.now();

      await apiService.saveProgress(
        testInstanceId,
        questionId,
        selectedOptionValue,
        timeSpentChunk
      );
    };

    saveSelection();

    setAnswers((prev) => ({ ...prev, [questionId]: selectedOptionValue }));
    resetAutoSaveTimer();
  };

  const handleNavigation = (direction: "next" | "prev") => {
    saveCurrentProgress();
    resetAutoSaveTimer();
    questionStartTimeRef.current = Date.now();
    if (direction === "next" && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-3 text-gray-700">Resuming your test...</span>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Card className="p-6">This test appears to have no questions.</Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {quizData.testName}
            </h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-gray-600 text-sm">Time Left</div>
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </header>

        <Progress value={progress} />

        <Card className="my-6">
          <CardContent className="pt-2">
            <h2 className="text-xl font-medium text-gray-900 mb-5">
              <Latex>{currentQuestion.question}</Latex>
            </h2>
            {currentQuestion.imageUrl && (
              <div className="mb-6">
                <img
                  src={currentQuestion.imageUrl}
                  alt=""
                  className="rounded-lg max-w-80 mx-auto"
                />
              </div>
            )}
            <div className="space-y-3">
              {currentQuestion.options
                .filter(
                  (option) => option && typeof option.value !== "undefined"
                )
                .map((option, index) => {
                  const isOptionImageUrl =
                    typeof option.value === "string" &&
                    option.value.startsWith("http");
                  const isSelected =
                    answers[currentQuestion.id] === option.label;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(option.label)}
                      disabled={isSubmitting}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                          isSelected
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {option.label}
                      </div>
                      <span className="text-gray-900 font-medium">
                        {isOptionImageUrl ? (
                          <img
                            src={option.value}
                            alt={`Option ${option.label}`}
                            className="max-h-32 rounded-md inline-block align-middle ml-2 border"
                          />
                        ) : (
                          <Latex>{option.value}</Latex>
                        )}
                      </span>
                    </button>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <footer className="flex justify-between items-center">
          <Button
            variant="outline"
            className="bg-[#ff7b37] border-white hover:bg-[#ff7b37]/90"
            onClick={() => handleNavigation("prev")}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2 text-white" />{" "}
            <span className="text-white">Previous</span>
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-red-500 border-white hover:bg-red-500/90"
            >
              <span className="text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </span>
            </Button>
          ) : (
            <Button
              onClick={() => handleNavigation("next")}
              disabled={isSubmitting}
              className="bg-[#ff7b37] border-white hover:bg-[#ff7b37]/90"
            >
              <span className="text-white">Next</span>{" "}
              <ChevronRight className="h-4 w-4 ml-2 text-white" />
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
