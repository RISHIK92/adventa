"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";
import { apiService } from "@/app/dashboard/[examId]/weakness-test/page";

//==============================================================================
// HELPER UI COMPONENTS (These would typically be in their own files)
//==============================================================================
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  className?: string;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm";
  const variants = {
    default: "bg-orange-500 text-white hover:bg-orange-600",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);
const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-orange-500 h-2 rounded-full"
      style={{ width: `${value}%` }}
    />
  </div>
);

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

interface Answer {
  answer: string | null;
  timeTaken: number;
}

export function Quiz({ quizData }: { quizData: TestData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0 && !isSubmitting) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0 && !isSubmitting) {
        handleSubmit();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitting]);

  const recordTime = () => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const questionId = quizData.questions[currentQuestionIndex].id;

    const existingTime = answers[questionId]?.timeTaken || 0;
    const existingAnswer = answers[questionId]?.answer || null;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: existingAnswer,
        timeTaken: existingTime + timeSpent,
      },
    }));

    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (selectedOption: string) => {
    const questionId = quizData.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], answer: selectedOption },
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      recordTime();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      recordTime();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Record time for the very last question
    recordTime();

    // The answers state is updated asynchronously, so we need to wait for the next render cycle.
    // A useEffect hook can handle submission after state update, or we can construct the payload directly.
    // Let's use an effect for simplicity and reliability.
  };

  // This effect will run after the final `recordTime` call in handleSubmit sets the state.
  useEffect(() => {
    if (isSubmitting) {
      const submit = async () => {
        const answerPayload = Object.entries(answers).map(
          ([questionId, data]) => ({
            questionId: Number(questionId),
            userAnswer: data.answer,
            timeTaken: Math.round(data.timeTaken),
          })
        );

        try {
          await apiService.submitWeaknessTest(
            quizData.testInstanceId,
            answerPayload,
            quizData.timeLimit - timeLeft
          );
          // Navigate to the results page
          router.push(`/test-result/${quizData.testInstanceId}`);
        } catch (error) {
          console.error("Failed to submit test:", error);
          alert("There was an error submitting your test. Please try again.");
          setIsSubmitting(false); // Re-enable the button on error
        }
      };
      submit();
    }
  }, [isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!quizData || quizData.questions.length === 0) {
    return <div>This test has no questions.</div>;
  }

  const currentQ = quizData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">∑</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {quizData.testName}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of{" "}
                {quizData.questions.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-600 text-sm">Time Left</div>
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <Progress value={progress} />

        <Card className="my-6">
          <h2 className="text-xl font-medium text-gray-900 mb-5">
            {currentQ.question}
          </h2>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id]?.answer === option;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
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
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-900 font-medium">{option}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            Previous
          </Button>
          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
