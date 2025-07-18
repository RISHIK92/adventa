"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Trophy,
  BookOpen,
  Brain,
  Zap,
  ArrowUp,
  ArrowDown,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Award,
  Users,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface PerformanceAnalyticsProps {
  userId: string;
  timeRange?: "week" | "month" | "quarter";
  onTestSelect?: (testId: string) => void;
  onSubjectSelect?: (subject: string) => void;
}

export default function PerformanceAnalytics({
  userId,
  timeRange = "month",
  onTestSelect,
  onSubjectSelect,
}: PerformanceAnalyticsProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data - in production, this would come from props or API
  const overallMetrics = {
    totalTests: 45,
    averageScore: 78.5,
    accuracy: 82.3,
    timeEfficiency: 75.8,
    ranking: 12,
    totalStudents: 150,
    improvementRate: 15.3,
  };

  const subjectData = [
    {
      subject: "Mathematics",
      score: 85,
      accuracy: 88,
      timeSpent: 145,
      improvement: 12,
    },
    {
      subject: "Physics",
      score: 78,
      accuracy: 82,
      timeSpent: 132,
      improvement: 8,
    },
    {
      subject: "Chemistry",
      score: 82,
      accuracy: 85,
      timeSpent: 128,
      improvement: 15,
    },
    {
      subject: "Biology",
      score: 75,
      accuracy: 79,
      timeSpent: 118,
      improvement: -3,
    },
    {
      subject: "English",
      score: 88,
      accuracy: 91,
      timeSpent: 95,
      improvement: 18,
    },
  ];

  const accuracyTrend = [
    { date: "Week 1", accuracy: 65, score: 68 },
    { date: "Week 2", accuracy: 70, score: 72 },
    { date: "Week 3", accuracy: 75, score: 78 },
    { date: "Week 4", accuracy: 78, score: 82 },
    { date: "Week 5", accuracy: 82, score: 85 },
    { date: "Week 6", accuracy: 85, score: 88 },
  ];

  const timeManagementData = [
    { category: "Quick (< 30s)", count: 145, percentage: 45 },
    { category: "Normal (30s-1m)", count: 120, percentage: 37 },
    { category: "Slow (1m-2m)", count: 45, percentage: 14 },
    { category: "Very Slow (> 2m)", count: 12, percentage: 4 },
  ];

  const strengthsWeaknesses = {
    strengths: [
      { skill: "Problem Solving", score: 92, trend: "up" },
      { skill: "Conceptual Understanding", score: 88, trend: "up" },
      { skill: "Speed", score: 85, trend: "stable" },
    ],
    weaknesses: [
      { skill: "Attention to Detail", score: 65, trend: "down" },
      { skill: "Time Management", score: 68, trend: "up" },
      { skill: "Complex Calculations", score: 72, trend: "stable" },
    ],
  };

  const radarData = [
    { subject: "Math", current: 85, target: 90 },
    { subject: "Physics", current: 78, target: 85 },
    { subject: "Chemistry", current: 82, target: 88 },
    { subject: "Biology", current: 75, target: 85 },
    { subject: "English", current: 88, target: 90 },
  ];

  const upcomingRecommendations = [
    {
      title: "Advanced Calculus Practice",
      type: "Weakness Focus",
      estimatedImprovement: 12,
      duration: "45 min",
      difficulty: "Hard",
    },
    {
      title: "Physics Mechanics Review",
      type: "Strength Building",
      estimatedImprovement: 8,
      duration: "30 min",
      difficulty: "Medium",
    },
    {
      title: "Speed Test Challenge",
      type: "Time Management",
      estimatedImprovement: 15,
      duration: "20 min",
      difficulty: "Medium",
    },
  ];

  const COLORS = {
    primary: "#10b981",
    secondary: "#475569",
    warning: "#f59e0b",
    error: "#ef4444",
    success: "#10b981",
  };

  const pieColors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.warning,
    COLORS.error,
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-semibold text-foreground mb-2">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your learning progress and identify areas for improvement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-primary border-primary">
            <Activity className="w-3 h-3 mr-1" />
            Active Learner
          </Badge>
          <Badge variant="secondary">Rank #{overallMetrics.ranking}</Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground mb-1">
                  Total Tests
                </p>
                <p className="text-display font-semibold text-foreground">
                  {overallMetrics.totalTests}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Badge variant="secondary" className="text-success">
                <ArrowUp className="w-3 h-3 mr-1" />+
                {overallMetrics.improvementRate}%
              </Badge>
              <span className="text-caption text-muted-foreground ml-2">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground mb-1">
                  Average Score
                </p>
                <p className="text-display font-semibold text-foreground">
                  {overallMetrics.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Progress value={overallMetrics.averageScore} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground mb-1">
                  Accuracy
                </p>
                <p className="text-display font-semibold text-foreground">
                  {overallMetrics.accuracy}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Progress value={overallMetrics.accuracy} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground mb-1">
                  Class Ranking
                </p>
                <p className="text-display font-semibold text-foreground">
                  #{overallMetrics.ranking}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-caption text-muted-foreground mt-4">
              Out of {overallMetrics.totalStudents} students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Subjects</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trends</span>
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center space-x-2"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Performance */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Subject Performance</span>
                </CardTitle>
                <CardDescription>
                  Your performance across different subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="subject" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill={COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Management */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Time Management</span>
                </CardTitle>
                <CardDescription>Response time distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={timeManagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="percentage"
                      label={({ category, percentage }) => `${percentage}%`}
                    >
                      {timeManagementData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {timeManagementData.map((item, index) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between text-caption"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              pieColors[index % pieColors.length],
                          }}
                        />
                        <span>{item.category}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span>Strengths</span>
                </CardTitle>
                <CardDescription>Areas where you excel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {strengthsWeaknesses.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{strength.skill}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-caption font-semibold">
                            {strength.score}%
                          </span>
                          {strength.trend === "up" && (
                            <TrendingUp className="w-3 h-3 text-success" />
                          )}
                          {strength.trend === "down" && (
                            <TrendingDown className="w-3 h-3 text-error" />
                          )}
                        </div>
                      </div>
                      <Progress value={strength.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Areas for Improvement</span>
                </CardTitle>
                <CardDescription>
                  Focus areas to boost performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {strengthsWeaknesses.weaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{weakness.skill}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-caption font-semibold">
                            {weakness.score}%
                          </span>
                          {weakness.trend === "up" && (
                            <TrendingUp className="w-3 h-3 text-success" />
                          )}
                          {weakness.trend === "down" && (
                            <TrendingDown className="w-3 h-3 text-error" />
                          )}
                        </div>
                      </div>
                      <Progress value={weakness.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Subject Comparison</span>
                </CardTitle>
                <CardDescription>
                  Performance radar across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke={COLORS.secondary}
                      fill="transparent"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>Subject Details</span>
                </CardTitle>
                <CardDescription>Detailed breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectData.map((subject, index) => (
                  <div
                    key={subject.subject}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onSubjectSelect?.(subject.subject)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{subject.subject}</h3>
                      <Badge
                        variant={
                          subject.improvement >= 0 ? "default" : "destructive"
                        }
                      >
                        {subject.improvement >= 0 ? "+" : ""}
                        {subject.improvement}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-caption">
                      <div>
                        <p className="text-muted-foreground mb-1">Score</p>
                        <p className="font-semibold">{subject.score}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Accuracy</p>
                        <p className="font-semibold">{subject.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Time</p>
                        <p className="font-semibold">{subject.timeSpent}m</p>
                      </div>
                    </div>
                    <Progress value={subject.score} className="mt-3 h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Performance Trends</span>
              </CardTitle>
              <CardDescription>
                Track your improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={accuracyTrend}>
                  <defs>
                    <linearGradient
                      id="colorAccuracy"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.secondary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.secondary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAccuracy)"
                    name="Accuracy"
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={COLORS.secondary}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    name="Overall Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span>Recommended Tests</span>
                </CardTitle>
                <CardDescription>
                  Personalized practice recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium mb-1">{rec.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onTestSelect?.(`test-${index}`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Start
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-caption text-muted-foreground">
                      <div>
                        <p className="mb-1">Duration</p>
                        <p className="font-medium text-foreground">
                          {rec.duration}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1">Difficulty</p>
                        <p className="font-medium text-foreground">
                          {rec.difficulty}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1">Est. Improvement</p>
                        <p className="font-medium text-success">
                          +{rec.estimatedImprovement}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Achievement Insights</span>
                </CardTitle>
                <CardDescription>
                  Your progress milestones and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Trophy className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Mathematics Master</h3>
                      <p className="text-caption text-muted-foreground">
                        Complete 50 math tests with 80%+ accuracy
                      </p>
                    </div>
                  </div>
                  <Progress value={85} className="mb-2" />
                  <p className="text-caption text-primary font-medium">
                    42/50 tests completed
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-6 h-6 text-secondary" />
                    <div>
                      <h3 className="font-medium">Speed Demon</h3>
                      <p className="text-caption text-muted-foreground">
                        Answer 100 questions in under 30 seconds each
                      </p>
                    </div>
                  </div>
                  <Progress value={65} className="mb-2" />
                  <p className="text-caption text-secondary font-medium">
                    65/100 questions completed
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-secondary" />
                    <div>
                      <h3 className="font-medium">Top 10 Achiever</h3>
                      <p className="text-caption text-muted-foreground">
                        Maintain top 10 ranking for 3 consecutive months
                      </p>
                    </div>
                  </div>
                  <Progress value={33} className="mb-2" />
                  <p className="text-caption text-secondary font-medium">
                    1/3 months completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
