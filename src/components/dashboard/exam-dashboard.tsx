"use client";

import { ChevronLeft, BookMarked, FileText } from "lucide-react";
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
const examSubjects = {
  jee: ["Physics", "Chemistry", "Mathematics"],
  neet: ["Physics", "Chemistry", "Biology"],
  viteee: ["Physics", "Chemistry", "Mathematics", "English"],
  bitsat: ["Physics", "Chemistry", "Mathematics", "English", "Logic"],
  srmjee: ["Physics", "Chemistry", "Mathematics"],
  eamcet: ["Physics", "Chemistry", "Mathematics"],
  mhcet: ["Physics", "Chemistry", "Mathematics"],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50/40">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Exams
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {exam.name}{" "}
                  <span className="text-slate-600 font-medium">
                    Study Center
                  </span>
                </h1>
                <p className="text-slate-500 text-sm">
                  Comprehensive preparation platform
                </p>
              </div>
            </div>

            {/* Quick Access Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheatsheetsClick}
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
              >
                <BookMarked className="h-4 w-4" />
                Cheatsheets
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormulaSheetsClick}
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
              >
                <FileText className="h-4 w-4" />
                Formulas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Dashboard */}
      <ExamSubjectDashboard
        examId={exam.id}
        examName={exam.name}
        subjects={subjects}
        onMockTestClick={handleMockTestClick}
        onQuizClick={handleQuizClick}
        onPYQClick={handlePYQClick}
        onCheatsheetsClick={handleCheatsheetsClick}
        onFormulaSheetsClick={handleFormulaSheetsClick}
      />
    </div>
  );
}
