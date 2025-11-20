"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { apiService } from "@/services/weaknessApi";

interface Question {
  id: number;
  questionNumber: number;
  question: string;
  options: { label: string; value: string }[];
  imageUrl?: string;
}

export default function PracticeStartPage() {
  const router = useRouter();
  const params = useParams();
  const testInstanceId = params.testId as string;
  const [loading, setLoading] = useState(true);
  const [testName, setTestName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  // Selections are stored as { questionId: "selectedOptionLabel" }
  const [selections, setSelections] = useState<Record<number, string | null>>(
    {}
  );

  // --- REFS FOR TIMING AND INTERVALS ---
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track the last time a chunk of time was saved to the backend
  const lastTimeChunkSaved = useRef<number>(Date.now());

  const saveProgress = async () => {
    if (!isRunning || questions.length === 0) return;

    const timeSpentChunk = (Date.now() - lastTimeChunkSaved.current) / 1000;
    lastTimeChunkSaved.current = Date.now();

    const currentQuestionId = questions[currentIndex]?.id;
    if (!currentQuestionId) return;

    apiService.saveProgress(
      testInstanceId,
      currentQuestionId,
      selections[currentQuestionId] || null,
      timeSpentChunk
    );
  };

  useEffect(() => {
    if (!testInstanceId) return;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [testData, progressData] = await Promise.all([
          apiService.getAiTest(testInstanceId),
          apiService.getSavedProgress(testInstanceId),
        ]);

        setQuestions(testData.questions);
        setTestName(testData.testName);

        const initialSecondsLeft =
          testData.timeLimit - (progressData.totalTime || 0);
        setSecondsLeft(initialSecondsLeft > 0 ? initialSecondsLeft : 0);

        if (progressData.answers) {
          setSelections(progressData.answers);
        }

        setIsRunning(true);
        lastTimeChunkSaved.current = Date.now();
      } catch (error: any) {
        console.error("Failed to load test data:", error);
        toast.error(
          error.message || "Could not load your test. Please try again."
        );
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [testInstanceId, router]);

  useEffect(() => {
    if (!isRunning) return;

    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tickRef.current!);
          handleFinish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, handleFinish]);

  // Effect for Auto-Saving progress every 10 seconds
  useEffect(() => {
    if (!isRunning) return;

    autoSaveRef.current = setInterval(saveProgress, 10000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [isRunning, currentIndex, selections, saveProgress]);

  // --- UTILITY & DERIVED STATE ---
  const mmss = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secondsLeft % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  // --- EVENT HANDLERS ---
  const handleSelect = (optionLabel: string) => {
    if (!isRunning) return;
    const questionId = questions[currentIndex].id;

    setSelections((prev) => {
      const isNewSelection = !prev[questionId];
      return { ...prev, [questionId]: optionLabel };
    });
    // Don't wait for auto-save, save immediately on selection change for responsiveness.
    saveProgress();
  };

  const navigate = (direction: "prev" | "next") => {
    saveProgress(); // Save progress of current question before moving
    if (direction === "prev") {
      setCurrentIndex((i) => Math.max(0, i - 1));
    } else {
      setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
    }
  };

  // Final submission handler
  async function handleFinish() {
    if (!isRunning) return; // Prevent double submission
    setIsRunning(false); // Stop all timers

    toast.info("Submitting your test...");

    // Perform a final save to capture the last moments of time
    await saveProgress();

    try {
      // Call the specific submitDrill endpoint from the apiService
      await apiService.submitDrill(testInstanceId);
      // Redirect to the results page upon successful submission
      router.push(`/ai-results/${testInstanceId}`);
    } catch (e: any) {
      console.error("Failed to submit test:", e);
      toast.error(`Submission failed: ${e.message}`);
      setIsRunning(true); // Re-enable the test if submission fails
    }
  }

  // --- RENDER LOGIC ---
  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen container mx-auto flex items-center justify-center">
        <p className="text-lg animate-pulse">
          Loading your practice session...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentSelection = selections[currentQuestion.id] || null;

  const attemptedCount = Object.values(selections).filter(
    (selection) => selection !== null && selection !== undefined
  ).length;

  return (
    <div className="min-h-screen container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{testName}</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Time Left</p>
                <p className="text-2xl font-semibold tabular-nums">{mmss}</p>
              </div>
              <button
                onClick={handleFinish}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
              >
                Finish & Submit
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                Question {currentIndex + 1} / {questions.length}
              </p>
            </div>
            <h2 className="text-lg font-semibold mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>
            {currentQuestion.imageUrl && (
              <img
                src={currentQuestion.imageUrl}
                alt="Question figure"
                className="my-4 rounded-lg max-w-full h-auto"
              />
            )}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const selected = currentSelection === opt.label;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt.label)}
                    disabled={!isRunning}
                    className={`w-full text-left border rounded-lg px-4 py-3 transition-all duration-150 flex items-start
                    ${
                      selected
                        ? "bg-orange-500 text-white border-orange-500 font-semibold"
                        : "bg-white hover:bg-gray-50 border-gray-300"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <span className="mr-3 font-bold">{opt.label}.</span>
                    <span>{opt.value}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-6 border-t pt-4">
              <button
                onClick={() => navigate("prev")}
                className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={() => navigate("next")}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Live Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Attempted</span>
                <span className="font-medium">
                  {Math.max(0, questions.length - attemptedCount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unattempted</span>
                <span className="font-medium">
                  {questions.length - attemptedCount}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p className="font-semibold text-sm">Tip</p>
            <p className="text-sm mt-1">
              Your progress is saved automatically. You can safely refresh the
              page or come back later to continue.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
