"use client";

import { ChevronLeft, BookMarked, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamSubjectDashboard } from "./exam-subject-dashboard";

interface ExamDetails {
  id: string;
  name: string;
  subject?: string;
  date?: string;
  duration?: string;
  totalQuestions?: number;
  completedQuestions?: number;
}

interface ExamDashboardProps {
  exam: ExamDetails;
  onNavigate?: (section: string) => void;
  onBreadcrumbClick?: (path: string) => void;
  onBackClick?: () => void;
}

// Define subjects for each exam
const examSubjects: Record<string, string[]> = {
  jee: ["Physics", "Chemistry", "Mathematics"],
  neet: ["Physics", "Chemistry", "Biology"],
  viteee: ["Physics", "Chemistry", "Mathematics", "English"],
  bitsat: ["Physics", "Chemistry", "Mathematics", "English", "Logic"],
  srmjee: ["Physics", "Chemistry", "Mathematics"],
  eamcet: ["Physics", "Chemistry", "Mathematics"],
  mhcet: ["Physics", "Chemistry", "Mathematics"],
};

// Enhanced exam metadata
const examMetadata: Record<
  string,
  {
    fullName: string;
    tagline: string;
    gradientFrom: string;
    gradientTo: string;
    accentColor: string;
  }
> = {
  jee: {
    fullName: "Joint Entrance Examination",
    tagline: "Gateway to Premier Engineering Institutes",
    gradientFrom: "#6ee7b7",
    gradientTo: "#10b981",
    accentColor: "emerald",
  },
  neet: {
    fullName: "National Eligibility Entrance Test",
    tagline: "Your Path to Medical Excellence",
    gradientFrom: "#fda4af",
    gradientTo: "#f43f5e",
    accentColor: "rose",
  },
  viteee: {
    fullName: "VIT Engineering Entrance Exam",
    tagline: "Innovation Meets Excellence",
    gradientFrom: "#a78bfa",
    gradientTo: "#8b5cf6",
    accentColor: "violet",
  },
  bitsat: {
    fullName: "BITS Admission Test",
    tagline: "Where Dreams Take Flight",
    gradientFrom: "#fbbf24",
    gradientTo: "#f59e0b",
    accentColor: "amber",
  },
};

export default function ExamDashboard({
  exam,
  onNavigate,
  onBreadcrumbClick,
  onBackClick,
}: ExamDashboardProps) {
  const subjects = examSubjects[exam.id as keyof typeof examSubjects] || [
    "Physics",
    "Chemistry",
    "Mathematics",
  ];

  const metadata = examMetadata[exam.id] || {
    fullName: exam.name,
    tagline: "Excellence in Preparation",
    gradientFrom: "#6ee7b7",
    gradientTo: "#10b981",
    accentColor: "emerald",
  };

  const handleMockTestClick = (examId: string) => {
    console.log(`Starting mock test for exam: ${examId}`);
    onNavigate?.("mock-test");
  };

  const handleQuizClick = () => {
    console.log("Quiz started with selected parameters");
    onNavigate?.("quiz");
  };

  const handlePYQClick = (year: string) => {
    console.log(`Opening PYQ for year: ${year}`);
    onNavigate?.(`pyq-${year}`);
  };

  const handleCheatsheetsClick = () => {
    console.log("Opening cheatsheets");
    onNavigate?.("cheatsheets");
  };

  const handleFormulaSheetsClick = () => {
    console.log("Opening formula sheets");
    onNavigate?.("formula-sheets");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-mint-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-200/20 to-lavender-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-rose-200/25 to-blush-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-r from-amber-200/30 to-ochre-200/30 rounded-full blur-3xl animate-pulse delay-[1500ms]"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Exams
              </Button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1
                    className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent tracking-tight"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${metadata.gradientFrom}, ${metadata.gradientTo})`,
                    }}
                  >
                    {exam.name}
                  </h1>
                  <div className="inline-flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700">
                      Study Center
                    </span>
                  </div>
                </div>
                <p className="text-lg text-slate-600 font-medium">
                  {metadata.fullName}
                </p>
                <p className="text-sm text-slate-500 italic">
                  {metadata.tagline}
                </p>
              </div>
            </div>

            {/* Enhanced Quick Access */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheatsheetsClick}
                className="gap-2 bg-white/40 backdrop-blur-sm border-white/30 hover:bg-white/60 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <BookMarked className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-700">Cheatsheets</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormulaSheetsClick}
                className="gap-2 bg-white/40 backdrop-blur-sm border-white/30 hover:bg-white/60 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <FileText className="h-4 w-4 text-violet-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-700">Formulas</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ExamSubjectDashboard
        examId={exam.id}
        examName={exam.name}
        subjects={subjects}
        metadata={metadata}
        onMockTestClick={handleMockTestClick}
        onQuizClick={handleQuizClick}
        onPYQClick={handlePYQClick}
        onCheatsheetsClick={handleCheatsheetsClick}
        onFormulaSheetsClick={handleFormulaSheetsClick}
      />
    </div>
  );
}
