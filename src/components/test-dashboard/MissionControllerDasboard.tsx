"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Goal,
  Component,
  PanelsTopLeft,
  PanelTop,
  LayoutDashboard,
  Dot,
  Loader,
  SquareMenu,
  PanelLeftOpen,
  SquareActivity,
  Bot,
  Send,
  Calendar,
  BarChart3,
  Sparkles,
  Clock,
  TrendingUp,
  MessageCircle,
  Zap,
  BookOpen,
  Target,
  Brain,
  FileText,
  RefreshCw,
  AlertTriangle,
  Trophy,
  Play,
  Users,
  Rocket,
  User,
  Pen,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/weaknessApi";

interface MissionCard {
  id: string;
  title: string;
  subject: string;
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
  coinReward: number;
  completed: boolean;
  icon: React.ReactNode;
}

interface TestCenterTile {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "weaknesses" | "mock" | "custom" | "challenge";
}

interface UserStats {
  streak: number;
  coins: number;
  dailyGoal: number;
  dailyProgress: number;
  weeklyData: number[];
  accuracyTrend: number[];
  rank: number;
  friends: { name: string; score: number; avatar: string }[];
}

interface AIRecommendation {
  id: string;
  type: "daily" | "weekly";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime?: number;
  icon: React.ReactNode;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  avatar?: string;
}

interface TestType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "mock" | "practice" | "review" | "assessment";
  stats?: {
    available?: number;
    topics?: number;
    duration?: string;
    difficulty?: string;
  };
  features?: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
}

interface RecommendStudyParams {
  topicId: number;
  contentName: string;
  studyLink: string | null;
  details: string;
}

interface RecommendTestParams {
  testType: "quiz" | "drill";
  topicIds: number[];
  difficultyLevel: "Easy" | "Medium" | "Hard";
  questionCount: number;
  timeLimitMinutes: number;
  questionTypes: string[];
  details: string;
  focus: string;
}

type DailyPlanAction =
  | { type: "RECOMMEND_STUDY"; parameters: RecommendStudyParams }
  | { type: "RECOMMEND_TEST"; parameters: RecommendTestParams }
  | {
      type: "RECOMMEND_CHALLENGE" | "RECOMMEND_JOIN_GROUP";
      parameters: { details: string };
    };

export interface DailyPlan {
  title: string;
  rationale: string;
  action: DailyPlanAction;
  recommendedId: string;
  status: string;
}

interface Mission {
  id: string;
  subject: string;
  topic: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  method: "STUDY" | "PRACTICE" | "TEST";
  duration: number; // durationMinutes from backend
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  // These are optional fields from your backend
  questionCount?: number;
  timeLimitMinutes?: number;
  status: "PENDING" | "COMPLETED" | "SKIPPED";
}

const getMissionIcon = (method: Mission["method"]) => {
  switch (method) {
    case "STUDY":
      return <BookOpen className="w-5 h-5" />;
    case "PRACTICE":
      return <Pen className="w-5 h-5" />;
    case "TEST":
      return <Target className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

export default function MissionControlDashboard({
  aiRecommendation,
  isRecommendationLoading,
}: {
  aiRecommendation: DailyPlan | null;
  isRecommendationLoading: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 1,
    coins: 800,
    dailyGoal: 120,
    dailyProgress: 78,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    accuracyTrend: [0, 0, 0, 0, 0, 0, 0],
    rank: 24,
    friends: [
      {
        name: "Sarah",
        score: 1250,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612c9c3?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "Mike",
        score: 980,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "Alex",
        score: 856,
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face",
      },
    ],
  });

  const [missions, setMissions] = useState<MissionCard[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [streakOpen, setStreakOpen] = useState(false);
  const [coinsOpen, setCoinsOpen] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);
  const [customTestConfig, setCustomTestConfig] = useState({
    topic: "",
    difficulty: [50],
    questionCount: [20],
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // Fetches today's schedule. In UTC to be timezone-safe.
        const today = new Date();
        const dailySchedule = await apiService.getDailySchedule(today);

        // Map backend data to our frontend Mission type
        const formattedMissions = dailySchedule.map((session) => ({
          ...session,
          // Add default values and transformations here if needed
          estimatedTime: session.duration,
          coinReward: Math.round(session.duration * 1.5), // Example reward logic
          completed: session.status === "COMPLETED",
          icon: getMissionIcon(session.method),
          title: session.topic,
          difficulty: session.difficultyLevel,
        }));

        setMissions(formattedMissions);
      } catch (err) {
        console.error("Failed to fetch daily missions:", err);
        toast.error("Failed to load daily missions.");
      }
    };

    fetchMissions();
  }, []);

  useEffect(() => {
    const fetchConversation = async () => {
      setIsChatLoading(true);
      try {
        const response = await apiService.getConversation(3, null);
        const formattedMessages = response.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: new Date(msg.createdAt),
          avatar:
            msg.role === "assistant"
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
              : undefined,
        }));
        setChatMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        toast.error("Failed to load chat history.");
      } finally {
        setIsChatLoading(false);
      }
    };

    fetchConversation();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSendingMessage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage.trim(),
      createdAt: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const messageToSend = newMessage;
    setNewMessage("");
    setIsSendingMessage(true);

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "● ● ●",
      createdAt: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    };
    setChatMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await apiService.sendMessage(messageToSend);

      const coachResponse: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: response.response,
        createdAt: new Date(),
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      };

      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessage.id ? coachResponse : msg))
      );
      router.push("/chat");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      setChatMessages((prev) =>
        prev.filter((msg) => msg.id !== loadingMessage.id)
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getIconForAction = (actionType: string) => {
    switch (actionType) {
      case "RECOMMEND_TEST":
        return <Target className="w-4 h-4" />;
      case "RECOMMEND_STUDY":
        return <BookOpen className="w-4 h-4" />;
      case "RECOMMEND_CHALLENGE":
        return <Zap className="w-4 h-4" />;
      case "RECOMMEND_JOIN_GROUP":
        return <Users className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleAIAction = async (action: DailyPlan["action"]) => {
    // Prevent multiple clicks while an action is in progress
    if (isActionLoading) return;

    setIsActionLoading(true);
    toast.info("Executing AI recommendation...", {
      description:
        action.parameters.details || "Preparing your personalized task.",
    });

    try {
      if (action.type === "RECOMMEND_STUDY" && action.parameters.studyLink) {
        window.open(action.parameters.studyLink, "_blank");
      } else if (action.type === "RECOMMEND_TEST") {
        const params = action.parameters;
        let response;
        const examId = 1;

        if (params.testType === "quiz") {
          // For quiz, use generateAIQuiz
          const payload = {
            examId,
            topicIds: params.topicIds,
            difficultyLevel: params.difficultyLevel,
            questionCount: params.questionCount,
            timeLimitMinutes: params.timeLimitMinutes,
            questionTypes: params.questionTypes || ["conceptual"],
            recommendedId: aiRecommendation?.recommendedId || "",
          };
          response = await apiService.generateAIQuiz(payload);
        } else if (params.testType === "drill") {
          // For drill, use generateCustomQuiz
          const payload = {
            examId,
            topicIds: params.topicIds,
            difficultyLevel: params.difficultyLevel,
            questionCount: params.questionCount,
            timeLimitMinutes: params.timeLimitMinutes,
            questionTypes: params.questionTypes || ["conceptual"],
            recommendedId: aiRecommendation?.recommendedId || "",
          };
          response = await apiService.generateDrill(payload);
        } else if (params.testType === "diagnostic") {
          router.push("/dashboard/JEE/quizzes");
        } else {
          throw new Error(`Unsupported test type: ${params.testType}`);
        }

        if (response && response.testInstanceId) {
          toast.success("Test generated successfully! Starting now...");
          router.push(`/ai-test/${response.testInstanceId}`);
        }
      }
    } catch (error: any) {
      console.error("Failed to execute AI action:", error);
      toast.error("Could not start your task", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const testCenterTiles: TestCenterTile[] = [
    {
      id: "weaknesses",
      title: "My Weaknesses Test",
      description: "Focus on your problem areas",
      icon: <Goal className="w-6 h-6" />,
      type: "weaknesses",
    },
    {
      id: "mock",
      title: "Smart Mock",
      description: "AI-powered full exam simulation",
      icon: <LayoutDashboard className="w-6 h-6" />,
      type: "mock",
    },
    {
      id: "custom",
      title: "Custom Practice",
      description: "Create your own test session",
      icon: <SquareMenu className="w-6 h-6" />,
      type: "custom",
    },
    {
      id: "challenge",
      title: "Challenge Mode",
      description: "Compete with friends",
      icon: <SquareActivity className="w-6 h-6" />,
      type: "challenge",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "completion",
      text: "Account Created",
      time: "Now",
      coins: 800,
    },
    // {
    //   id: "2",
    //   type: "badge",
    //   text: 'Earned "Math Master" badge',
    //   time: "1 day ago",
    //   coins: 0,
    // },
    // {
    //   id: "3",
    //   type: "challenge",
    //   text: "Won speed challenge vs Sarah",
    //   time: "2 days ago",
    //   coins: 50,
    // },
  ];

  const handleCompleteCard = useCallback(
    (cardId: string) => {
      setMissions((prev) =>
        prev.map((mission) =>
          mission.id === cardId ? { ...mission, completed: true } : mission
        )
      );

      const completedMission = missions.find((m) => m.id === cardId);
      if (completedMission) {
        setUserStats((prev) => ({
          ...prev,
          coins: prev.coins + completedMission.coinReward,
          dailyProgress: Math.min(prev.dailyGoal, prev.dailyProgress + 15),
        }));

        toast.success(`Earned ${completedMission.coinReward} coins!`, {
          description: "Great job on completing your mission!",
        });
      }
    },
    [missions]
  );

  const handleShuffleDeck = useCallback(() => {
    setMissions((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    toast.info("Deck shuffled!", {
      description: "Fresh mission order ready for you.",
    });
  }, []);

  const handleStartTest = useCallback(
    (testType: string) => {
      if (
        testType === "custom" &&
        (!customTestConfig.topic || customTestConfig.topic === "")
      ) {
        toast.error("Please select a topic for custom practice");
        return;
      }

      toast.success("Starting test...", {
        description: `Launching ${
          testCenterTiles.find((t) => t.id === testType)?.title
        }`,
      });

      // Here you would emit navigation event or route to TestEngineInterface
      console.log("Starting test:", testType, customTestConfig);
    },
    [customTestConfig, testCenterTiles]
  );

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % missions.length);
  };

  const previousCard = () => {
    setCurrentCardIndex(
      (prev) => (prev - 1 + missions.length) % missions.length
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number, goal: number) => {
    const percentage = (progress / goal) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-orange-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const handleNavigateToAnalytics = () => {
    router.push("/analytics");
  };

  const handleNavigateToSchedule = () => {
    router.push("/ai-schedule");
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between p-4 bg-[#ffffff] rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#f0f2f5] rounded-full animate-pulse" />
            <div className="w-16 h-4 bg-[#f0f2f5] rounded animate-pulse" />
            <div className="w-20 h-4 bg-[#f0f2f5] rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-[#f0f2f5] rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full h-48 bg-[#f0f2f5] rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-[#f0f2f5] rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-full h-32 bg-[#f0f2f5] rounded-lg animate-pulse" />
            <div className="w-full h-48 bg-[#f0f2f5] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-[#ffffff] border-[#e0e0e0]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Popover open={streakOpen} onOpenChange={setStreakOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                  >
                    <Goal className="w-5 h-5" />
                    <span className="font-semibold">
                      {userStats.streak} day streak
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-lg">
                        🔥 {userStats.streak} Day Streak!
                      </h4>
                      <p className="text-sm text-[#667085] mt-1">
                        Keep it up! You're on fire!
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            i < userStats.streak % 7
                              ? "bg-orange-500 text-white"
                              : "bg-[#f0f2f5] text-[#667085]"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={coinsOpen} onOpenChange={setCoinsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
                  >
                    <Component className="w-5 h-5" />
                    <span className="font-semibold">
                      {userStats.coins} coins
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-lg">
                        💰 {userStats.coins} Coins
                      </h4>
                      <p className="text-sm text-[#667085] mt-1">
                        Spend them wisely!
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">New Join Bonus</span>
                        <span className="text-sm text-[#667085]">
                          800 coins
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-sm">Power-up Hints</span>
                        <span className="text-sm text-[#667085]">50 coins</span>
                      </div> */}
                      {/* <div className="flex justify-between">
                        <span className="text-sm">Extra Time</span>
                        <span className="text-sm text-[#667085]">75 coins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Premium Themes</span>
                        <span className="text-sm text-[#667085]">
                          200 coins
                        </span>
                      </div> */}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-4">
              {/* Navigation Buttons */}
              <Button
                onClick={() => router.push("/study-group")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Study Group
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToAnalytics}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToSchedule}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>

              <Avatar className="w-10 h-10">
                {/* <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" /> */}
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Progress Ring */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="stroke-[#f0f2f5]"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="stroke-[#ff5c00]"
                        strokeWidth="3"
                        strokeDasharray={`${
                          (userStats.dailyProgress / userStats.dailyGoal) * 100
                        }, 100`}
                        strokeLinecap="round"
                        fill="transparent"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${getProgressColor(
                          userStats.dailyProgress,
                          userStats.dailyGoal
                        )}`}
                      >
                        {Math.round(
                          (userStats.dailyProgress / userStats.dailyGoal) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Today's Progress</h3>
                  <p className="text-sm text-[#667085] mt-1">
                    {userStats.dailyProgress} / {userStats.dailyGoal} minutes
                  </p>
                  <p className="text-sm text-[#ff5c00] mt-2 font-medium">
                    "You're crushing it! Keep the momentum going!"
                  </p>
                  <Button size="sm" variant="outline" className="mt-3">
                    Log Mood & Confidence
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="relative overflow-hidden border border-[#e4e4e4] shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
            {/* Decorative glow */}
            <div className="absolute inset-0 pointer-events-none" />

            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Sparkles className="w-5 h-5 text-[#ff5c00]" />
                Your Plan for Today
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 p-6 pt-0">
              {isRecommendationLoading ? (
                <div className="p-5 rounded-xl border-2 border-dashed flex flex-col gap-3 items-center justify-center min-h-[140px] bg-gray-50">
                  <Loader className="w-6 h-6 animate-spin text-orange-500" />
                  <span className="text-gray-500 font-medium text-sm">
                    Your AI Coach is preparing your personalized plan...
                  </span>
                </div>
              ) : aiRecommendation ? (
                <div
                  className={`p-5 rounded-xl border ${getPriorityColor(
                    "high"
                  )} bg-gradient-to-br from-orange-50/70 to-white shadow-inner`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#ff5c00]/10 rounded-xl text-[#ff5c00] mt-1 shadow-sm">
                      {getIconForAction(aiRecommendation.action.type)}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 text-base leading-snug">
                          {aiRecommendation.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            aiRecommendation.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : aiRecommendation.status === "PENDING"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {aiRecommendation.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-700">
                          AI Insight:
                        </span>{" "}
                        {aiRecommendation.rationale}
                      </p>

                      <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-inner">
                        <span className="text-sm text-gray-700 italic font-medium">
                          {aiRecommendation.action.parameters.details ||
                            "Practice task to boost your learning."}
                        </span>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAIAction(aiRecommendation.action)
                          }
                          className={`rounded-lg font-medium transition-all duration-300 ${
                            aiRecommendation.status === "PENDING"
                              ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                              : aiRecommendation.status === "COMPLETED"
                              ? "bg-green-600 text-white opacity-80 cursor-not-allowed"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                          disabled={
                            aiRecommendation.status !== "PENDING" ||
                            isActionLoading
                          }
                        >
                          {aiRecommendation.status === "PENDING"
                            ? "Start Now"
                            : aiRecommendation.status === "COMPLETED"
                            ? "Completed"
                            : aiRecommendation.status}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[140px] bg-gray-50 text-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
                  <h4 className="font-semibold text-gray-700 mb-1">
                    No Plan Available
                  </h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Your AI Coach couldn't generate a plan at the moment. Please
                    try again later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mission Cards Deck */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Daily Missions</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShuffleDeck}
                  >
                    <SquareMenu className="w-4 h-4 mr-2" />
                    Shuffle
                  </Button>
                  <Button size="sm" variant="ghost" onClick={previousCard}>
                    ←
                  </Button>
                  <Button size="sm" variant="ghost" onClick={nextCard}>
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {missions.length > 0 ? (
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${currentCardIndex * 100}%)`,
                    }}
                  >
                    {missions.map((mission, index) => (
                      <div
                        key={mission.id}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <Card
                          className={`bg-accent border-[#e0e0e0] ${
                            mission.completed ? "opacity-50" : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#ff5c00]/10 rounded-lg text-[#ff5c00]">
                                  {mission.icon}
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {mission.title}
                                  </h4>
                                  <p className="text-sm text-[#667085]">
                                    {mission.subject}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={getDifficultyColor(
                                  mission.difficulty
                                )}
                              >
                                {mission.difficulty}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4 text-sm text-[#667085]">
                                <span>⏱️ {mission.estimatedTime}min</span>
                                <span>🪙 {mission.coinReward} coins</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {!mission.completed ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => router.push("/ai-schedule")}
                                  >
                                    Start Mission
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push("/ai-schedule")}
                                  >
                                    Snooze
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  disabled
                                >
                                  ✓ Completed
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <PanelLeftOpen className="w-12 h-12 mx-auto text-[#667085] mb-4" />
                  <h3 className="font-medium mb-2">No missions available</h3>
                  <p className="text-sm text-[#667085] mb-4">
                    Let's get you started with a quick diagnostic!
                  </p>
                  <Button onClick={() => router.push("/dashboard/JEE/quizzes")}>
                    Run Quick Diagnostic
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Center Hub */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-[#ff5c00]" />
                Test Center
              </CardTitle>
              <p className="text-sm text-[#667085]">
                Choose from our comprehensive test suite designed for JEE
                preparation
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock Tests */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Mock Tests
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Experience the real exam environment with timed tests
                          that match the exact JEE pattern.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#667085] mb-2">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            12 Available Tests
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Full Syllabus
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff]"
                      onClick={() => router.push("/dashboard/jee/mock-tests")}
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Start Mock Test
                    </Button>
                  </CardContent>
                </Card>

                {/* Custom Mock Test */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <SquareMenu className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Custom Mock Test
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Design your own mock test by selecting chapters for a
                          tailored practice session.
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Personalized Practice
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Flexible Duration
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                    >
                      <Target className="w-3 h-3 mr-2" />
                      Create Custom Test
                    </Button>
                  </CardContent>
                </Card>

                {/* Revision Tests */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Revision Tests
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Solidify your knowledge with tests focused on
                          previously covered topics and questions.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                      onClick={() => router.push("/dashboard/JEE/revision")}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>

                {/* PYQ Papers */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          PYQ Papers
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Solve full papers from previous years to understand
                          the exam pattern.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                      onClick={() => router.push("/dashboard/JEE/pyq")}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Chapter-wise PYQs */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Chapter-wise PYQs
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Sharpen specific skills by solving previous year
                          questions organized by topic and chapter.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                      onClick={() => router.push("/dashboard/JEE/pyq/practice")}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Mistake Bank */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Mistake Bank
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Revisit and learn from every question you answered
                          incorrectly.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                      onClick={() => router.push("/dashboard/JEE/mistake-bank")}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Custom Quiz */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Custom Quiz
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Sharpen specific skills by solving previous year
                          questions organized by topic and chapter.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#667085] mb-2">
                          <span>500+ Topics</span>
                          <span>Instant Solutions</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                      onClick={() => router.push("/dashboard/JEE/quizzes")}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Weakness Test */}
                <Card className="bg-accent border-[#e0e0e0] hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          Weakness Test
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Turn your weaknesses into strengths with our smart
                          weakness tests.
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Personalized Error Log
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Improve Accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-[#ff5c00] group-hover:text-[#ffffff] group-hover:border-[#ff5c00]"
                      onClick={() =>
                        router.push("/dashboard/JEE/weakness-test")
                      }
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Access Panel */}
                <Card className="bg-gradient-to-br from-[#ff5c00]/10 to-[#ff5c00]/5 border-[#ff5c00]/20 hover:shadow-md transition-all cursor-pointer group md:col-span-2 lg:col-span-1">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-[#ff5c00]/10 rounded-lg text-[#ff5c00]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-[#ff5c00]">
                          Quick Start
                        </h4>
                        <p className="text-xs text-[#667085] mb-2">
                          Jump into a test session based on your current study
                          plan and performance.
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      <Sparkles className="w-3 h-3 mr-2" />
                      AI Recommended Test
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Personal Coach Chat */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#ff5c00]" />
                Personal Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <ScrollArea className="h-48 pr-4">
                  <div className="space-y-3">
                    {isChatLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader className="w-6 h-6 animate-spin text-gray-300" />
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-6 h-6 rounded-lg bg-[#fe724c]/10 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-[#fe724c]" />
                            </div>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 max-w-[80%] ${
                              message.role === "user"
                                ? "bg-[#ff5c00] text-[#ffffff]"
                                : "bg-[#f0f2f5] text-[#667085]"
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                message.role === "user" &&
                                "text-[#ffffff] font-medium"
                              }`}
                            >
                              {message.content}
                            </p>
                            {/* <p
                              className={`text-xs opacity-70 mt-1 ${
                                message.role === "user" && "text-[#ffffff]"
                              }`}
                            >
                              {message.createdAt.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p> */}
                          </div>
                          {message.role === "user" && (
                            <div className="w-6 h-6 rounded-lg bg-[#4299e1]/20 flex items-center justify-center">
                              <User className="w-4 h-4 text-[#4299e1]" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask your coach anything..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSendingMessage}
                  >
                    {isSendingMessage ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-orange-600 hover:text-orange-500 text-xs"
                    onClick={() => router.push("/chat")}
                  >
                    Open Chat
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Heatmap */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div
                    key={index}
                    className="text-xs text-center text-[#667085] font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {userStats.weeklyData.map((value, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded cursor-pointer transition-colors ${
                      value === 0
                        ? "bg-[#f0f2f5]"
                        : value < 30
                        ? "bg-green-200"
                        : value < 60
                        ? "bg-green-400"
                        : "bg-green-600"
                    }`}
                    title={`${value} minutes`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accuracy Trend */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader>
              <CardTitle className="text-lg">Accuracy Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-16 flex items-end gap-1">
                {userStats.accuracyTrend.map((accuracy, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-sm"
                    style={{ height: `${(accuracy / 100) * 100}%` }}
                    title={`${accuracy}%`}
                  />
                ))}
              </div>
              <p className="text-sm text-[#667085] mt-2 text-center">
                Latest:{" "}
                {userStats.accuracyTrend[userStats.accuracyTrend.length - 1]}%
                accuracy
              </p>
            </CardContent>
          </Card>

          {/* Mini Leaderboard */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader>
              <CardTitle className="text-lg">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {userStats.friends.map((friend, index) => (
                  <div key={friend.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#f0f2f5] flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{friend.name}</p>
                      <p className="text-xs text-[#667085]">
                        {friend.score} pts
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ff5c00] text-[#ffffff] flex items-center justify-center text-xs font-medium">
                    {userStats.rank}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">You</p>
                    <p className="text-xs text-[#667085]">
                      {userStats.coins} pts
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="bg-[#ffffff] border-[#e0e0e0]">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#ff5c00] rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-[#667085]">
                          {activity.time}
                        </p>
                        {activity.coins > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            +{activity.coins} coins
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
