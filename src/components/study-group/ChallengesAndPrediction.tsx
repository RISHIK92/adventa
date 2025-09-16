"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Target,
  Users,
  Clock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar,
  Zap,
  Ghost,
  Award,
  Settings,
  Send,
  Loader2,
  ClipboardList,
  Check,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiService,
  CreateChallengePayload,
  SubjectWithOptions,
  Challenge,
  SubmitPredictionPayload,
} from "@/services/weaknessApi";
import { useRouter } from "next/navigation";

interface Prediction {
  id: string;
  challenge: string;
  value: number;
  confidence: number;
  locked: boolean;
}
interface GhostSession {
  id: string;
  performer: string;
  score: number;
  timestamps: number[];
  strategy: string[];
}

export default function ChallengesAndPrediction({
  studyRoomId,
}: {
  studyRoomId: string;
}) {
  const [activeTab, setActiveTab] = useState("challenges");
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const [ghostSessions, setGhostSessions] = useState<GhostSession[]>([
    {
      id: "1",
      performer: "Alex Rodriguez",
      score: 95,
      timestamps: [5, 12, 18, 25, 32, 40],
      strategy: [
        "Tackled easiest questions first",
        "Spent most time on problem 4",
        "Used elimination method",
      ],
    },
  ]);

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("");
  const [predictedCount, setPredictedCount] = useState<number>(0);
  const [confidence, setConfidence] = useState<number[]>([70]);
  const [isSubmittingPrediction, setIsSubmittingPrediction] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);

  // --- Live Data State ---
  const [challengeOptions, setChallengeOptions] = useState<
    SubjectWithOptions[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [takingId, setTakingId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<{
    id: string;
    type: "accept" | "take";
  } | null>(null);

  const initialChallengeState = {
    title: "",
    challengeType: "topic" as "topic" | "subject",
    subjectId: "",
    topicId: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    timeLimit: 30,
    questionCount: 6 as 3 | 6 | 9 | 12 | 15,
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [newChallenge, setNewChallenge] = useState(initialChallengeState);
  const router = useRouter();

  const fetchChallenges = useCallback(async () => {
    if (!studyRoomId) return;
    try {
      setLoading(true);
      const fetchedData = await apiService.getChallenges(studyRoomId);
      setChallenges(fetchedData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load challenges.");
      toast.error(err.message || "Failed to load challenges.");
    } finally {
      setLoading(false);
    }
  }, [studyRoomId]);

  useEffect(() => {
    if (showCreateChallenge) {
      const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
          const data = await apiService.getChallengeOptions(studyRoomId);
          setChallengeOptions(data);
        } catch (error: any) {
          toast.error("Failed to load topics/subjects: " + error.message);
          // setShowCreateChallenge(false); // Close modal if options fail to load
        } finally {
          setLoadingOptions(false);
        }
      };
      fetchOptions();
    }
  }, [showCreateChallenge, studyRoomId]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // --- Event Handlers ---
  const handleCreateChallenge = async () => {
    // Validation
    if (!newChallenge.title) return toast.error("Please enter a title.");
    if (newChallenge.challengeType === "topic" && !newChallenge.topicId)
      return toast.error("Please select a topic.");
    if (newChallenge.challengeType === "subject" && !newChallenge.subjectId)
      return toast.error("Please select a subject.");

    const payload: CreateChallengePayload = {
      title: newChallenge.title,
      challengeType: newChallenge.challengeType,
      typeId: Number(
        newChallenge.challengeType === "topic"
          ? newChallenge.topicId
          : newChallenge.subjectId
      ),
      difficulty: newChallenge.difficulty,
      timeLimit: newChallenge.timeLimit,
      questionCount: newChallenge.questionCount,
    };

    setIsCreating(true);
    try {
      await apiService.createChallenge(studyRoomId, payload);
      toast.success("Challenge created successfully!");
      setShowCreateChallenge(false);
      setNewChallenge(initialChallengeState);
      await fetchChallenges(); // Refresh the list
    } catch (error: any) {
      toast.error("Failed to create challenge: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const challengesForPrediction = challenges.filter(
    (c) => c.userStatus === "ACCEPTED" && !c.userPrediction
  );

  const completedPredictions = challenges.filter((c) => c.userPrediction);

  const handleSubmitPrediction = async () => {
    if (!selectedChallengeId) {
      toast.error("Please select a challenge to predict.");
      return;
    }

    const payload: SubmitPredictionPayload = {
      predictedScore: predictedCount,
      confidence: confidence[0],
    };

    setIsSubmittingPrediction(true);
    try {
      await apiService.submitPrediction(selectedChallengeId, payload);
      toast.success("Prediction submitted and locked!");
      setSelectedChallengeId(""); // Reset form
      setPredictedCount(0);
      await fetchChallenges(); // Refresh data to show new prediction
    } catch (error: any) {
      toast.error(error.message || "Failed to submit prediction.");
    } finally {
      setIsSubmittingPrediction(false);
    }
  };

  const selectedChallengeDetails = challenges.find(
    (c) => c.id === selectedChallengeId
  );
  const totalQuestionsForPrediction =
    selectedChallengeDetails?.totalQuestions || 0;

  const handleViewResults = (testInstanceId: string) => {
    toast.info("Navigating to results...");
    router.push(`/challenge-results/${testInstanceId}`);
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    setActionState({ id: challengeId, type: "accept" });
    try {
      await apiService.acceptChallenge(challengeId);
      toast.success("Challenge accepted! You can now take the test.");
      await fetchChallenges();
    } catch (error: any) {
      toast.error("Failed to accept challenge: " + error.message);
    } finally {
      setActionState(null);
    }
  };

  const renderChallengeActions = (challenge: Challenge) => {
    const isLoadingAccept =
      actionState?.id === challenge.id && actionState?.type === "accept";
    const isLoadingTake =
      actionState?.id === challenge.id && actionState?.type === "take";

    if (challenge.userStatus === "COMPLETED") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewResults(challenge.userTestInstanceId!)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View Results
        </Button>
      );
    }

    if (challenge.userStatus === "ACCEPTED") {
      return (
        <Button
          size="sm"
          className="bg-[#fe7244] hover:bg-[#fe7244]/90"
          onClick={() => handleTakeChallengeNow(challenge.id)}
          disabled={isLoadingTake}
        >
          {isLoadingTake ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-1" />
          )}
          Take Now
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAcceptChallenge(challenge.id)}
        disabled={isLoadingAccept}
      >
        {isLoadingAccept ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4 mr-1" />
        )}
        Accept
      </Button>
    );
  };

  const handleTakeChallengeNow = async (challengeId: string) => {
    setTakingId(challengeId);
    try {
      const response = await apiService.startChallenge(challengeId);
      const { testInstanceId } = response;

      if (testInstanceId) {
        toast.success("Starting challenge...");
        router.push(`/group-challenge/${testInstanceId}`);
      } else {
        throw new Error("Could not retrieve the test instance ID.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to start the challenge.");
    } finally {
      setTakingId(null);
    }
  };

  const availableTopics =
    challengeOptions.find((s) => s.id === Number(newChallenge.subjectId))
      ?.topics || [];
  const questionCountOptions =
    newChallenge.challengeType === "topic" ? [3, 6, 9, 12] : [1, 3, 6, 9, 15];

  const toggleGhostPlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info("Ghost playback started");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + playbackSpeed;
          if (newTime >= 45) {
            setIsPlaying(false);
            return 45;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Challenges & Predictions
          </h2>
          <p className="text-sm text-[#7d7e80]">
            Compete, predict, and learn from top performers
          </p>
        </div>
        <Button
          onClick={() => setShowCreateChallenge(true)}
          className="bg-[#fe7244] hover:bg-[#fe7244]/90"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="ghost" className="flex items-center gap-2">
            <Ghost className="w-4 h-4" />
            Ghost Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : challenges.length === 0 ? (
            <Card className="text-center p-8 text-gray-500">
              No active challenges. Why not create one?
            </Card>
          ) : (
            challenges.map((challenge) => (
              <Card key={challenge.id} className="bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {challenge.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {challenge.topic}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {challenge.timeLimit}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {challenge.participantCount} participants
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        challenge.difficulty === "HARD"
                          ? "destructive"
                          : challenge.difficulty === "MEDIUM"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#7d7e80]">
                      Created by {challenge.creator} • Deadline:{" "}
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {renderChallengeActions(challenge)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Submit Prediction
              </CardTitle>
              <CardDescription>
                Predict your score for a challenge you've accepted. This locks
                once you start the test.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challengesForPrediction.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label>Select an Accepted Challenge</Label>
                    <Select
                      value={selectedChallengeId}
                      onValueChange={setSelectedChallengeId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select from your accepted challenges..." />
                      </SelectTrigger>
                      <SelectContent>
                        {challengesForPrediction.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Predicted Questions Correct:{" "}
                      <span className="font-bold text-[#fe7244]">
                        {predictedCount} / {totalQuestionsForPrediction}
                      </span>
                    </Label>
                    <Slider
                      value={[predictedCount]}
                      onValueChange={(value) => setPredictedCount(value[0])}
                      max={totalQuestionsForPrediction}
                      step={1}
                      disabled={!selectedChallengeId}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Confidence:{" "}
                      <span className="font-bold text-[#fe7244]">
                        {confidence[0]}%
                      </span>
                    </Label>
                    <Slider
                      value={confidence}
                      onValueChange={setConfidence}
                      max={100}
                      step={5}
                      disabled={!selectedChallengeId}
                    />
                  </div>
                  <Button
                    onClick={handleSubmitPrediction}
                    disabled={!selectedChallengeId || isSubmittingPrediction}
                    className="w-full bg-[#fe7244] hover:bg-[#fe7244]/90"
                  >
                    {isSubmittingPrediction && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Submit & Lock Prediction
                  </Button>
                </>
              ) : (
                <div className="text-center text-gray-500 p-4">
                  Accept a challenge to make a prediction.
                </div>
              )}
            </CardContent>
          </Card>

          {completedPredictions.length > 0 && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Your Locked Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedPredictions.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{challenge.title}</p>
                        <p className="text-sm text-[#7d7e80]">
                          Predicted: {challenge.userPrediction?.score}Q
                          (Confidence: {challenge.userPrediction?.confidence}
                          %)
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ghost" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ghost className="w-5 h-5" />
                Ghost Playback Controls
              </CardTitle>
              <CardDescription>
                Watch and learn from top performers' strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/avatars/ghost.jpg" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Rodriguez</p>
                    <p className="text-sm text-[#7d7e80] flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      95% Score • Top Performer
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Available</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Playback Progress</Label>
                  <span className="text-sm text-[#7d7e80]">
                    {Math.floor(currentTime / 60)}:
                    {(currentTime % 60).toString().padStart(2, "0")} / 45:00
                  </span>
                </div>
                <Progress value={(currentTime / 45) * 100} className="w-full" />
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleGhostPlayback}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                      {playbackSpeed}x
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div className="space-y-2">
                      <Label className="text-sm">Speed</Label>
                      {[0.5, 1, 1.5, 2].map((speed) => (
                        <Button
                          key={speed}
                          variant={
                            playbackSpeed === speed ? "default" : "ghost"
                          }
                          size="sm"
                          className="w-full"
                          onClick={() => setPlaybackSpeed(speed)}
                        >
                          {speed}x
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Strategy Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm">
                    {ghostSessions[0]?.strategy.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Zap className="w-3 h-3 mt-0.5 text-[#fe7244] flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4 bg-white">
            <CardHeader>
              <CardTitle>Create New Challenge</CardTitle>
              <CardDescription>
                Set up a challenge for your group
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOptions ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <Tabs
                  value={newChallenge.challengeType}
                  onValueChange={(value) =>
                    setNewChallenge((prev) => ({
                      ...prev,
                      challengeType: value as "topic" | "subject",
                      subjectId: "",
                      topicId: "",
                    }))
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="topic">By Topic</TabsTrigger>
                    <TabsTrigger value="subject">By Subject</TabsTrigger>
                  </TabsList>
                  <TabsContent value="topic" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select
                        value={newChallenge.subjectId}
                        onValueChange={(value) =>
                          setNewChallenge((prev) => ({
                            ...prev,
                            subjectId: value,
                            topicId: "",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject..." />
                        </SelectTrigger>
                        <SelectContent>
                          {challengeOptions.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Select
                        value={newChallenge.topicId}
                        onValueChange={(value) =>
                          setNewChallenge((prev) => ({
                            ...prev,
                            topicId: value,
                          }))
                        }
                        disabled={!newChallenge.subjectId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select topic..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTopics.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="subject" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select
                        value={newChallenge.subjectId}
                        onValueChange={(value) =>
                          setNewChallenge((prev) => ({
                            ...prev,
                            subjectId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject..." />
                        </SelectTrigger>
                        <SelectContent>
                          {challengeOptions.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="challenge-title">Title</Label>
                  <Input
                    id="challenge-title"
                    value={newChallenge.title}
                    onChange={(e) =>
                      setNewChallenge((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g., Kinematics Sprint Challenge"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={newChallenge.difficulty}
                      onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                        setNewChallenge((prev) => ({
                          ...prev,
                          difficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Limit (min)</Label>
                    <Input
                      type="number"
                      value={newChallenge.timeLimit}
                      onChange={(e) =>
                        setNewChallenge((prev) => ({
                          ...prev,
                          timeLimit: parseInt(e.target.value),
                        }))
                      }
                      min="5"
                      max="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Questions</Label>
                    <Select
                      value={String(newChallenge.questionCount)}
                      onValueChange={(value) =>
                        setNewChallenge((prev) => ({
                          ...prev,
                          questionCount: Number(value) as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questionCountOptions.map((qc) => (
                          <SelectItem key={qc} value={String(qc)}>
                            {qc} Questions
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateChallenge(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#fe7244] hover:bg-[#fe7244]/90"
                  onClick={handleCreateChallenge}
                  disabled={isCreating}
                >
                  {isCreating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
