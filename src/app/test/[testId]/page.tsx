"use client";

import React, { useState, useEffect, useCallback } from "react";
import TestHeader from "@/components/test-environment/test-header";
import TestTimer from "@/components/test-environment/test-timer";
import QuestionNavigation from "@/components/test-environment/question-navigation";
import QuestionDisplay from "@/components/test-environment/question-display";
import QuickActionsPanel from "@/components/test-environment/quick-actions-panel";

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

  const filteredQuestions = questions.filter((q) =>
    selectedSubject === "All Subjects" ? true : q.subject === selectedSubject
  );

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
    (markForReview: boolean = false) => {
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
          ? { ...q, markedForReview: !q.markedForReview } // Toggle markedForReview
          : q
      )
    );
  }, [currentQuestionId]);

  const handleSaveAndMarkForReview = useCallback(() => {
    handleNextQuestion(true);
  }, [handleNextQuestion]);

  const handleSubmitTest = useCallback(() => {
    alert("Test submitted!");
    // In a real application, you would send the test data to a server
  }, []);

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-inter antialiased">
      {/* <TestHeader
        testName="JEE/NEET Mock Test"
        durationInMinutes={180}
        onSubmitTest={handleSubmitTest}
        currentQuestion={currentQuestionId}
        totalQuestions={questions.length}
      /> */}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 pt-4">
          <TestTimer
            className=""
            onTimeUp={handleSubmitTest}
            duration={10800}
          />{" "}
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
            z
            notVisited={questionCounts.notVisited}
            onSaveAndNext={handleSaveAndNext}
            onClearResponse={handleClearResponse}
            onMarkForReview={handleMarkForReview}
            onSaveAndMarkForReview={handleSaveAndMarkForReview}
            onSubmitTest={handleSubmitTest}
          />
        </aside>
      </div>
    </div>
  );
}
