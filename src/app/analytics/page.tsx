"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  BookOpen,
  Users,
  Calendar,
  Award,
  Brain,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Filter,
  Download,
  ChevronRight,
  Star,
  Zap,
  AlertCircle,
  Loader,
} from "lucide-react";
import { AnalyticsData, apiService } from "@/services/weaknessApi";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAnalyticsData();
        setAnalyticsData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching analytics.");
        toast.error("Failed to load analytics", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-10 h-10 animate-spin text-[#fe724c]" />
        <p className="ml-4 text-lg text-muted-foreground">
          Loading Your Analytics...
        </p>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Could Not Load Analytics</h2>
        <p className="mt-2 text-muted-foreground max-w-md">{error}</p>
      </div>
    );
  }

  const {
    overallStats,
    weeklyStats,
    subjectData,
    difficultyData,
    progressData,
    communityData,
    subtopicData,
    timeDistributionData,
    userStreak,
  } = analyticsData;

  const radarData = subjectData.map((s: any) => ({
    subject: s.name,
    A: s.accuracy,
    fullMark: 100,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Performance Analytics
            </h1>
            <p className="text-[#718096]">
              Comprehensive insights into your learning progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fe724c]/10 rounded-lg">
                  <Target className="h-5 w-5 text-[#fe724c]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {overallStats.avgAccuracy}%
                  </p>
                  <p className="text-sm text-[#718096]">Overall Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#48bb78]/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-[#48bb78]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {overallStats.totalAttempted.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#718096]">Questions Solved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ecc94b]/10 rounded-lg">
                  <Clock className="h-5 w-5 text-[#ecc94b]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {overallStats.totalTime}h
                  </p>
                  <p className="text-sm text-[#718096]">Total Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4299e1]/10 rounded-lg">
                  <Award className="h-5 w-5 text-[#4299e1]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    #{communityData.userRank}
                  </p>
                  <p className="text-sm text-[#718096]">Global Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="subtopics">Subtopics</TabsTrigger>
            <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="accuracy"
                        fill="#fe724c"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skill Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Skill Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Accuracy"
                        dataKey="A"
                        stroke="#fe724c"
                        fill="#fe724c"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Progress Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Accuracy Trend (Last 10 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).getDate().toString()
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) =>
                          new Date(date).toLocaleDateString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#fe724c"
                        strokeWidth={3}
                        dot={{
                          fill: "#fe724c",
                          strokeWidth: 2,
                          r: 4,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Study Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={timeDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subject Analysis Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Subject Cards */}
              <div className="lg:col-span-2 space-y-4">
                {subjectData.map((subject, id) => (
                  <Card key={id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </CardTitle>
                        <Badge
                          variant={
                            subject.accuracy >= 80 ? "default" : "secondary"
                          }
                        >
                          {subject.accuracy}% Accuracy
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-2xl font-bold">
                            {subject.questionsAttempted}
                          </p>
                          <p className="text-sm text-[#718096]">Attempted</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {subject.questionsCorrect}
                          </p>
                          <p className="text-sm text-[#718096]">Correct</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {subject.avgTimePerQuestion}m
                          </p>
                          <p className="text-sm text-[#718096]">Avg Time</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {subject.totalTimeSpent}h
                          </p>
                          <p className="text-sm text-[#718096]">Total Time</p>
                        </div>
                      </div>
                      <Progress value={subject.accuracy} className="mb-4" />

                      {/* Chapter breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          Chapter Performance
                        </h4>
                        {[...subject.chapters]
                          .sort((a, b) => b.accuracy - a.accuracy)
                          .map((chapter, index) => (
                            <Card key={index} className="border">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm">
                                    {chapter.name}
                                  </h4>
                                  <Badge
                                    variant={
                                      chapter.accuracy >= 80
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {chapter.accuracy}%
                                  </Badge>
                                </div>
                                <Progress
                                  value={chapter.accuracy}
                                  className="mb-3"
                                />
                                <div className="grid grid-cols-2 gap-2 text-xs text-[#718096]">
                                  <div>Attempted: {chapter.attempted}</div>
                                  <div>Correct: {chapter.correct}</div>
                                  <div>Avg Time: {chapter.avgTime}m</div>
                                  <div>
                                    Success:{" "}
                                    {Math.round(
                                      (chapter.correct / chapter.attempted) *
                                        100
                                    )}
                                    %
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Subject Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={subjectData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#fe724c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chapter Analysis Tab */}
          <TabsContent value="chapters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chapter-wise Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjectData.map((subject, id) => (
                    <div key={id}>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subject.chapters
                          .slice() // copy to avoid mutating original
                          .sort((a, b) => b.accuracy - a.accuracy) // sort high → low
                          .map((chapter, index) => (
                            <Card key={index} className="border">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm">
                                    {chapter.name}
                                  </h4>
                                  <Badge
                                    variant={
                                      chapter.accuracy >= 80
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {chapter.accuracy}%
                                  </Badge>
                                </div>
                                <Progress
                                  value={chapter.accuracy}
                                  className="mb-3"
                                />
                                <div className="grid grid-cols-2 gap-2 text-xs text-[#718096]">
                                  <div>Attempted: {chapter.attempted}</div>
                                  <div>Correct: {chapter.correct}</div>
                                  <div>Avg Time: {chapter.avgTime}m</div>
                                  <div>
                                    Success:{" "}
                                    {Math.round(
                                      (chapter.correct / chapter.attempted) *
                                        100
                                    )}
                                    %
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subtopic Analysis Tab */}
          <TabsContent value="subtopics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subtopic Performance Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {[...subtopicData]
                      .sort((a, b) => b.accuracy - a.accuracy)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{item.subtopic}</p>
                            <p className="text-sm text-[#718096]">
                              {item.subject} → {item.chapter}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {item.accuracy}%
                              </p>
                              <p className="text-xs text-[#718096]">
                                {item.attempted} questions
                              </p>
                            </div>
                            <div className="w-20">
                              <Progress value={item.accuracy} />
                            </div>
                            {item.accuracy < 70 && (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Improvement Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Focus on Mathematics - Calculus
                      </p>
                      <p className="text-sm text-yellow-700">
                        Your accuracy in Limits (68%) needs improvement.
                        Practice more conceptual problems.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">
                        Strengthen Physics - Thermodynamics
                      </p>
                      <p className="text-sm text-blue-700">
                        First Law concepts (72%) could be better. Review
                        fundamental principles.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Difficulty Analysis Tab */}
          <TabsContent value="difficulty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Difficulty Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={difficultyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="accuracy"
                        fill="#fe724c"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Analysis by Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={difficultyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="avgTime"
                        stroke="#48bb78"
                        fill="#48bb78"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficultyData.map((level, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {level.level}
                      <Badge
                        variant={
                          level.accuracy >= 80
                            ? "default"
                            : level.accuracy >= 60
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {level.accuracy}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={level.accuracy} className="mb-4" />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium">{level.attempted}</p>
                        <p className="text-[#718096]">Attempted</p>
                      </div>
                      <div>
                        <p className="font-medium">{level.correct}</p>
                        <p className="text-[#718096]">Correct</p>
                      </div>
                      <div>
                        <p className="font-medium">{level.avgTime}m</p>
                        <p className="text-[#718096]">Avg Time</p>
                      </div>
                      <div>
                        <p className="font-medium">
                          {Math.round((level.correct / level.attempted) * 100)}%
                        </p>
                        <p className="text-[#718096]">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Comparison Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Performance vs Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#fe724c]">
                        {communityData.percentile}th
                      </p>
                      <p className="text-[#718096]">Percentile</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Your Accuracy</span>
                        <span className="font-bold text-[#fe724c]">
                          {communityData.userAccuracy}%
                        </span>
                      </div>
                      <Progress value={communityData.userAccuracy} />

                      <div className="flex justify-between items-center">
                        <span>Community Average</span>
                        <span className="font-bold">
                          {communityData.averageAccuracy}%
                        </span>
                      </div>
                      <Progress
                        value={communityData.averageAccuracy}
                        className="opacity-60"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-[#718096] mb-2">
                        Rank #{communityData.userRank} out of{" "}
                        {communityData.totalUsers.toLocaleString()} users
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          You're performing 9% above average
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {communityData.topPerformers
                      .slice()
                      .sort((a, b) => b.accuracy - a.accuracy)
                      .map((performer, index) => (
                        <div
                          key={performer.id || performer.name || index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#fe724c] text-[#ffffff] flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium">
                              {performer.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{performer.accuracy}%</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject-wise Community Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Community Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectData.map((subject, id) => {
                    const communityAvg = Math.max(
                      60,
                      subject.accuracy - Math.random() * 15
                    );
                    return (
                      <div key={id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex gap-4 text-sm">
                            <span>You: {subject.accuracy}%</span>
                            <span className="text-[#718096]">
                              Avg: {Math.round(communityAvg)}%
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={subject.accuracy} />
                          <div
                            className="absolute top-0 h-full w-1 bg-[#718096] rounded"
                            style={{ left: `${communityAvg}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Daily Progress Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) =>
                          new Date(date).toLocaleDateString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#fe724c"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="questionsAttempted"
                        stroke="#48bb78"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) =>
                          new Date(date).toLocaleDateString()
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="timeSpent"
                        stroke="#ecc94b"
                        fill="#ecc94b"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Progress Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">+12%</p>
                      <p className="text-sm text-[#718096]">
                        Accuracy Improvement
                      </p>
                      <p className="text-xs text-green-600">Last 7 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">387</p>
                      <p className="text-sm text-[#718096]">
                        Questions This Week
                      </p>
                      <p className="text-xs text-blue-600">+23% vs last week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">16.2h</p>
                      <p className="text-sm text-[#718096]">
                        Study Time This Week
                      </p>
                      <p className="text-xs text-orange-600">Daily avg: 2.3h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-sm text-[#718096]">Study Streak</p>
                      <p className="text-xs text-purple-600">Days in a row</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
