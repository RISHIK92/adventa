
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

interface ExamSubjectDashboardProps {
  examId: string;
  examName: string;
  subjects: string[];
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
  onMockTestClick,
  onQuizClick,
  onPYQClick,
  onCheatsheetsClick,
  onFormulaSheetsClick,
}: ExamSubjectDashboardProps) => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedQuestions, setSelectedQuestions] = useState<string>("");

  // Professional exam data
  const mockTestsCompleted = 5;
  const quizzesSolved = 12;
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
  const pyqAttempts = {
    "2024": 0,
    "2023": 3,
    "2022": 2,
    "2021": 1,
    "2020": 0,
    "2019": 2,
    "2018": 1,
    "2017": 0,
  };

  // Subject icons mapping
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
      default:
        return FileText;
    }
  };

  const handleQuizStart = () => {
    if (selectedSubject && selectedDuration && selectedQuestions) {
      setIsQuizModalOpen(false);
      onQuizClick();
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-100 via-white to-slate-50 min-h-screen">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {mockTestsCompleted}
            </div>
            <div className="text-sm text-slate-600">Mock Tests Taken</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {quizzesSolved}
            </div>
            <div className="text-sm text-slate-600">Practice Sessions</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">87%</div>
            <div className="text-sm text-slate-600">Average Score</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">15</div>
            <div className="text-sm text-slate-600">Study Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Practice Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Tests - Professional Design */}
        <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    Full-Length Mock Tests
                  </CardTitle>
                  <p className="text-blue-100 text-sm">
                    Simulate real exam environment
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white border-0 font-semibold">
                <CheckCircle className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-blue-600">
                    {mockTestsCompleted}
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">
                      Tests Completed
                    </div>
                    <div className="text-xs text-slate-500">
                      Latest: 85% score
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Next Test</div>
                  <div className="text-xs text-blue-600 font-semibold">
                    Available Now
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Duration: 3 Hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>Questions: 90</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onMockTestClick(examId)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                size="lg"
              >
                Start New Mock Test
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Practice Quizzes */}
        <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Practice Quizzes
                </CardTitle>
                <p className="text-emerald-100 text-sm">
                  Subject-wise focused practice
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-emerald-600">
                    {quizzesSolved}
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">
                      Sessions Completed
                    </div>
                    <div className="text-xs text-slate-500">
                      Avg. Score: 89%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">4.8 Rating</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {subjects.slice(0, 3).map((subject) => {
                    const Icon = getSubjectIcon(subject);
                    return (
                      <div
                        key={subject}
                        className="flex flex-col items-center gap-1"
                      >
                        <Icon className="w-5 h-5 text-slate-600" />
                        <span className="text-xs text-slate-600">
                          {subject}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    size="lg"
                  >
                    Configure & Start Quiz
                    <Play className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-white border-slate-200">
                  <DialogHeader className="border-b border-slate-200 pb-4">
                    <DialogTitle className="text-xl font-bold text-center text-slate-900">
                      Customize Your Practice Session
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 p-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Subject
                      </label>
                      <Select
                        value={selectedSubject}
                        onValueChange={setSelectedSubject}
                      >
                        <SelectTrigger className="border-slate-300 focus:border-emerald-500 bg-white">
                          <SelectValue placeholder="Choose subject to practice" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              <div className="flex items-center gap-2">
                                {React.createElement(getSubjectIcon(subject), {
                                  className: "w-4 h-4",
                                })}
                                {subject}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </label>
                      <Select
                        value={selectedDuration}
                        onValueChange={setSelectedDuration}
                      >
                        <SelectTrigger className="border-slate-300 focus:border-blue-500 bg-white">
                          <SelectValue placeholder="Select time limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">
                            15 minutes - Quick Practice
                          </SelectItem>
                          <SelectItem value="30">
                            30 minutes - Standard
                          </SelectItem>
                          <SelectItem value="60">
                            60 minutes - Extended
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Questions
                      </label>
                      <Select
                        value={selectedQuestions}
                        onValueChange={setSelectedQuestions}
                      >
                        <SelectTrigger className="border-slate-300 focus:border-purple-500 bg-white">
                          <SelectValue placeholder="Number of questions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">
                            10 questions - Quick Test
                          </SelectItem>
                          <SelectItem value="20">
                            20 questions - Practice
                          </SelectItem>
                          <SelectItem value="50">
                            50 questions - Challenge
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleQuizStart}
                      disabled={
                        !selectedSubject ||
                        !selectedDuration ||
                        !selectedQuestions
                      }
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      Start Practice Session
                      <Play className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Resources Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cheatsheets Section */}
        <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BookMarked className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Quick Reference Cheatsheets
                </CardTitle>
                <p className="text-purple-100 text-sm">
                  Key concepts & shortcuts
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {subjects.map((subject, index) => {
                  const Icon = getSubjectIcon(subject);
                  return (
                    <div
                      key={subject}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium text-slate-900">
                            {subject} Cheatsheet
                          </div>
                          <div className="text-xs text-slate-500">
                            Key formulas & concepts
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={onCheatsheetsClick}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-medium"
              >
                View All Cheatsheets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formula Sheets Section */}
        <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileBarChart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Formula Reference Sheets
                </CardTitle>
                <p className="text-orange-100 text-sm">
                  Complete formula collection
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {subjects.map((subject, index) => {
                  const Icon = getSubjectIcon(subject);
                  return (
                    <div
                      key={subject}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="font-medium text-slate-900">
                            {subject} Formulas
                          </div>
                          <div className="text-xs text-slate-500">
                            Complete reference guide
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={onFormulaSheetsClick}
                variant="outline"
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 font-medium"
              >
                View All Formula Sheets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Year Questions */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Previous Year Question Papers
                </CardTitle>
                <p className="text-slate-300 text-sm">
                  Authentic exam papers with solutions
                </p>
              </div>
            </div>
            <Badge className="bg-blue-500 text-white border-0 font-semibold">
              Updated 2024
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 font-medium">
                Year-wise Question Banks
              </p>
              <div className="text-sm text-slate-500">
                Click any year to start
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4 min-w-max">
                {pyqYears.map((year) => (
                  <Card
                    key={year}
                    className="min-w-[160px] cursor-pointer group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white relative"
                    onClick={() => onPYQClick(year)}
                  >
                    <CardContent className="p-4 text-center space-y-3">
                      <div className="flex justify-center">
                        <Badge
                          className={`${
                            pyqAttempts[year] > 0
                              ? "bg-green-100 text-green-700 border-green-300"
                              : year === "2024"
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : "bg-slate-100 text-slate-600 border-slate-300"
                          } font-medium`}
                        >
                          {pyqAttempts[year] > 0
                            ? `${pyqAttempts[year]} Attempts`
                            : year === "2024"
                            ? "Latest"
                            : "Available"}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {year}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {year === "2024" ? "Current Year" : "Previous Year"}
                        </p>
                      </div>

                      <div className="pt-2">
                        <div
                          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all ${
                            pyqAttempts[year] > 0
                              ? "bg-green-500 text-white"
                              : "bg-slate-200 text-slate-600 group-hover:bg-slate-700 group-hover:text-white"
                          }`}
                        >
                          {pyqAttempts[year] > 0 ? (
                            <Trophy className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
