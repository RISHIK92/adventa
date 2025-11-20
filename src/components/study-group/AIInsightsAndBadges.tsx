"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Flame,
  Users,
  Target,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Zap,
  Star,
  Clock,
  Brain,
} from "lucide-react";
import { toast } from "sonner";

interface InsightData {
  id: string;
  type: "critical" | "attention" | "good";
  title: string;
  description: string;
  metric: string;
  percentage: number;
  explanation: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  criteria: string;
}

interface StreakData {
  userId: string;
  name: string;
  streak: number;
  avatar: string;
}

interface StudyBuddy {
  id: string;
  name: string;
  commonWeakness: string;
  compatibility: number;
}

interface TopicPriority {
  id: string;
  topic: string;
  importance: "high" | "medium" | "low";
  weaknessPercentage: number;
}

const AIInsightsAndBadges: React.FC = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [streaks, setStreaks] = useState<StreakData[]>([]);
  const [studyBuddies, setStudyBuddies] = useState<StudyBuddy[]>([]);
  const [topicPriorities, setTopicPriorities] = useState<TopicPriority[]>([]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    // Mock data initialization
    setInsights([
      {
        id: "1",
        type: "critical",
        title: "Organic Chemistry weakness detected",
        description:
          "Your group is collectively weaker than 68% of JEE aspirants in Organic Chemistry",
        metric: "32nd percentile",
        percentage: 32,
        explanation:
          "This is calculated based on average scores across 15 recent practice tests in Organic Chemistry topics, compared to our database of 50,000+ JEE aspirants.",
        action: {
          label: "Generate Group Revision",
          handler: () =>
            toast.success("Revision plan generated for Organic Chemistry"),
        },
      },
      {
        id: "2",
        type: "attention",
        title: "Chapter 12: Thermodynamics needs attention",
        description:
          "This chapter shows 40% lower performance across your study group",
        metric: "Average: 52%",
        percentage: 52,
        explanation:
          "Based on performance analysis of 8 practice sessions and 3 mock tests over the past month.",
        action: {
          label: "Challenge Top Performer",
          handler: () =>
            toast.success("Challenge sent to Arjun for Thermodynamics"),
        },
      },
      {
        id: "3",
        type: "good",
        title: "Physics momentum building",
        description:
          "Your group is stronger than 78% of JEE aspirants in Physics",
        metric: "78th percentile",
        percentage: 78,
        explanation:
          "Consistent improvement over 6 weeks, with mechanics and electromagnetism showing particular strength.",
        action: {
          label: "Assign Group Practice",
          handler: () => toast.success("Advanced Physics problems assigned"),
        },
      },
    ]);

    setBadges([
      {
        id: "1",
        name: "Fastest in Group",
        description: "Completed practice set in record time",
        icon: <Zap className="h-4 w-4" />,
        earned: true,
        earnedDate: "2024-01-15",
        criteria: "Complete any practice set 20% faster than group average",
      },
      {
        id: "2",
        name: "Consistency King",
        description: "Maintained daily study streak",
        icon: <Flame className="h-4 w-4" />,
        earned: true,
        earnedDate: "2024-01-10",
        criteria: "Study for 7 consecutive days without missing",
      },
      {
        id: "3",
        name: "Problem Solver",
        description: "Solved complex problems",
        icon: <Brain className="h-4 w-4" />,
        earned: false,
        criteria: "Solve 10 advanced level problems in a single session",
      },
      {
        id: "4",
        name: "Group Helper",
        description: "Helped teammates succeed",
        icon: <Users className="h-4 w-4" />,
        earned: true,
        earnedDate: "2024-01-08",
        criteria: "Provide explanations that help 3+ group members",
      },
    ]);

    setStreaks([
      { userId: "1", name: "Arjun Kumar", streak: 12, avatar: "AK" },
      { userId: "2", name: "Priya Singh", streak: 8, avatar: "PS" },
      { userId: "3", name: "Rahul Mehta", streak: 6, avatar: "RM" },
    ]);

    setStudyBuddies([
      {
        id: "1",
        name: "Arjun Kumar",
        commonWeakness: "Organic Chemistry",
        compatibility: 85,
      },
      {
        id: "2",
        name: "Priya Singh",
        commonWeakness: "Thermodynamics",
        compatibility: 72,
      },
      {
        id: "3",
        name: "Rohit Sharma",
        commonWeakness: "Calculus",
        compatibility: 68,
      },
    ]);

    setTopicPriorities([
      {
        id: "1",
        topic: "Organic Chemistry",
        importance: "high",
        weaknessPercentage: 68,
      },
      {
        id: "2",
        topic: "Thermodynamics",
        importance: "high",
        weaknessPercentage: 60,
      },
      {
        id: "3",
        topic: "Complex Numbers",
        importance: "medium",
        weaknessPercentage: 45,
      },
      {
        id: "4",
        topic: "Modern Physics",
        importance: "medium",
        weaknessPercentage: 38,
      },
    ]);
  }, []);

  const getInsightColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "attention":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20";
      case "good":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      default:
        return "border-l-gray-300";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "attention":
        return <Target className="h-4 w-4 text-amber-500" />;
      case "good":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const awardBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((badge) =>
        badge.id === badgeId
          ? {
              ...badge,
              earned: true,
              earnedDate: new Date().toISOString().split("T")[0],
            }
          : badge
      )
    );
    const badge = badges.find((b) => b.id === badgeId);
    if (badge) {
      toast.success(`🏆 Badge awarded: ${badge.name}!`);
    }
  };

  const SparklineBar = ({
    percentage,
    type,
  }: {
    percentage: number;
    type: string;
  }) => (
    <div className="flex items-center gap-1">
      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            type === "critical"
              ? "bg-red-500"
              : type === "attention"
              ? "bg-amber-500"
              : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-[#7d7e80]">{percentage}%</span>
    </div>
  );

  return (
    <Card className="bg-[#ffffff]">
      <CardHeader>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5 text-[#fe7244]" />
          <p className="m-0">AI Insights & Achievements</p>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-3">
              {insights.map((insight) => (
                <Card
                  key={insight.id}
                  className={`border-l-4 ${getInsightColor(insight.type)}`}
                >
                  <CardContent className="px-4 py-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-[#7d7e80] mt-1">
                            {insight.description}
                          </p>

                          <div className="flex items-center gap-4 mt-2">
                            <SparklineBar
                              percentage={insight.percentage}
                              type={insight.type}
                            />
                            <span className="text-xs font-medium text-[#1c1f24]">
                              {insight.metric}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            {insight.action && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={insight.action.handler}
                                className="h-7 text-xs"
                              >
                                {insight.action.label}
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setExpandedInsight(
                                  expandedInsight === insight.id
                                    ? null
                                    : insight.id
                                )
                              }
                              className="h-7 text-xs p-1"
                            >
                              {expandedInsight === insight.id ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          {expandedInsight === insight.id && (
                            <div className="mt-3 p-3 bg-[#f7f7f7`] rounded-md">
                              <p className="text-xs text-[#7d7e80]">
                                <strong>How this was computed:</strong>{" "}
                                {insight.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Topics to Prioritize
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topicPriorities.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-2 rounded-md bg-white/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{topic.topic}</p>
                        <Badge
                          variant={
                            topic.importance === "high"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {topic.importance} priority
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#7d7e80]">
                          {topic.weaknessPercentage}% weak
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs mt-1"
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <Card
                  key={badge.id}
                  className={
                    badge.earned ? "ring-2 ring-[#fe7244]/20" : "opacity-75"
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          badge.earned
                            ? "bg-[#fe7244] text-[#ffffff]"
                            : "bg-white text-[#7d7e80]"
                        }`}
                      >
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          {badge.earned && (
                            <Award className="h-3 w-3 text-[#fe7244]" />
                          )}
                        </div>
                        <p className="text-xs text-[#7d7e80] mt-1">
                          {badge.description}
                        </p>
                        <p className="text-xs text-[#7d7e80] mt-2 italic">
                          {badge.criteria}
                        </p>

                        {badge.earned && badge.earnedDate && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            Earned on{" "}
                            {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        )}

                        {!badge.earned && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs mt-2"
                            onClick={() => awardBadge(badge.id)}
                          >
                            Award Badge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Weekly Streak Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {streaks.map((user, index) => (
                  <div key={user.userId} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-white"
                          : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                          ? "bg-amber-600 text-white"
                          : "bg-white text-[#7d7e80]"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#fe7244] text-[#ffffff] flex items-center justify-center text-xs font-medium">
                      {user.avatar}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-[#7d7e80]">
                          {user.streak} day streak
                        </span>
                      </div>
                    </div>

                    {index < 3 && (
                      <Badge variant="secondary" className="text-xs">
                        Top 3
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Your Current Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/50 rounded-md">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-xl font-bold">5</span>
                    </div>
                    <p className="text-xs text-[#7d7e80]">Study Days</p>
                  </div>

                  <div className="text-center p-3 bg-white/50 rounded-md">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-xl font-bold">12</span>
                    </div>
                    <p className="text-xs text-[#7d7e80]">Perfect Scores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIInsightsAndBadges;
