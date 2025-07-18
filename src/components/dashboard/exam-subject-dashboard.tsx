
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
  History,
  Info
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

  const mockTestsCompleted = 5;
  const quizzesSolved = 12;
  const pyqYears = [
    "2024", "2023", "2022", "2021",
    "2020", "2019", "2018", "2017",
  ];
  const pyqAttempts: Record<string, number> = {
    "2024": 0, "2023": 3, "2022": 2, "2021": 1,
    "2020": 0, "2019": 2, "2018": 1, "2017": 0,
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "physics": return TestTube;
      case "chemistry": return Atom;
      case "mathematics": case "math": return Calculator;
      case "biology": return BookOpen;
      default: return FileText;
    }
  };

  const handleQuizStart = () => {
    if (selectedSubject && selectedDuration && selectedQuestions) {
      setIsQuizModalOpen(false);
      onQuizClick();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mock Tests Card */}
          <Card className="bg-white/50 backdrop-blur-sm border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-stone-900">
                    Full-Length Mock Tests
                  </CardTitle>
                  <p className="text-stone-500 text-sm">
                    Simulate the real exam environment to test your preparation.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600 mb-4">
                Challenge yourself with tests designed to match the {examName} pattern and difficulty. Analyze your performance, manage time effectively, and get ready for the final exam.
              </p>
              <Button
                onClick={() => onMockTestClick(examId)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-primary/30 transition-all duration-300 group"
                size="lg"
              >
                Start New Mock Test
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
          
          {/* Previous Year Questions */}
          <Card className="bg-white/50 backdrop-blur-sm border-stone-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <History className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-stone-900">
                    Previous Year Question Papers
                  </CardTitle>
                  <p className="text-stone-500 text-sm">
                    Practice with authentic exam papers with detailed solutions.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pyqYears.map((year) => {
                  const attempts = pyqAttempts[year] || 0;
                  const isLatest = year === "2024";
                  const isAttempted = attempts > 0;
                  return (
                    <div
                      key={year}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-3 text-center transition-all duration-300 hover:shadow-md hover:border-accent/50 hover:-translate-y-1"
                      onClick={() => onPYQClick(year)}
                    >
                      {isLatest && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">Latest</Badge>}
                      {isAttempted && !isLatest && <Badge variant="secondary" className="absolute top-2 right-2">{attempts} Attempt{attempts > 1 ? 's' : ''}</Badge>}
                      <div className="flex justify-center items-center mb-1">
                        <Calendar className="w-8 h-8 text-stone-400 group-hover:text-accent transition-colors" />
                      </div>
                      <h3 className="text-md font-bold text-stone-700 group-hover:text-accent/90 transition-colors">
                        {year} Paper
                      </h3>
                      <p className="text-xs text-stone-500">{examName}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Practice Quizzes */}
          <Card className="bg-white/50 backdrop-blur-sm border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-stone-900">
                    Practice Quizzes
                  </CardTitle>
                  <p className="text-stone-500 text-sm">Focused topic-wise practice.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600 mb-4">
                Sharpen your skills with short, targeted quizzes on specific subjects and topics.
              </p>
              <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-primary/30 transition-all duration-300 group"
                    size="lg"
                  >
                    Start a Quiz
                    <Play className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white border-stone-200">
                  <DialogHeader className="border-b border-stone-200 pb-4">
                    <DialogTitle className="text-xl font-bold text-center text-stone-900">Customize Your Quiz</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 p-6">
                    {/* Form elements would go here */}
                     <p className="text-center text-stone-600">Quiz customization options will appear here.</p>
                     <Button onClick={handleQuizStart} disabled className="w-full">
                       Start Practice Session
                     </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          {/* Study Resources */}
          <Card className="bg-white/50 backdrop-blur-sm border-stone-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-stone-900">Study Resources</CardTitle>
                  <p className="text-stone-500 text-sm">Quick reference materials.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div onClick={onCheatsheetsClick} className="flex items-center p-3 bg-stone-50 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer group">
                  <BookMarked className="w-5 h-5 text-accent/80 group-hover:text-accent"/>
                  <span className="ml-3 font-medium text-stone-700 group-hover:text-stone-900">Cheatsheets</span>
                  <ChevronRight className="ml-auto w-4 h-4 text-stone-400 group-hover:text-accent transition-transform group-hover:translate-x-1"/>
              </div>
              <div onClick={onFormulaSheetsClick} className="flex items-center p-3 bg-stone-50 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer group">
                  <FileBarChart className="w-5 h-5 text-accent/80 group-hover:text-accent"/>
                  <span className="ml-3 font-medium text-stone-700 group-hover:text-stone-900">Formula Sheets</span>
                  <ChevronRight className="ml-auto w-4 h-4 text-stone-400 group-hover:text-accent transition-transform group-hover:translate-x-1"/>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
