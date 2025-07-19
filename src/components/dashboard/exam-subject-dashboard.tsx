"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  BookOpen,
  Clock,
  Target,
  Trophy,
  ChevronRight,
  Users,
  Calendar,
  ArrowRight,
  FileText,
  BookMarked,
  Calculator,
  FileBarChart,
  TestTube,
  Atom,
  Zap,
  CheckCircle,
  Star,
  History,
  Info,
  TrendingUp,
  Award,
  Brain,
  Rocket,
  Flame,
  CloudLightningIcon,
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  Timer,
  BarChart3,
  Sparkles,
  MousePointer,
} from "lucide-react";

interface ExamSubjectDashboardProps {
  examId: string;
  examName: string;
  subjects: string[];
  metadata: {
    fullName: string;
    tagline: string;
    gradientFrom: string;
    gradientTo: string;
    accentColor: string;
  };
  onMockTestClick: (examId: string) => void;
  onQuizClick: () => void;
  onPYQClick: (year: string) => void;
  onCheatsheetsClick?: () => void;
  onFormulaSheetsClick?: () => void;
}

export const ExamSubjectDashboard = ({
  examId,
  examName,
  subjects,
  metadata,
  onMockTestClick,
  onQuizClick,
  onPYQClick,
  onCheatsheetsClick,
  onFormulaSheetsClick,
}: ExamSubjectDashboardProps) => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pyqYears = [
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
  ];
  const pyqAttempts: Record<string, number> = {
    "2024": 0,
    "2023": 3,
    "2022": 2,
    "2021": 1,
    "2020": 0,
    "2019": 2,
    "2018": 1,
    "2017": 0,
  };

  const performanceStats = {
    mockTests: 12,
    quizzes: 48,
    accuracy: 87,
    streak: 15,
    rank: 245,
    hoursStudied: 156,
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "physics":
        return TestTube;
      case "chemistry":
        return Atom;
      case "mathematics":
      case "math":
        return Calculator;
      case "biology":
        return BookOpen;
      case "english":
        return FileText;
      case "logic":
        return Brain;
      default:
        return FileText;
    }
  };

  const getSubjectColor = (index: number) => {
    const colors = [
      { from: "#6ee7b7", to: "#10b981", bg: "emerald" },
      { from: "#fda4af", to: "#f43f5e", bg: "rose" },
      { from: "#a78bfa", to: "#8b5cf6", bg: "violet" },
      { from: "#fbbf24", to: "#f59e0b", bg: "amber" },
      { from: "#60a5fa", to: "#3b82f6", bg: "blue" },
    ];
    return colors[index % colors.length];
  };

  const handleQuizStart = () => {
    setIsQuizModalOpen(false);
    onQuizClick();
  };

  return (
    <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Mock Tests",
            value: performanceStats.mockTests,
            icon: Target,
            color: "emerald",
          },
          {
            label: "Quizzes Solved",
            value: performanceStats.quizzes,
            icon: Zap,
            color: "violet",
          },
          {
            label: "Accuracy",
            value: `${performanceStats.accuracy}%`,
            icon: TrendingUp,
            color: "rose",
          },
          {
            label: "Study Streak",
            value: `${performanceStats.streak} days`,
            icon: Flame,
            color: "amber",
          },
          {
            label: "Current Rank",
            value: `#${performanceStats.rank}`,
            icon: Trophy,
            color: "blue",
          },
          {
            label: "Hours Studied",
            value: performanceStats.hoursStudied,
            icon: Clock,
            color: "indigo",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="relative bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20"></div>
            <CardContent className="relative z-10 p-4 text-center">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Primary Actions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mock Test Hero Card */}
          <Card
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-0 shadow-2xl overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredCard("mock-test")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform:
                hoveredCard === "mock-test"
                  ? "scale(1.02) rotateX(2deg)"
                  : "scale(1) rotateX(0deg)",
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {/* Animated Background */}
            <div
              className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
              style={{
                background: `linear-gradient(135deg, ${metadata.gradientFrom}, ${metadata.gradientTo})`,
              }}
            ></div>

            {/* Geometric Shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl"></div>

            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Full-Length Mock Tests
                    </h2>
                    <p className="text-slate-300 text-lg">
                      Simulate the real exam environment
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white mb-1">
                    {performanceStats.mockTests}
                  </div>
                  <div className="text-slate-400 text-sm">Completed</div>
                </div>
              </div>

              <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                Challenge yourself with tests designed to match the {examName}{" "}
                pattern and difficulty. Analyze your performance, manage time
                effectively, and get ready for the final exam.
              </p>

              <Button
                onClick={() => onMockTestClick(examId)}
                size="lg"
                className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold py-4 text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 group/btn"
              >
                <Rocket className="w-5 h-5 mr-3 group-hover/btn:rotate-12 transition-transform" />
                Start New Mock Test
                <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-2 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Subjects Grid */}
          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
                  <BookOpenCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    Subject-wise Practice
                  </CardTitle>
                  <p className="text-slate-500">
                    Master each subject with targeted practice sessions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {subjects.map((subject, index) => {
                  const SubjectIcon = getSubjectIcon(subject);
                  const colors = getSubjectColor(index);
                  return (
                    <Card
                      key={subject}
                      className="relative bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
                      onMouseEnter={() => setHoveredCard(subject)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        transform:
                          hoveredCard === subject
                            ? "scale(1.05) rotateY(5deg)"
                            : "scale(1) rotateY(0deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                        }}
                      ></div>
                      <CardContent className="relative z-10 p-4 text-center">
                        <div className="flex justify-center mb-3">
                          <div
                            className={`p-3 bg-${colors.bg}-100 rounded-xl group-hover:scale-110 transition-transform`}
                          >
                            <SubjectIcon
                              className={`w-6 h-6 text-${colors.bg}-600`}
                            />
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">
                          {subject}
                        </h3>
                        <div className="flex justify-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {Math.floor(Math.random() * 50) + 20} Topics
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 30) + 70}% Complete
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Previous Year Questions Redesigned */}
          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                    <History className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Previous Year Questions
                    </CardTitle>
                    <p className="text-slate-500">
                      Practice with authentic exam papers and solutions
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  8 Years Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pyqYears.map((year) => {
                  const attempts = pyqAttempts[year] || 0;
                  const isLatest = year === "2024";
                  const isAttempted = attempts > 0;
                  return (
                    <Card
                      key={year}
                      className="relative bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
                      onClick={() => onPYQClick(year)}
                      onMouseEnter={() => setHoveredCard(`pyq-${year}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        transform:
                          hoveredCard === `pyq-${year}`
                            ? "scale(1.05) translateY(-5px)"
                            : "scale(1) translateY(0px)",
                      }}
                    >
                      {isLatest && (
                        <div className="absolute top-0 right-0 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                          NEW
                        </div>
                      )}
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-3">
                          <div
                            className={`p-3 rounded-xl transition-all duration-300 ${
                              isLatest
                                ? "bg-gradient-to-br from-red-100 to-pink-100"
                                : "bg-slate-100"
                            } group-hover:scale-110`}
                          >
                            <Calendar
                              className={`w-6 h-6 ${
                                isLatest ? "text-red-600" : "text-slate-600"
                              } group-hover:text-orange-600 transition-colors`}
                            />
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">
                          {year}
                        </h3>
                        <p className="text-xs text-slate-600 mb-2">
                          {examName}
                        </p>
                        {isAttempted && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {attempts} attempt{attempts > 1 ? "s" : ""}
                          </Badge>
                        )}
                        {!isAttempted && !isLatest && (
                          <Badge variant="outline" className="text-xs">
                            Not Attempted
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Resources */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Practice Quiz */}
          <Card
            className="relative bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden"
            onMouseEnter={() => setHoveredCard("quiz")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform:
                hoveredCard === "quiz"
                  ? "scale(1.03) rotateZ(1deg)"
                  : "scale(1) rotateZ(0deg)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 group-hover:from-purple-100/70 group-hover:to-pink-100/70 transition-all duration-300"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-bl-3xl"></div>

            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform">
                  <CloudLightningIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Quick Practice
                  </CardTitle>
                  <p className="text-slate-500 text-sm">
                    Focused topic-wise sessions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-6">
              <p className="text-sm text-slate-600 mb-6">
                Sharpen your skills with short, targeted quizzes on specific
                subjects and topics.
              </p>

              <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 shadow-lg hover:shadow-purple/30 transition-all duration-300 group/btn"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Start Quick Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-xl border-white/20">
                  <DialogHeader className="border-b border-slate-200/50 pb-4">
                    <DialogTitle className="text-xl font-bold text-center text-slate-900">
                      Customize Your Quiz
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 p-6">
                    <p className="text-center text-slate-600">
                      Quiz customization options will appear here.
                    </p>
                    <Button
                      onClick={handleQuizStart}
                      disabled
                      className="w-full"
                    >
                      Start Practice Session
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Study Resources Enhanced */}
          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl">
                  <BookMarked className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Study Resources
                  </CardTitle>
                  <p className="text-slate-500 text-sm">
                    Quick reference materials
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {[
                {
                  icon: BookMarked,
                  title: "Cheat Sheets",
                  description: "Key formulas & concepts",
                  color: "emerald",
                  onClick: onCheatsheetsClick,
                  available: true,
                },
                {
                  icon: Calculator,
                  title: "Formula Sheets",
                  description: "Essential formulas & equations",
                  color: "blue",
                  onClick: onFormulaSheetsClick,
                  available: true,
                },
                {
                  icon: BarChart3,
                  title: "Performance Analytics",
                  description: "Detailed progress reports",
                  color: "violet",
                  onClick: undefined,
                  available: false,
                },
                {
                  icon: Users,
                  title: "Study Groups",
                  description: "Collaborative learning",
                  color: "orange",
                  onClick: undefined,
                  available: false,
                },
              ].map((resource, index) => {
                const ResourceIcon = resource.icon;
                return (
                  <Card
                    key={index}
                    className={`relative bg-white/50 backdrop-blur-sm border-0 shadow-sm transition-all duration-300 group overflow-hidden ${
                      resource.available
                        ? "hover:shadow-lg cursor-pointer hover:scale-[1.02]"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={resource.available ? resource.onClick : undefined}
                    onMouseEnter={() =>
                      resource.available && setHoveredCard(`resource-${index}`)
                    }
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${
                        resource.available ? "" : "grayscale"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, var(--${resource.color}-100), var(--${resource.color}-200))`,
                      }}
                    ></div>
                    <CardContent className="relative z-10 p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 bg-${resource.color}-100 rounded-lg ${
                            resource.available
                              ? "group-hover:scale-110 transition-transform"
                              : "grayscale"
                          }`}
                        >
                          <ResourceIcon
                            className={`w-5 h-5 text-${resource.color}-600`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 text-sm">
                            {resource.title}
                            {!resource.available && (
                              <Badge className="ml-2 text-xs bg-slate-200 text-slate-600">
                                Coming Soon
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {resource.description}
                          </p>
                        </div>
                        {resource.available && (
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Today's Goal
                  </CardTitle>
                  <p className="text-slate-500 text-sm">
                    Stay on track with your studies
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-600">Study Time</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800">2.5h</div>
                    <div className="text-xs text-slate-500">of 4h goal</div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: "62.5%" }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-slate-500">
                      Questions Solved
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">89%</div>
                    <div className="text-xs text-slate-500">
                      Today's Accuracy
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  View Detailed Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
