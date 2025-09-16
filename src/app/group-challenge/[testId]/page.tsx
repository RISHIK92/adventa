"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Users,
  CheckCircle,
  Circle,
  Flag,
  Ghost,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  Trophy,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/weaknessApi";
import { useParams, useRouter } from "next/navigation";

interface Question {
  id: number;
  questionNumber: number;
  subject: string;
  type: "mcq" | "numerical";
  text: string;
  options: { label: string; value: string }[];
  imageUrl?: string;
}

interface Participant {
  rank: number;
  userId: string;
  name: string;
  attemptedCount: number;
}

interface QuestionStatus {
  answered: boolean;
  marked: boolean;
  visited: boolean;
  selectedAnswer: string | null;
}

type TestPhase = "waiting" | "active" | "submitted";

export default function LiveTestRoom() {
  const params = useParams();
  const testInstanceId = params.testId as string;
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [countdownToStart, setCountdownToStart] = useState(30);

  const [questions, setQuestions] = useState<Question[]>([]);

  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);
  const [phase, setPhase] = useState<TestPhase>("active");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<number, QuestionStatus>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testName, setTestName] = useState("Challenge");

  const [liveLeaderboardData, setLiveLeaderboardData] = useState<Participant[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionStartTime = useRef<number>(Date.now());

  const [initialDuration, setInitialDuration] = useState(3600);
  const [challengeId, setChallengeId] = useState<string>("");

  // FIX 1: This state was unused. We can remove it and use liveLeaderboardData for all participant lists.
  // const [participants] = useState<Participant[]>([]);

  useEffect(() => {
    const loadChallengeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [details, progress] = await Promise.all([
          apiService.getChallengeTestDetails(testInstanceId),
          apiService.getSavedMarkProgress(testInstanceId),
        ]);

        if (!details.questions || details.questions.length === 0) {
          throw new Error("This challenge contains no questions.");
        }

        setTestName(details.name || "Challenge");
        setQuestions(details.questions);
        setInitialDuration(details.timeLimit);
        setTimeRemaining(details.timeLimit - (progress.totalTime || 0));
        setChallengeId(details.challengeId);

        const initialStatuses: Record<number, QuestionStatus> = {};
        const questionIdToIndexMap = new Map(
          details.questions.map((q, index) => [q.id, index])
        );

        details.questions.forEach((_, index) => {
          initialStatuses[index] = {
            answered: false,
            marked: false,
            visited: index === 0,
            selectedAnswer: null,
          };
        });

        if (progress?.answers) {
          for (const [qId, data] of Object.entries(progress.answers)) {
            const index = questionIdToIndexMap.get(Number(qId));
            if (index !== undefined) {
              initialStatuses[index] = {
                selectedAnswer: data.answer,
                answered: !!data.answer,
                marked: data.markedForReview,
                visited: true,
              };
            }
          }
        }
        setQuestionStatuses(initialStatuses);
      } catch (err: any) {
        if (err.message === "This test has already been completed.") {
          toast.info(
            "You have already completed this test. Redirecting to dashboard."
          );
          router.push("/dashboard");
        } else {
          setError(err.message || "Failed to load challenge data.");
          toast.error(err.message || "Failed to load challenge data.");
        }
      } finally {
        setLoading(false);
      }
    };
    console.log(testInstanceId);
    loadChallengeData();
  }, [testInstanceId]);

  // Timer effects
  useEffect(() => {
    if (phase === "waiting" && countdownToStart > 0) {
      const timer = setTimeout(() => {
        setCountdownToStart((prev) => {
          if (prev <= 1) {
            setPhase("active");
            toast.success("Test started! Good luck!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, countdownToStart]);

  useEffect(() => {
    if (phase === "active" && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "active" && timeRemaining === 0) {
      handleSubmit();
    }
  }, [phase, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const saveProgress = useCallback(
    async (
      statusesToSave: Record<number, QuestionStatus>,
      indexToSave: number
    ) => {
      if (phase !== "active") return;

      const question = questions[indexToSave];
      const status = statusesToSave[indexToSave];
      if (!question || !status) return;

      const timeSpentChunk = (Date.now() - questionStartTime.current) / 1000;

      try {
        apiService.saveMarkProgress(
          testInstanceId,
          question.id,
          status.selectedAnswer,
          status.marked,
          timeSpentChunk
        );
        questionStartTime.current = Date.now(); // Reset timer for the next chunk
      } catch (error) {
        toast.error("Failed to save progress. Check your connection.");
        console.error("Save progress error:", error);
      }
    },
    [testInstanceId, questions, phase]
  );

  // --- HANDLERS ---
  const handleAnswerSelect = (optionValue: string) => {
    if (phase !== "active") return;
    const newStatuses = {
      ...questionStatuses,
      [currentQuestionIndex]: {
        ...questionStatuses[currentQuestionIndex],
        answered: true,
        visited: true,
        selectedAnswer: optionValue,
      },
    };
    setQuestionStatuses(newStatuses);
    saveProgress(newStatuses, currentQuestionIndex);
  };

  const handleMarkForReview = () => {
    if (phase !== "active") return;
    const newStatuses = {
      ...questionStatuses,
      [currentQuestionIndex]: {
        ...questionStatuses[currentQuestionIndex],
        marked: !questionStatuses[currentQuestionIndex].marked,
        visited: true,
      },
    };
    setQuestionStatuses(newStatuses);
    saveProgress(newStatuses, currentQuestionIndex);
  };

  const navigateToQuestion = (index: number) => {
    if (
      phase !== "active" ||
      index < 0 ||
      index >= questions.length ||
      index === currentQuestionIndex
    )
      return;

    // Save progress of the question we are leaving
    saveProgress(questionStatuses, currentQuestionIndex);

    const newStatuses = {
      ...questionStatuses,
      [index]: { ...questionStatuses[index], visited: true },
    };
    setQuestionStatuses(newStatuses);
    setCurrentQuestionIndex(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (phase !== "active") return;
    setIsSubmitting(true);
    toast.loading("Submitting your test...");

    try {
      await saveProgress(questionStatuses, currentQuestionIndex);
      await apiService.submitChallenge(challengeId);

      toast.dismiss();
      toast.success("Challenge submitted successfully!");
      setPhase("submitted");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to submit test.");
      setIsSubmitting(false);
    }
  }, [
    phase,
    testInstanceId,
    saveProgress,
    questionStatuses,
    currentQuestionIndex,
    challengeId,
  ]);

  const getQuestionStatusColor = (index: number) => {
    const status = questionStatuses[index];
    if (index === currentQuestionIndex) return "bg-[#fe7244] text-[#ffffff]";
    if (status?.answered) return "bg-[#2dd4bf] text-[#ffffff]";
    if (status?.marked) return "bg-[#f5b041] text-[#ffffff]";
    if (status?.visited) return "bg-white text-[#7d7e80]";
    return "bg-gray-200 text-gray-600";
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentStatus = questionStatuses[currentQuestionIndex];
  const answeredCount = Object.values(questionStatuses).filter(
    (s) => s?.answered
  ).length;
  const markedCount = Object.values(questionStatuses).filter(
    (s) => s?.marked
  ).length;

  if (phase === "waiting") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    Algorithm Challenge
                  </CardTitle>
                  <p className="text-[#7d7e80]">Synchronous Mock Test</p>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Wifi className="h-5 w-5 text-[#2dd4bf]" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-[#ef4444]" />
                  )}
                  <Badge variant="outline">Live</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Waiting Room Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Test Details */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Test Starting In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#fe7244] mb-2">
                    {formatTime(countdownToStart)}
                  </div>
                  <p className="text-[#7d7e80]">Get ready to begin</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#7d7e80]">Duration</span>
                    {/* FIX: Use initialDuration state for dynamic data */}
                    <span className="font-medium">
                      {initialDuration / 60} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7d7e80]">Questions</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7d7e80]">Type</span>
                    <span className="font-medium">Multiple Choice</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Label htmlFor="ready-toggle" className="font-medium">
                    I'm ready to start
                  </Label>
                  <Switch
                    id="ready-toggle"
                    checked={isReady}
                    onCheckedChange={setIsReady}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {/* FIX: Use liveLeaderboardData to show participant count */}
                  Participants ({liveLeaderboardData.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* FIX: Render the fetched participants list */}
                  {liveLeaderboardData.map((participant) => (
                    <div
                      key={participant.userId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#7d7e80]" />
                        <span className="font-medium">{participant.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* A message for when no one else has joined yet */}
                {liveLeaderboardData.length === 0 && (
                  <p className="text-center text-[#7d7e80] mt-4">
                    Waiting for other participants...
                  </p>
                )}
                <Separator className="my-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "submitted") {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="bg-white max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-[#2dd4bf] mx-auto" />
            <h2 className="text-2xl font-semibold">Test Submitted!</h2>
            <p className="text-[#7d7e80]">
              Your answers have been saved. Results will be available shortly.
            </p>
            <Button
              className="w-full"
              onClick={() =>
                router.push(`/challenge-results/${testInstanceId}`)
              }
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-[#2dd4bf]" />
                ) : (
                  <WifiOff className="h-4 w-4 text-[#ef4444]" />
                )}
                <span className="font-medium">{testName}</span>
              </div>

              <Badge variant="outline">Live</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-medium">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                variant="destructive"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Question Card */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="ghost-mode" className="text-sm">
                        Ghost Mode
                      </Label>
                      <Switch
                        id="ghost-mode"
                        checked={ghostMode}
                        onCheckedChange={setGhostMode}
                      />
                      {ghostMode && (
                        <Ghost className="h-4 w-4 text-[#7d7e80]" />
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {currentQuestion ? (
                  <>
                    <div className="text-lg leading-relaxed">
                      {currentQuestion.questionText}
                    </div>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-md border-2 cursor-pointer transition-colors ${
                            currentStatus?.selectedAnswer === option.label
                              ? "border-orange-500 bg-orange-500/5"
                              : "border-gray-200 hover:border-orange-500/50"
                          }`}
                          onClick={() => handleAnswerSelect(option.label)}
                        >
                          {option.label}: {option.value}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Loading question...</p>
                )}
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={handleMarkForReview}>
                    <Flag className="h-4 w-4 mr-2" />
                    {currentStatus?.marked ? "Unmark" : "Mark for Review"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft /> Previous
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                    >
                      Next <ChevronRight />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Navigation Grid */}
            <Card className="bg-[#f7f7f7]">
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-2 mb-4">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToQuestion(index)}
                      className={`relative aspect-square rounded-md text-sm font-medium transition-colors ${getQuestionStatusColor(
                        index
                      )}`}
                    >
                      {index + 1}
                      {ghostMode && questionStatuses[index]?.answered && (
                        <div className="absolute inset-0 bg-[#fe7244]/20 rounded-md" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-[#7d7e80]">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#2dd4bf] rounded-sm" />
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* FIX: Color was red-500, but legend in getQuestionStatusColor uses f5b041 */}
                      <div className="w-3 h-3 bg-[#f5b041] rounded-sm" />
                      <span>Marked ({markedCount})</span>
                    </div>
                  </div>

                  <div>
                    Progress:{" "}
                    {questions.length > 0
                      ? Math.round((answeredCount / questions.length) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Test Progress */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>
                      {answeredCount}/{questions.length}
                    </span>
                  </div>
                  <Progress
                    value={
                      questions.length > 0
                        ? (answeredCount / questions.length) * 100
                        : 0
                    }
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7d7e80]">Time used</span>
                    <span>{formatTime(initialDuration - timeRemaining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7d7e80]">Avg. per question</span>
                    <span>
                      {formatTime(
                        questions.length > 0
                          ? Math.floor(
                              (initialDuration - timeRemaining) /
                                Math.max(answeredCount, 1)
                            )
                          : 0
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
