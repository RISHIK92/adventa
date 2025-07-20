"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  BookMarked,
  FileText,
  Sparkles,
  Play,
  BookOpen,
  Clock,
  Target,
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  Calculator,
  TestTube,
  Atom,
  Brain,
  History,
  TrendingUp,
  Award,
  Rocket,
  Flame,
  CloudLightning,
  BookOpenCheck,
  Timer,
  BarChart3,
  MousePointer,
  CheckCircle,
  Star,
  Zap,
  GraduationCap,
  Layers,
} from "lucide-react";

// Mock data for different sections
const examData = {
  jee: {
    name: "JEE",
    fullName: "Joint Entrance Examination",
    tagline: "Gateway to Premier Engineering Institutes",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    gradientFrom: "#6ee7b7",
    gradientTo: "#10b981",
    accentColor: "emerald",
  },
};

const mockTestsData = [
  {
    id: "jee-main-2024-1",
    title: "JEE Main 2024 - Practice Test 1",
    difficulty: "Medium",
    duration: "3 hours",
    questions: 90,
    attempted: false,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    pattern: "Latest Pattern",
    rating: 4.8,
  },
  {
    id: "jee-main-2024-2",
    title: "JEE Main 2024 - Practice Test 2",
    difficulty: "Hard",
    duration: "3 hours",
    questions: 90,
    attempted: true,
    score: 245,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    pattern: "Latest Pattern",
    rating: 4.9,
  },
  {
    id: "jee-advanced-2024-1",
    title: "JEE Advanced 2024 - Paper 1",
    difficulty: "Very Hard",
    duration: "3 hours",
    questions: 54,
    attempted: false,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    pattern: "Advanced Level",
    rating: 4.7,
  },
];

const pyqData = Array.from({ length: 8 }, (_, i) => ({
  year: (2024 - i).toString(),
  attempts: Math.floor(Math.random() * 4),
  avgScore: Math.floor(Math.random() * 50) + 200,
  totalQuestions: 90,
  subjects: ["Physics", "Chemistry", "Mathematics"],
  isLatest: i === 0,
}));

const cheatSheetsData = [
  {
    id: "physics-mechanics",
    title: "Classical Mechanics",
    subject: "Physics",
    topics: 24,
    color: "blue",
    icon: TestTube,
    lastUpdated: "2 days ago",
  },
  {
    id: "chemistry-organic",
    title: "Organic Chemistry",
    subject: "Chemistry",
    topics: 18,
    color: "green",
    icon: Atom,
    lastUpdated: "1 week ago",
  },
  {
    id: "math-calculus",
    title: "Calculus & Derivatives",
    subject: "Mathematics",
    topics: 32,
    color: "purple",
    icon: Calculator,
    lastUpdated: "3 days ago",
  },
];

export default function ImmersiveExamDashboard({ examName }) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentExam] = useState(examName);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const exam = examData[currentExam];

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-mint-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-200/20 to-lavender-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-rose-200/25 to-blush-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold bg-clip-text tracking-tight">
                    {exam.name}
                  </h1>
                  <div className="inline-flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700">
                      Study Center
                    </span>
                  </div>
                </div>
                <p className="text-xl text-slate-600 font-medium">
                  {exam.fullName}
                </p>
                <p className="text-sm text-slate-500 italic">{exam.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mock Tests Section */}
          <Card
            className="relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:scale-100"
            onClick={() => setCurrentView("mock-tests")}
          >
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50 group-hover:from-amber-100/70 group-hover:to-orange-100/70 transition-all"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/40 to-transparent rounded-bl-3xl"></div>

            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold text-orange-800 mb-2">
                      Mock Tests
                    </h2>
                    <p className="text-orange-700">
                      Full-length practice exams
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-orange-500 group-hover:text-orange-700 group-hover:translate-x-2 transition-all" />
              </div>

              <p className="text-orange-700 mb-6 leading-relaxed">
                Experience the real exam environment with timed tests that match
                the exact {exam.name} pattern.
              </p>

              <div className="flex items-center justify-between text-sm text-orange-600 font-medium">
                <span>12 Available Tests</span>
                <span>3 Hours Each</span>
                <span>90 Questions</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:scale-100"
            onClick={() => setCurrentView("quiz")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 group-hover:from-green-100/70 group-hover:to-emerald-100/70 transition-all"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/40 to-transparent rounded-bl-3xl"></div>

            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">
                      Quick Practice
                    </h2>
                    <p className="text-green-700">
                      Topic-wise focused sessions
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-green-500 group-hover:text-green-700 group-hover:translate-x-2 transition-all" />
              </div>
              <p className="text-green-700 mb-6 leading-relaxed">
                Sharpen specific skills with customizable quizzes on individual
                topics and concepts.
              </p>
              <div className="flex items-center justify-between text-sm text-green-800">
                <span>500+ Topics</span>
                <span>5–50 Questions</span>
                <span>Instant Results</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Previous Year Questions */}
          <Card
            className="bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
            onClick={() => setCurrentView("pyq")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                    <History className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Previous Years
                    </CardTitle>
                    <p className="text-sm text-slate-500">2017-2024 Papers</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Practice with authentic exam papers from the last 8 years.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>8 Years Available</div>
                <div>Complete Solutions</div>
                <div>Performance Analysis</div>
              </div>
            </CardContent>
          </Card>

          {/* Cheat Sheets */}
          <Card
            className="bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
            onClick={() => setCurrentView("cheatsheets")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                    <BookMarked className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Cheat Sheets
                    </CardTitle>
                    <p className="text-sm text-slate-500">Quick References</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Essential concepts and formulas organized by topics.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>74 Cheat Sheets</div>
                <div>All Subjects Covered</div>
                <div>Regularly Updated</div>
              </div>
            </CardContent>
          </Card>

          {/* Formula Sheets */}
          <Card
            className="bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
            onClick={() => setCurrentView("formulas")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Formula Sheets
                    </CardTitle>
                    <p className="text-sm text-slate-500">Mathematical Tools</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Comprehensive collection of essential formulas and equations.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>200+ Formulas</div>
                <div>Subject-wise Organized</div>
                <div>Easy to Reference</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderMockTests = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
                className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-3xl font-bold text-white">Mock Tests</h1>
                <p className="text-white/70">
                  Full-length practice examinations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <div className="grid gap-6">
          {mockTestsData.map((test, index) => (
            <Card
              key={test.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-white">
                        {test.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`${
                          test.attempted
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {test.attempted ? "Completed" : "Not Attempted"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/30 text-white/70"
                      >
                        {test.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-white/60 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {test.questions} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {test.rating} Rating
                      </span>
                      {test.attempted && (
                        <span className="flex items-center gap-1 text-green-300">
                          <Trophy className="w-4 h-4" />
                          Score: {test.score}/300
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {test.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="outline"
                          className="border-white/20 text-white/60 text-xs"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {test.attempted && (
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        View Results
                      </Button>
                    )}
                    <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold">
                      <Play className="w-4 h-4 mr-2" />
                      {test.attempted ? "Retake" : "Start Test"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPYQ = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Previous Year Questions
                </h1>
                <p className="text-slate-600">
                  Practice with authentic exam papers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {pyqData.map((yearData, index) => (
            <Card
              key={yearData.year}
              className="min-w-[300px] bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl ${
                        yearData.isLatest
                          ? "bg-gradient-to-br from-red-100 to-pink-100"
                          : "bg-slate-100"
                      }`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${
                          yearData.isLatest ? "text-red-600" : "text-slate-600"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {exam.name} {yearData.year}
                      </CardTitle>
                      {yearData.isLatest && (
                        <Badge className="mt-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">Questions</div>
                    <div className="font-semibold text-slate-900">
                      {yearData.totalQuestions}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Attempts</div>
                    <div className="font-semibold text-slate-900">
                      {yearData.attempts}
                    </div>
                  </div>
                  {yearData.attempts > 0 && (
                    <>
                      <div>
                        <div className="text-slate-500">Best Score</div>
                        <div className="font-semibold text-green-600">
                          {yearData.avgScore}/300
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Status</div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-semibold">
                            Completed
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  {yearData.subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="mr-2 text-xs"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  {yearData.attempts > 0 && (
                    <Button variant="outline" size="sm" className="flex-1">
                      View Results
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {yearData.attempts > 0 ? "Retry" : "Start"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation hint */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-full">
            <ChevronLeft className="w-4 h-4" />
            <span>Scroll horizontally to view all years</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCheatSheets = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Cheat Sheets
                </h1>
                <p className="text-slate-600">
                  Quick reference guides for all topics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {cheatSheetsData.map((sheet, index) => {
            const IconComponent = sheet.icon;
            return (
              <Card
                key={sheet.id}
                className="min-w-[280px] bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-${sheet.color}-100`}>
                      <IconComponent
                        className={`w-6 h-6 text-${sheet.color}-600`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {sheet.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {sheet.subject}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-slate-600">
                    Comprehensive guide covering {sheet.topics} essential topics
                    with formulas, concepts, and quick tips.
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{sheet.topics} Topics</span>
                    <span>Updated {sheet.lastUpdated}</span>
                  </div>

                  <Button className="w-full" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Open Cheat Sheet
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Subject Filter */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2 bg-white/50 p-2 rounded-xl">
            {exam.subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setSelectedSubject(
                    selectedSubject === subject ? null : subject
                  )
                }
                className="text-sm"
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on current view
  switch (currentView) {
    case "mock-tests":
      return renderMockTests();
    case "pyq":
      return renderPYQ();
    case "cheatsheets":
      return renderCheatSheets();
    case "quiz":
    case "formulas":
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg p-8 text-center">
            <div className="mb-4">
              <Layers className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Coming Soon
              </h2>
              <p className="text-slate-600 mb-6">
                This section is under development and will be available soon.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentView("dashboard")}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      );
    default:
      return renderDashboard();
  }
}
