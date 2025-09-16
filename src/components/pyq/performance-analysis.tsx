"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

interface SubjectData {
  accuracy: string;
  totalTimeTakenSec: number;
  avgTimePerQuestionSec: string;
  totalQuestions: number;
  correctAnswers: number;
  topics: {
    [topicName: string]: any;
  };
}

interface SubjectAnalysisProp {
  [subjectName: string]: SubjectData;
}

export interface PerformanceAnalysisProps {
  subjectAnalysis: SubjectAnalysisProp;
}
interface Subject {
  name: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  avgTimePerQuestion: number;
  status: "excellent" | "good" | "needs-work";
  color: string;
}

const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
}> = ({ value, duration = 1000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const AnimatedProgress: React.FC<{ value: number; className?: string }> = ({
  value,
  className,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return <Progress value={progress} className={className} />;
};

const StatusBadge: React.FC<{ status: Subject["status"] }> = ({ status }) => {
  const configs = {
    excellent: {
      label: "Cutoff Cleared",
      icon: CheckCircle,
      className:
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25",
    },
    good: {
      label: "Close to Cutoff",
      icon: AlertTriangle,
      className:
        "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25",
    },
    "needs-work": {
      label: "Needs Work",
      icon: XCircle,
      className:
        "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} px-3 py-1 text-xs font-medium flex items-center gap-1`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

const SubjectCard: React.FC<{ subject: Subject; index: number }> = ({
  subject,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card
      className={`
        relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 
        hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-20 rounded-lg`}
      />
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/5 to-transparent rounded-lg" />

      <div className="relative p-6 space-y-4">
        {/* Subject Header */}
        <div className="flex items-center justify-between">
          <h3
            className={`text-lg font-semibold bg-gradient-to-r ${subject.color} bg-clip-text text-transparent`}
          >
            {subject.name}
          </h3>
          {/* <StatusBadge status={subject.status} /> */}
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={subject.score} />
              </span>
              <span className="text-lg text-gray-600">
                /{subject.totalQuestions}
              </span>
            </div>
            <p className="text-sm text-gray-500">Questions Correct</p>
          </div>
        </div>

        {/* Accuracy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Accuracy</span>
            <span className="text-sm font-bold text-gray-900">
              <AnimatedCounter value={subject.accuracy} suffix="%" />
            </span>
          </div>
          <AnimatedProgress
            value={subject.accuracy}
            className="h-2 bg-gray-200/50"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Avg Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {subject.avgTimePerQuestion.toFixed(3)}m
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Performance</p>
              <p className="text-sm font-semibold text-gray-900">
                {subject.status === "excellent"
                  ? "Excellent"
                  : subject.status === "good"
                  ? "Good"
                  : "Poor"}
              </p>
            </div>
          </div>
        </div>

        {/* Mini Chart Indicator */}
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`
                h-1 flex-1 rounded-full transition-all duration-500 delay-${
                  i * 50
                }
                ${
                  i < subject.accuracy / 10
                    ? `bg-gradient-to-r ${subject.color}`
                    : "bg-gray-200/50"
                }
              `}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({
  subjectAnalysis,
}: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subjects: Subject[] = useMemo(() => {
    if (!subjectAnalysis) return [];

    return Object.entries(subjectAnalysis).map(([name, data]: any) => {
      const accuracy = parseFloat(data.accuracy);
      let status: Subject["status"];

      if (accuracy >= 85) {
        status = "excellent";
      } else if (accuracy >= 60) {
        status = "good";
      } else {
        status = "needs-work";
      }

      // Define a color mapping for subjects
      const colorMap: { [key: string]: string } = {
        Mathematics: "from-blue-500 to-indigo-600",
        Physics: "from-purple-500 to-violet-600",
        Chemistry: "from-emerald-500 to-teal-600",
        Default: "from-gray-500 to-slate-600",
      };

      return {
        name: name,
        score: data.correctAnswers,
        totalQuestions: data.totalQuestions,
        accuracy: accuracy,
        avgTimePerQuestion: parseFloat(data.avgTimePerQuestionSec) / 60,
        status: status,
        color: colorMap[name] || colorMap.Default,
      };
    });
  }, [subjectAnalysis]);

  if (!mounted) return null;

  const totalScore = subjects.reduce((acc, subject) => acc + subject.score, 0);
  const totalQuestions = subjects.reduce(
    (acc, subject) => acc + subject.totalQuestions,
    0
  );
  const overallAccuracy =
    totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-600">
            Performance Analysis
          </h1>

          {/* Overall Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={totalScore} />
              </div>
              <div className="text-sm text-gray-500">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter
                  value={Math.round(overallAccuracy)}
                  suffix="%"
                />
              </div>
              <div className="text-sm text-gray-500">Overall Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {subjects.filter((s) => s.status === "excellent").length}
              </div>
              <div className="text-sm text-gray-500">Subjects Cleared</div>
            </div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.name} subject={subject} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
