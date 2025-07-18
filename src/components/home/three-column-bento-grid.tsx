"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef, useId } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Clock,
  TrendingUp,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";

export function ThreeColumnBentoGrid() {
  return (
    <div className="mx-auto my-20 w-full max-w-7xl px-4 md:px-8">
      <h2 className="text-bold text-[var(--foreground)] font-[var(--font-inter)] text-xl font-bold tracking-tight md:text-4xl">
        Comprehensive Exam Preparation Platform
      </h2>
      <p className="mt-4 max-w-lg text-sm text-[var(--muted-foreground)] font-[var(--font-inter)]">
        Master your exams with AI-powered tools, comprehensive practice
        materials, and intelligent progress tracking designed to maximize your
        success.
      </p>
      <div className="mt-20 grid grid-flow-col grid-cols-1 grid-rows-6 gap-2 md:grid-cols-2 md:grid-rows-3 xl:grid-cols-3 xl:grid-rows-2">
        <Card className="row-span-2">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>AI-Generated Quizzes</CardTitle>
            </div>
            <CardDescription>
              Adaptive difficulty quizzes with instant feedback that adjust to
              your learning pace and knowledge gaps.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonOne />
          </CardSkeletonBody>
        </Card>
        <Card className="overflow-hidden">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Mock Tests</CardTitle>
            </div>
            <CardDescription>
              Real exam simulation with precise timers and authentic test
              environment for complete preparation.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonTwo />
          </CardSkeletonBody>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Performance Analytics</CardTitle>
            </div>
            <CardDescription>
              Detailed progress tracking with weak area identification and
              improvement recommendations.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody className="">
            <SkeletonThree />
          </CardSkeletonBody>
        </Card>
        <Card className="row-span-2">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Cheat Sheets & Formulas</CardTitle>
            </div>
            <CardDescription>
              Organized quick reference materials and formula sheets for instant
              access during study sessions.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody className="h-full max-h-full overflow-hidden">
            <SkeletonFour />
          </CardSkeletonBody>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Dynamic Timetables</CardTitle>
            </div>
            <CardDescription>
              Smart scheduling that adapts based on your progress and exam dates
              for optimal time management.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonFive />
          </CardSkeletonBody>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Previous Year Questions</CardTitle>
            </div>
            <CardDescription>
              Comprehensive question bank with detailed solutions from past
              examinations and practice papers.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonSix />
          </CardSkeletonBody>
        </Card>
      </div>
    </div>
  );
}

// Skeletons

const SkeletonOne = () => {
  const quizzes = [
    {
      subject: "Mathematics",
      difficulty: "Medium",
      score: 85,
      questions: 15,
      color: "bg-[#ff6b35]",
    },
    {
      subject: "Physics",
      difficulty: "Hard",
      score: 72,
      questions: 20,
      color: "bg-[#12b981]",
    },
    {
      subject: "Chemistry",
      difficulty: "Easy",
      score: 94,
      questions: 12,
      color: "bg-yellow-600",
    },
    {
      subject: "Biology",
      difficulty: "Medium",
      score: 88,
      questions: 18,
      color: "bg-[#3c82f6]",
    },
  ];

  const [active, setActive] = useState(quizzes[0]);

  const intervalTime = 2000;

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => {
        const currentIndex = quizzes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % quizzes.length;
        return quizzes[nextIndex];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  const Highlighter = () => {
    return (
      <motion.div layoutId="highlighter" className="absolute inset-0">
        <div className="absolute -left-px -top-px h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-[var(--accent)] bg-transparent"></div>
        <div className="absolute -right-px -top-px h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-[var(--accent)] bg-transparent"></div>
        <div className="absolute -bottom-px -left-px h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-[var(--accent)] bg-transparent"></div>
        <div className="absolute -bottom-px -right-px h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-[var(--accent)] bg-transparent"></div>
      </motion.div>
    );
  };

  const Score = () => {
    return (
      <motion.span
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1,
          repeat: 0,
        }}
        className="absolute inset-x-0 bottom-2 m-auto h-fit z-50 w-fit rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs text-[var(--card-foreground)]"
      >
        <CheckCircle className="inline h-3 w-3 mr-1 text-[#12b981]" />
        <span className="font-bold">{active.score}%</span>
      </motion.span>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 justify-center gap-4">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={`quiz-${index}`}
            className="relative"
            animate={{
              opacity: active.subject === quiz.subject ? 1 : 0.5,
              scale: active.subject === quiz.subject ? 0.95 : 1,
            }}
            transition={{ duration: 1 }}
          >
            {active.subject === quiz.subject && <Highlighter />}
            {active.subject === quiz.subject && <Score />}
            <div
              className={cn(
                "h-[120px] w-full rounded-lg p-4 text-white",
                quiz.color
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-4 w-4" />
                <span className="text-xs px-2 py-1 bg-white/20 rounded">
                  {quiz.difficulty}
                </span>
              </div>
              <h4 className="font-medium text-sm mb-1">{quiz.subject}</h4>
              <p className="text-xs opacity-90">{quiz.questions} questions</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonTwo = () => {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-6">
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Mock Test In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-orange-600">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="bg-gray-100 rounded-full h-2 mb-2">
          <div
            className="bg-[#12b981] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((1800 - timeLeft) / 1800) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
          <span>Question 15 of 50</span>
          <span>30% Complete</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50 rounded p-2">
          <div className="font-medium">Attempted</div>
          <div className="text-[#12b981]">14</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="font-medium">Remaining</div>
          <div className="text-[#ff6b35]">36</div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonThree = () => {
  const performanceData = [
    { subject: "Math", score: 85, trend: "up" },
    { subject: "Physics", score: 72, trend: "down" },
    { subject: "Chemistry", score: 94, trend: "up" },
    { subject: "Biology", score: 88, trend: "up" },
  ];

  return (
    <div className="p-6">
      <div className="space-y-3">
        {performanceData.map((item, index) => (
          <motion.div
            key={item.subject}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-sm font-medium">{item.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-[var(--background)] rounded-full h-2">
                <div
                  className="bg-[#12b981] h-2 rounded-full"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold w-8">{item.score}%</span>
              <TrendingUp
                className={cn(
                  "h-3 w-3",
                  item.trend === "up"
                    ? "text-[#12b981]"
                    : "text-[var(--destructive)]"
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonFour = () => {
  const cheatSheets = [
    {
      title: "Calculus Formulas",
      category: "Mathematics",
      color: "bg-[#ff6b35]",
    },
    {
      title: "Physics Constants",
      category: "Physics",
      color: "bg-[#12b981]",
    },
    {
      title: "Chemical Equations",
      category: "Chemistry",
      color: "bg-[#f59e0c]",
    },
    {
      title: "Biology Processes",
      category: "Biology",
      color: "bg-[#3c82f6]",
    },
  ];

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 gap-2 h-full">
        {cheatSheets.map((sheet, index) => (
          <motion.div
            key={sheet.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-3 rounded-lg text-white flex items-center gap-2",
              sheet.color
            )}
          >
            <BookOpen className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium text-sm">{sheet.title}</div>
              <div className="text-xs opacity-90">{sheet.category}</div>
            </div>
            <Target className="h-3 w-3 opacity-75" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SkeletonFive = () => {
  const schedule = [
    {
      time: "09:00",
      subject: "Mathematics",
      duration: "2h",
      status: "completed",
    },
    { time: "11:30", subject: "Physics", duration: "1.5h", status: "current" },
    { time: "13:00", subject: "Break", duration: "30m", status: "upcoming" },
    { time: "13:30", subject: "Chemistry", duration: "2h", status: "upcoming" },
  ];

  return (
    <div className="p-6">
      <div className="space-y-2">
        {schedule.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg",
              item.status === "completed"
                ? "bg-green-50"
                : item.status === "current"
                ? "bg-orange-50"
                : "bg-gray-50"
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                item.status === "completed"
                  ? "bg-[var(--secondary)]"
                  : item.status === "current"
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--muted-foreground)]"
              )}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{item.subject}</div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {item.time} • {item.duration}
              </div>
            </div>
            {item.status === "current" && (
              <Zap className="h-3 w-3 text-[var(--accent)]" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SkeletonSix = () => {
  const questions = [
    { year: "2023", subject: "Math", questions: 50, solved: 45 },
    { year: "2022", subject: "Physics", questions: 40, solved: 38 },
    { year: "2021", subject: "Chemistry", questions: 45, solved: 42 },
    { year: "2020", subject: "Biology", questions: 35, solved: 35 },
  ];

  return (
    <div className="p-6">
      <div className="space-y-2">
        {questions.map((q, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#ff6b35]" />
              <div>
                <div className="text-sm font-medium">
                  {q.year} {q.subject}
                </div>
                <div className="text-xs text-gray-500">
                  {q.questions} questions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs">
                <span className="text-[#12b981] font-medium">{q.solved}</span>
                <span className="text-[var(--muted-foreground)]">
                  /{q.questions}
                </span>
              </div>
              <CheckCircle
                className={cn(
                  "h-4 w-4",
                  q.solved === q.questions
                    ? "text-[#12b981]"
                    : "text-[var(--muted-foreground)]"
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Card structure
const CardSkeletonBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("", className)}>{children}</div>;
};

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "font-[var(--font-inter)] text-sm font-medium tracking-tight text-[var(--foreground)]",
        className
      )}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "mt-2 max-w-xs font-[var(--font-inter)] text-sm font-normal tracking-tight text-[var(--muted-foreground)]",
        className
      )}
    >
      {children}
    </h3>
  );
};

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover="animate"
      className={cn(
        "group isolate flex flex-col overflow-hidden rounded-2xl bg-[var(--card)] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
