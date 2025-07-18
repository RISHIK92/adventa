
"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  TrendingUp,
  Users,
  Clock,
  Target,
  Star,
  ArrowRight,
  Calendar,
  Trophy,
  Zap,
} from "lucide-react";

interface ExamCard {
  id: string;
  name: string;
  fullName: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  progress: number;
  subjects: string[];
  nextExam: string;
  difficulty: "Easy" | "Medium" | "Hard";
  registered: number;
  icon: React.ReactNode;
}

interface StatsItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface ExamCardGridProps {
  onExamClick: (examId: string) => void;
}

export const ExamCardGrid: React.FC<ExamCardGridProps> = ({ onExamClick }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const examCards: ExamCard[] = [
    {
      id: "jee",
      name: "JEE",
      fullName: "Joint Entrance Examination",
      color: "from-emerald-100 to-emerald-200",
      gradientFrom: "#6ee7b7",
      gradientTo: "#10b981",
      progress: 75,
      subjects: ["Physics", "Chemistry", "Mathematics"],
      nextExam: "Jan 2025",
      difficulty: "Hard",
      registered: 12500,
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: "neet",
      name: "NEET",
      fullName: "National Eligibility Entrance Test",
      color: "from-rose-100 to-rose-200",
      gradientFrom: "#fda4af",
      gradientTo: "#f43f5e",
      progress: 68,
      subjects: ["Physics", "Chemistry", "Biology"],
      nextExam: "May 2025",
      difficulty: "Hard",
      registered: 18200,
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: "viteee",
      name: "VITEEE",
      fullName: "VIT Engineering Entrance Exam",
      color: "from-violet-100 to-violet-200",
      gradientFrom: "#a78bfa",
      gradientTo: "#8b5cf6",
      progress: 82,
      subjects: ["Physics", "Chemistry", "Mathematics", "English"],
      nextExam: "Apr 2025",
      difficulty: "Medium",
      registered: 8900,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: "bitsat",
      name: "BITSAT",
      fullName: "BITS Admission Test",
      color: "from-amber-100 to-amber-200",
      gradientFrom: "#fbbf24",
      gradientTo: "#f59e0b",
      progress: 91,
      subjects: ["Physics", "Chemistry", "Mathematics", "English"],
      nextExam: "Jun 2025",
      difficulty: "Medium",
      registered: 6700,
      icon: <Trophy className="w-6 h-6" />,
    },
  ];

  const statsData: StatsItem[] = [
    {
      label: "Active Students",
      value: "46,300+",
      icon: <Users className="w-5 h-5" />,
      color: "text-emerald-600",
    },
    {
      label: "Success Rate",
      value: "94%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-violet-600",
    },
    {
      label: "Study Hours",
      value: "1.2M+",
      icon: <Clock className="w-5 h-5" />,
      color: "text-rose-600",
    },
    {
      label: "Top Rankings",
      value: "2,840",
      icon: <Star className="w-5 h-5" />,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-mint-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-200/20 to-lavender-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-rose-200/25 to-blush-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-r from-amber-200/30 to-ochre-200/30 rounded-full blur-3xl animate-pulse delay-[1500ms]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-lg rounded-full px-6 py-3 mb-6 shadow-lg">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span className="text-slate-700 font-medium">
              Excellence in Engineering & Medical
            </span>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Master Your
            <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              Dream Exam
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive preparation platform for India's most competitive
            engineering and medical entrance examinations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="relative p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 rounded-lg"></div>
              <div className="relative z-10 text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-3 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {examCards.map((exam) => (
            <Link key={exam.id} href={`/dashboard/${exam.id}`} passHref>
              <Card
                className="relative bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-700 group cursor-pointer overflow-hidden h-full"
                onMouseEnter={() => setHoveredCard(exam.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform:
                    hoveredCard === exam.id
                      ? "scale(1.05) rotateY(5deg)"
                      : "scale(1) rotateY(0deg)",
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-20 transition-opacity duration-500 group-hover:opacity-30`}
                ></div>

                {/* Geometric Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-bl-3xl"></div>

                <div className="relative z-10 p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${exam.gradientFrom}, ${exam.gradientTo})`,
                      }}
                    >
                      {exam.icon}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.difficulty === "Hard"
                          ? "bg-red-100 text-red-600"
                          : exam.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {exam.difficulty}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">
                      {exam.name}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">
                      {exam.fullName}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Preparation Progress
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {exam.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r transition-all duration-1000 ease-out rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${exam.gradientFrom}, ${exam.gradientTo})`,
                          width:
                            hoveredCard === exam.id ? `${exam.progress}%` : "0%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-5 flex-grow">
                    <div className="text-sm font-medium text-slate-700 mb-2">
                      Subjects
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {exam.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/70 text-xs font-medium text-slate-600 rounded-lg backdrop-blur-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{exam.nextExam}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{exam.registered.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white text-xs px-3 py-1 h-7 group-hover:scale-105 transition-transform duration-300"
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative">
          <Card className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-0 shadow-2xl overflow-hidden">
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 backdrop-blur-3xl"></div>

            {/* Geometric Shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-violet-400/20 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10 text-center p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Excel in Your Entrance Exam?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of successful students who achieved their dreams
                with our comprehensive preparation platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-lg font-semibold px-8 py-3"
                >
                  View All Courses
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
