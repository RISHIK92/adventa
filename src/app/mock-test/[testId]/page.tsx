"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import TestTimer from "@/components/test-environment/test-timer";
import QuestionNavigation from "@/components/test-environment/question-navigation";
import QuestionDisplay from "@/components/test-environment/question-display";
import QuickActionsPanel from "@/components/test-environment/quick-actions-panel";
import MobileHeader from "@/components/test-environment/mobile-header";
import { Loader2, AlertCircle } from "lucide-react";
import { apiService } from "@/services/weaknessApi";

// The frontend's question state interface
interface Question {
  id: number; // This is the actual question ID from the database
  questionNumber: number; // This is the sequential order (1, 2, 3...)
  subject: string;
  type: "mcq" | "numerical";
  questionText: string;
  options?: { label: string; value: string }[];
  imageUrl?: string;
  value: string;
  answered: boolean;
  markedForReview: boolean;
}

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const [timerDuration, setTimerDuration] = useState<number | null>(null);

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const testInstanceId = params.testId as string;

  // Ref to track the time when a user lands on a question
  const questionStartTime = useRef<number>(Date.now());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const questionsRef = useRef(questions);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // --- Data Fetching and Initialization Effect ---
  useEffect(() => {
    if (!testInstanceId) {
      setError("Test ID is missing from URL.");
      setLoading(false);
      return;
    }

    const loadTest = async () => {
      try {
        // Fetch test data and any saved progress in parallel
        const [testData, savedProgress] = await Promise.all([
          apiService.getPyqTestData(testInstanceId),
          apiService.getSavedMarkProgress(testInstanceId),
        ]);

        setTimerDuration(testData.timeLimit);

        // Process saved progress into a quick-lookup map
        const progressMap = new Map();
        if (savedProgress && savedProgress.answers) {
          Object.entries(savedProgress.answers).forEach(
            ([qId, data]: [string, any]) => {
              progressMap.set(parseInt(qId, 10), {
                answer: data.answer,
                markedForReview: data.markedForReview || false,
              });
            }
          );
        }

        // Transform API questions into the frontend state shape
        const formattedQuestions: Question[] = testData.questions.map(
          (q: any) => {
            const progress = progressMap.get(q.id);
            const answer = progress?.answer || "";
            return {
              id: q.id,
              questionNumber: q.questionNumber,
              questionText: q.question,
              options: q.options,
              imageUrl: q.imageUrl,
              subject: q.subject,
              type: q.options && q.options.length > 0 ? "mcq" : "numerical",
              value: answer,
              answered: answer !== "",
              markedForReview: progress?.markedForReview || false,
            };
          }
        );

        setQuestions(formattedQuestions);
        // Set the current question to the first one if not set
        if (formattedQuestions.length > 0) {
          setCurrentQuestionId(formattedQuestions[0].id);
        }

        // Set the timer, adjusting for time already spent
        const timeSpent = savedProgress?.totalTime || 0;
        setTimerDuration(testData.timeLimit - timeSpent);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load test data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [testInstanceId]);

  const saveProgress = useCallback(
    async (questionToSave: Question | undefined | null) => {
      if (!questionToSave) return;

      const timeSpentChunk = (Date.now() - questionStartTime.current) / 1000;

      // Only save if there's meaningful time spent
      if (timeSpentChunk > 0.1) {
        try {
          await apiService.saveMarkProgress(
            testInstanceId,
            questionToSave.id,
            questionToSave.value || null,
            questionToSave.markedForReview,
            timeSpentChunk
          );
          // Reset the timer *after* a successful save
          questionStartTime.current = Date.now();
        } catch (error) {
          console.error("Failed to save progress:", error);
        }
      }
    },
    [testInstanceId]
  );

  useEffect(() => {
    // Clean up any existing interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Set up a new interval to save progress every 10 seconds
    intervalRef.current = setInterval(() => {
      const currentQ = questionsRef.current.find(
        (q) => q.id === currentQuestionId
      );
      saveProgress(currentQ);
    }, 10000); // 10 seconds
  }, [currentQuestionId, saveProgress]);

  // Find the full question object based on the current ID
  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  const handleQuestionValueChange = (newValue: string) => {
    if (!currentQuestion) return;

    const updatedQuestion = {
      ...currentQuestion,
      value: newValue,
      answered: newValue !== "",
    };

    // Update state immediately for a responsive UI
    setQuestions((prev) =>
      prev.map((q) => (q.id === currentQuestionId ? updatedQuestion : q))
    );

    // Save this change immediately
    saveProgress(updatedQuestion);
  };

  const changeQuestion = (newQuestionId: number) => {
    // Save progress for the question we're leaving
    saveProgress(currentQuestion);
    // Set the new question ID
    setCurrentQuestionId(newQuestionId);
    // Reset the start time for the new question
    questionStartTime.current = Date.now();
  };

  // --- Memoized Question Counts for Performance ---
  const questionCounts = React.useMemo(() => {
    return questions.reduce(
      (acc, q) => {
        if (q.answered) acc.answered++;
        if (q.markedForReview) acc.markedForReview++;
        if (!q.answered && !q.markedForReview) acc.notAnswered++;
        return acc;
      },
      {
        answered: 0,
        markedForReview: 0,
        notAnswered: 0,
        notVisited: questions.length,
      }
    );
  }, [questions]);

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const currentIndex = questions.findIndex(
      (q) => q.id === currentQuestion.id
    );
    if (currentIndex < questions.length - 1) {
      changeQuestion(questions[currentIndex + 1].id);
    } else {
      saveProgress(currentQuestion);
    }
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const updatedQuestion = {
      ...currentQuestion,
      value: "",
      answered: false,
    };
    setQuestions((prev) =>
      prev.map((q) => (q.id === currentQuestionId ? updatedQuestion : q))
    );
    // Save the cleared response immediately
    saveProgress(updatedQuestion);
  };

  const handleMarkForReview = () => {
    if (!currentQuestion) return;
    const updatedQuestion = {
      ...currentQuestion,
      markedForReview: !currentQuestion.markedForReview,
    };
    setQuestions((prev) =>
      prev.map((q) => (q.id === currentQuestionId ? updatedQuestion : q))
    );
    // Save the change in review status immediately
    saveProgress(updatedQuestion);
  };

  const handleSaveAndMarkForReview = () => {
    if (!currentQuestion) return;
    const updatedQuestion = {
      ...currentQuestion,
      markedForReview: true,
    };
    setQuestions((prev) =>
      prev.map((q) => (q.id === currentQuestionId ? updatedQuestion : q))
    );
    // Save and then move to the next question
    saveProgress(updatedQuestion).then(() => {
      handleSaveAndNext();
    });
  };

  const handleSubmitTest = useCallback(async () => {
    try {
      await saveProgress(currentQuestion);

      await apiService.submitPyqTest(testInstanceId);
      router.push(`/pyq-results/${testInstanceId}`);
    } catch (err) {
      alert("Failed to submit test. Please try again.");
      console.error(err);
    }
  }, [testInstanceId, router, saveProgress, currentQuestion]);

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-inter antialiased">
      {/* Mobile Header - visible only on mobile */}
      <div className="lg:hidden">
        <MobileHeader
          testName="JEE/NEET Mock Test"
          currentQuestion={currentQuestion.questionNumber}
          totalQuestions={questions.length}
          onSubmitTest={handleSubmitTest}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-80 pt-4">
          <TestTimer
            key={timerDuration}
            onTimeUp={handleSubmitTest}
            duration={timerDuration} // Pass the state variable
          />
          <QuestionNavigation
            currentQuestion={currentQuestion?.id ?? 0}
            questions={questions.map((q) => ({
              id: q.id,
              number: q.questionNumber,
              subject: q.subject,
              answered: q.answered,
              markedForReview: q.markedForReview,
            }))}
            onQuestionClick={changeQuestion}
            onSubjectChange={setSelectedSubject}
            selectedSubject={selectedSubject}
          />
        </div>
        <main className="overflow-auto pl-4 pr-2 lg:pl-6 lg:pr-2 mt-4">
          <QuestionDisplay
            questionNumber={currentQuestion.questionNumber}
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
            questionNumber={currentQuestion.questionNumber}
            totalQuestions={questions.length}
            subject={currentQuestion.subject}
            type={currentQuestion.type}
            questionText={currentQuestion.questionText}
            imageUrl={currentQuestion.imageUrl}
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
            currentQuestion={currentQuestion.id}
            questions={questions.map((q) => ({
              id: q.id,
              number: q.questionNumber,
              answered: q.answered,
              subject: q.subject,
              markedForReview: q.markedForReview,
            }))}
            onQuestionClick={changeQuestion}
            onSubjectChange={setSelectedSubject}
            selectedSubject={selectedSubject}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
}
