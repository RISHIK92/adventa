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
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  neet: {
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    tagline: "Gateway to Premier Medical Institutes",
    subjects: ["Physics", "Chemistry", "Biology"],
    gradientFrom: "#6ee7b7",
    gradientTo: "#10b981",
    accentColor: "emerald",
  },
  viteee: {
    name: "VITEEE",
    fullName:
      "Vellore Institute of Technology Engineering Entrance Examination",
    tagline: "Gateway to VIT's Premier Engineering Programs",
    subjects: ["Physics", "Chemistry", "Mathematics", "English", "Aptitude"],
    gradientFrom: "#60a5fa",
    gradientTo: "#3b82f6",
    accentColor: "green",
  },
  bitsat: {
    name: "BITSAT",
    fullName: "Birla Institute of Technology and Science Admission Test",
    tagline: "Gateway to BITS Pilani, Goa & Hyderabad",
    subjects: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "English",
      "Logical Reasoning",
    ],
    gradientFrom: "#fbbf24",
    gradientTo: "#f59e0b",
    accentColor: "amber",
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
    color: "green",
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
  const router = useRouter();
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

      <div className="relative z-10 p-6 max-w-7xl mx-auto flex flex-col space-y-8">
        {/* --- ROW 1: CORE MOCK TESTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mock Tests Card */}
          <Card
            className="relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-1"
            onClick={() => router.push(`/dashboard/${exam.name}/mock-tests`)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50 group-hover:from-amber-100/70 group-hover:to-orange-100/70 transition-all"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/40 to-transparent rounded-bl-3xl"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-orange-800">
                  Mock Tests
                </h2>
                <ChevronRight className="w-8 h-8 text-orange-500 group-hover:text-orange-700 group-hover:translate-x-2 transition-all" />
              </div>
              <p className="text-orange-700 mb-6 leading-relaxed">
                Experience the real exam environment with timed tests that match
                the exact {exam.name} pattern.
              </p>
              <div className="flex items-center justify-between text-sm text-orange-600 font-medium">
                <span>12 Available Tests</span>
                <span>Full Syllabus</span>
              </div>
            </CardContent>
          </Card>

          {/* Create Custom Mock Test Card (using green theme for distinction) */}
          <Card
            className="relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-1"
            onClick={() => router.push(`/dashboard/${exam.name}/custom-mock`)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 group-hover:from-green-100/70 group-hover:to-emerald-100/70 transition-all"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/40 to-transparent rounded-bl-3xl"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-800">
                  Custom Mock Test
                </h2>
                <ChevronRight className="w-8 h-8 text-green-500 group-hover:text-green-700 group-hover:translate-x-2 transition-all" />
              </div>
              <p className="text-green-700 mb-6 leading-relaxed">
                Design your own mock test by selecting chapters for a tailored
                practice session.
              </p>
              <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                <span>Personalized Practice</span>
                <span>Flexible Duration</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- ROW 2: TARGETED PRACTICE TOOLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Revision Tests",
              icon: History,
              color: "teal",
              desc: "Solidify your knowledge with tests focused on previously covered topics and questions.",
              path: `/dashboard/${exam.name}/revision-tests`,
            },
            {
              title: "PYQ Papers",
              icon: Calendar,
              color: "amber",
              desc: "Solve full papers from previous years to understand the exam pattern.",
              path: `/dashboard/${exam.name}/pyq`,
            },
            {
              title: "Chapter-wise PYQs",
              icon: Brain,
              color: "green",
              desc: "Sharpen specific skills by solving previous year questions organized by topic and chapter.",
              path: `/dashboard/${exam.name}/pyq/practice`,
            },
            {
              title: "Mistake Bank",
              icon: Target,
              color: "red",
              desc: "Revisit and learn from every question you answered incorrectly.",
              path: `/dashboard/${exam.name}/mistakes`,
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 flex flex-col"
              onClick={() => router.push(item.path)}
            >
              <CardContent className="p-6 flex flex-col flex-grow">
                <div
                  className={`p-3 self-start bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-xl mb-4`}
                >
                  {/* <item.icon className={`w-7 h-7 text-${item.color}-600`} /> */}
                </div>
                <h3 className="font-bold text-lg text-slate-800">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 flex-grow">
                  {item.desc}
                </p>
                <div
                  className={`flex items-center mt-6 text-sm font-semibold text-${item.color}-600 group-hover:text-${item.color}-700`}
                >
                  <span>Start Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- ROW 3: ANALYSIS & IMPROVEMENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card
            className="relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-1"
            onClick={() => router.push(`/dashboard/${exam.name}/quizzes`)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 group-hover:from-blue-100/70 group-hover:to-indigo-100/70 transition-all"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-200/40 to-transparent rounded-bl-3xl"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-800">
                  Custom Quiz
                </h2>
                <ChevronRight className="w-8 h-8 text-blue-500 group-hover:text-blue-700 group-hover:translate-x-2 transition-all" />
              </div>
              <p className="text-blue-700 mb-6 leading-relaxed">
                Sharpen specific skills by solving previous year questions
                organized by topic and chapter.
              </p>
              <div className="flex items-center justify-between text-sm text-blue-800">
                <span>500+ Topics</span>
                <span>Instant Solutions</span>
              </div>
            </CardContent>
          </Card>

          {/* Mistake Bank Card */}
          <Card
            className="relative bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-1"
            onClick={() => router.push(`/dashboard/${exam.name}/weakness-test`)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-200/50 to-rose-100/80 group-hover:from-red-100/70 group-hover:to-rose-200/70 transition-all"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-200/40 to-transparent rounded-bl-3xl"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-800">
                  Weakness Test
                </h2>
                <ChevronRight className="w-8 h-8 text-red-500 group-hover:text-red-700 group-hover:translate-x-2 transition-all" />
              </div>
              <p className="text-red-700 mb-6 leading-relaxed">
                Turn your weaknesses into strengths with our smart weakness
                tests
              </p>
              <div className="flex items-center justify-between text-sm text-red-600 font-medium">
                <span>Personalized Error Log</span>
                <span>Improve Accuracy</span>
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
                            : "bg-green-500/20 text-green-300 border-green-500/30"
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
            {exam.subjects.map((subject: any) => (
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
