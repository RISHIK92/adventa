"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { ExamCardGrid } from "@/components/dashboard/exam-card-grid";
import ExamDashboard from "@/components/dashboard/exam-dashboard";
import QuizInterface from "@/components/dashboard/quiz-interface";
import PerformanceAnalytics from "@/components/dashboard/performance-analytics";
import TimetablePlanner from "@/components/dashboard/timetable-planner";

type ViewType =
  | "dashboard"
  | "exam-dashboard"
  | "quiz"
  | "study-material"
  | "practice-tests"
  | "performance"
  | "timetable"
  | "profile";

interface ExamDetails {
  id: string;
  name: string;
  subject?: string;
  date?: string;
  duration?: string;
  totalQuestions?: number;
  completedQuestions?: number;
}

export default function StudyDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedExam, setSelectedExam] = useState<ExamDetails | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Exam name mapping
  const examNames = {
    jee: "JEE Main 2024",
    neet: "NEET 2024",
    viteee: "VITEEE 2024",
    bitsat: "BITSAT 2024",
    srmjee: "SRMJEE 2024",
    eamcet: "AP-TS EAMCET 2024",
    mhcet: "MHCET 2024",
  };

  const handleNavigation = (path: string) => {
    const viewMap: Record<string, ViewType> = {
      "/dashboard": "dashboard",
      "/study-material": "study-material",
      "/practice-tests": "practice-tests",
      "/performance": "performance",
      "/timetable": "timetable",
      "/profile": "profile",
    };

    const view = viewMap[path] || "dashboard";
    setCurrentView(view);

    // Reset state when navigating to dashboard
    if (view === "dashboard") {
      setSelectedExam(null);
    }
  };

  const handleExamSelect = (examId: string) => {
    // Set exam data based on examId
    const examData: ExamDetails = {
      id: examId,
      name: examNames[examId as keyof typeof examNames] || examId.toUpperCase(),
    };
    setSelectedExam(examData);
    setCurrentView("exam-dashboard");
  };

  const handleExamSectionNavigate = (section: string) => {
    switch (section) {
      case "study-material":
        setCurrentView("study-material");
        break;
      case "quiz":
        setCurrentView("quiz");
        break;
      case "mock-test":
        setCurrentView("quiz");
        break;
      case "performance":
        setCurrentView("performance");
        break;
      default:
        setCurrentView("exam-dashboard");
    }
  };

  const handleBackClick = () => {
    setCurrentView("dashboard");
    setSelectedExam(null);
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === "dashboard") {
      setCurrentView("dashboard");
      setSelectedExam(null);
    } else if (path === "exams") {
      if (selectedExam) {
        setCurrentView("exam-dashboard");
      } else {
        setCurrentView("dashboard");
      }
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <ExamCardGrid onExamClick={handleExamSelect} />;

      case "exam-dashboard":
        return selectedExam ? (
          <ExamDashboard
            exam={selectedExam}
            onNavigate={handleExamSectionNavigate}
            onBreadcrumbClick={handleBreadcrumbClick}
            onBackClick={handleBackClick}
          />
        ) : (
          <ExamCardGrid onExamClick={handleExamSelect} />
        );

      case "quiz":
        return <QuizInterface questions={[]} />;

      case "performance":
        return <PerformanceAnalytics userId="user123" timeRange="month" />;

      case "timetable":
        return <TimetablePlanner />;

      case "study-material":
        return (
          <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
                Study Material
              </h1>
              <p className="text-slate-600">
                Study material content coming soon...
              </p>
            </div>
          </div>
        );

      case "practice-tests":
        return (
          <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
                Practice Tests
              </h1>
              <p className="text-slate-600">
                Practice tests content coming soon...
              </p>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 min-h-screen">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
                Profile
              </h1>
              <p className="text-slate-600">Profile content coming soon...</p>
            </div>
          </div>
        );

      default:
        return <ExamCardGrid onExamClick={handleExamSelect} />;
    }
  };

  const getCurrentPath = () => {
    const pathMap: Record<ViewType, string> = {
      dashboard: "/dashboard",
      "exam-dashboard": "/dashboard",
      quiz: "/practice-tests",
      "study-material": "/study-material",
      "practice-tests": "/practice-tests",
      performance: "/performance",
      timetable: "/timetable",
      profile: "/profile",
    };
    return pathMap[currentView] || "/dashboard";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <DashboardSidebar
        onNavigate={handleNavigation}
        currentPath={getCurrentPath()}
      /> */}

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-1" : "lg:ml-1"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
