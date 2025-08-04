"use client";

import { useState, useCallback } from "react";
import TestTimer from "@/components/test-environment/test-timer";
import QuestionNavigation from "@/components/test-environment/question-navigation";
import QuestionDisplay from "@/components/test-environment/question-display";
import QuickActionsPanel from "@/components/test-environment/quick-actions-panel";
import MobileHeader from "@/components/test-environment/mobile-header";

interface Question {
  id: number;
  subject: string;
  type: "mcq" | "numerical";
  questionText: string;
  options?: string[];
  value: string;
  answered: boolean;
  markedForReview: boolean;
}

const initialQuestions: Question[] = Array.from({ length: 180 }, (_, i) => {
  const id = i + 1;
  const subject =
    id <= 45
      ? "Physics"
      : id <= 90
      ? "Chemistry"
      : id <= 135
      ? "Mathematics"
      : "Biology";
  const type: "mcq" | "numerical" = Math.random() > 0.5 ? "mcq" : "numerical";
  const questionText = `This is a sample ${subject} question number ${id}. What is the capital of France? Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  const options =
    type === "mcq" ? ["Paris", "London", "Berlin", "Rome"] : undefined;

  return {
    id,
    subject,
    type,
    questionText,
    options,
    value: "",
    answered: false,
    markedForReview: false,
  };
});

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  const getQuestionCounts = useCallback(() => {
    const answered = questions.filter((q) => q.answered).length;
    const markedForReview = questions.filter(
      (q) => q.markedForReview && !q.answered
    ).length;
    const answeredAndMarked = questions.filter(
      (q) => q.markedForReview && q.answered
    ).length;
    const notVisited = questions.filter(
      (q) => !q.answered && !q.markedForReview && q.value === ""
    ).length;

    return {
      answered: answered,
      markedForReview: markedForReview + answeredAndMarked,
      notVisited: notVisited,
    };
  }, [questions]);

  const questionCounts = getQuestionCounts();

  const handleQuestionValueChange = (newValue: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === currentQuestionId
          ? { ...q, value: newValue, answered: newValue !== "" }
          : q
      )
    );
  };

  const handleNextQuestion = useCallback(
    (markForReview = false) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === currentQuestionId
            ? {
                ...q,
                markedForReview: markForReview
                  ? !q.markedForReview
                  : q.markedForReview,
              }
            : q
        )
      );

      const nextQuestion =
        currentQuestionId < questions.length
          ? currentQuestionId + 1
          : currentQuestionId;
      setCurrentQuestionId(nextQuestion);
    },
    [currentQuestionId, questions.length]
  );

  const handleSaveAndNext = useCallback(() => {
    handleNextQuestion(false);
  }, [handleNextQuestion]);

  const handleClearResponse = useCallback(() => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === currentQuestionId ? { ...q, value: "", answered: false } : q
      )
    );
  }, [currentQuestionId]);

  const handleMarkForReview = useCallback(() => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === currentQuestionId
          ? { ...q, markedForReview: !q.markedForReview }
          : q
      )
    );
  }, [currentQuestionId]);

  const handleSaveAndMarkForReview = useCallback(() => {
    handleNextQuestion(true);
  }, [handleNextQuestion]);

  const handleSubmitTest = useCallback(() => {
    alert("Test submitted!");
  }, []);

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-inter antialiased">
      {/* Mobile Header - visible only on mobile */}
      <div className="lg:hidden">
        <MobileHeader
          testName="JEE/NEET Mock Test"
          currentQuestion={currentQuestionId}
          totalQuestions={questions.length}
          onSubmitTest={handleSubmitTest}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-80 pt-4">
          <TestTimer
            className=""
            onTimeUp={handleSubmitTest}
            duration={10800}
          />
          <QuestionNavigation
            currentQuestion={currentQuestionId}
            questions={questions.map((q) => ({
              id: q.id,
              answered: q.answered,
              markedForReview: q.markedForReview,
            }))}
            onQuestionClick={setCurrentQuestionId}
            onSubjectChange={setSelectedSubject}
            selectedSubject={selectedSubject}
          />
        </div>
        <main className="overflow-auto pl-4 pr-2 lg:pl-6 lg:pr-2 mt-4">
          <QuestionDisplay
            questionNumber={currentQuestion.id}
            totalQuestions={questions.length}
            subject={currentQuestion.subject}
            type={currentQuestion.type}
            questionText={currentQuestion.questionText}
            options={currentQuestion.options}
            value={currentQuestion.value}
            onValueChange={handleQuestionValueChange}
          />
        </main>
        <aside className="w-72 mr-1 mt-4">
          <QuickActionsPanel
            answered={questionCounts.answered}
            markedForReview={questionCounts.markedForReview}
            notVisited={questionCounts.notVisited}
            onSaveAndNext={handleSaveAndNext}
            onClearResponse={handleClearResponse}
            onMarkForReview={handleMarkForReview}
            onSaveAndMarkForReview={handleSaveAndMarkForReview}
            onSubmitTest={handleSubmitTest}
          />
        </aside>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden flex-1 flex flex-col">
        {/* Mobile Timer - compact and centered */}
        <div className="md:hidden px-3 py-3 bg-white border-b border-gray-100 flex justify-center">
          <TestTimer
            onTimeUp={handleSubmitTest}
            duration={10800}
            isMobile={true}
          />
        </div>

        {/* Timer for tablet */}
        <div className="hidden md:block md:flex md:justify-center pt-2">
          <TestTimer
            onTimeUp={handleSubmitTest}
            duration={10800}
            className="scale-90"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-3 md:px-6 py-2">
          <QuestionDisplay
            questionNumber={currentQuestion.id}
            totalQuestions={questions.length}
            subject={currentQuestion.subject}
            type={currentQuestion.type}
            questionText={currentQuestion.questionText}
            options={currentQuestion.options}
            value={currentQuestion.value}
            onValueChange={handleQuestionValueChange}
            isMobile={true}
          />
        </main>

        {/* Mobile Actions */}
        <div className="md:hidden px-3 py-2 bg-white border-t border-gray-200">
          <QuickActionsPanel
            answered={questionCounts.answered}
            markedForReview={questionCounts.markedForReview}
            notVisited={questionCounts.notVisited}
            onSaveAndNext={handleSaveAndNext}
            onClearResponse={handleClearResponse}
            onMarkForReview={handleMarkForReview}
            onSaveAndMarkForReview={handleSaveAndMarkForReview}
            onSubmitTest={handleSubmitTest}
            isMobile={true}
          />
        </div>

        {/* Tablet Actions */}
        <div className="hidden md:block lg:hidden px-6 py-3 bg-white border-t border-gray-200">
          <QuickActionsPanel
            answered={questionCounts.answered}
            markedForReview={questionCounts.markedForReview}
            notVisited={questionCounts.notVisited}
            onSaveAndNext={handleSaveAndNext}
            onClearResponse={handleClearResponse}
            onMarkForReview={handleMarkForReview}
            onSaveAndMarkForReview={handleSaveAndMarkForReview}
            onSubmitTest={handleSubmitTest}
            isTablet={true}
          />
        </div>

        {/* Question Navigation - Mobile/Tablet */}
        <div className="px-3 md:px-6 pb-3">
          <QuestionNavigation
            currentQuestion={currentQuestionId}
            questions={questions.map((q) => ({
              id: q.id,
              answered: q.answered,
              markedForReview: q.markedForReview,
            }))}
            onQuestionClick={setCurrentQuestionId}
            onSubjectChange={setSelectedSubject}
            selectedSubject={selectedSubject}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
}
