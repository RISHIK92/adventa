"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
  Filter,
  Download,
  Menu,
  Bell,
  Settings,
  User,
  Home,
  BarChart3,
  FileText,
  Brain,
  Loader,
  Check,
  ChevronDown,
  Play,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  apiService,
  GenerateSchedulePayload,
  MonthlyScheduleData,
  ScheduledSession,
  ScheduleProfilePayload,
  SubjectWithTopics,
} from "@/services/weaknessApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Mock data for performance metrics
const performanceData = {
  physics: { accuracy: 65, timeSpent: 45, difficulty: 3 },
  chemistry: { accuracy: 78, timeSpent: 38, difficulty: 2 },
  mathematics: { accuracy: 82, timeSpent: 52, difficulty: 4 },
  biology: { accuracy: 71, timeSpent: 41, difficulty: 2 },
};

// Mock data for exam weightage
const examWeightage = {
  physics: {
    mechanics: 25,
    thermodynamics: 15,
    optics: 20,
    electricity: 25,
    modern: 15,
  },
  chemistry: {
    organic: 35,
    inorganic: 30,
    physical: 35,
  },
  mathematics: {
    calculus: 30,
    algebra: 25,
    geometry: 20,
    statistics: 25,
  },
  biology: {
    genetics: 25,
    ecology: 20,
    physiology: 30,
    evolution: 25,
  },
};

const getPriorityColor = (priority: any) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const concateString = (priority: string) => {
  priority = priority.charAt(0) + priority.slice(1).toLowerCase();
  return priority;
};

const getSubjectColor = (subject: any) => {
  const colors = {
    Physics: "bg-blue-500",
    Chemistry: "bg-green-500",
    Mathematics: "bg-purple-500",
    Biology: "bg-orange-500",
    General: "bg-gray-500",
  };
  return colors[subject] || "bg-orange-500";
};

const getSubjectIcon = (subject: any) => {
  const icons = {
    physics: BookOpen,
    chemistry: Target,
    mathematics: TrendingUp,
    biology: GraduationCap,
    General: Brain,
  };
  return icons[subject] || BookOpen;
};

const DEFAULT_PROFILE: ScheduleProfilePayload = {
  examId: 1, // This should be set dynamically
  dailyAvailableHours: [2, 2, 2, 2, 2, 4, 4],
  coachingStartTime: "09:00",
  coachingEndTime: "17:00",
  examDate: "",
  currentLevel: "NEW",
  studyStyle: "CONCEPT_FIRST",
  subjectConfidence: { physics: 2, chemistry: 2, mathematics: 2, biology: 2 },
  preferredMockDay: "SATURDAY",
  weaknessTestDay: undefined,
};

// Helper to format date to YYYY-MM-DD for input[type=date]
const toISODateString = (date?: string | Date): string => {
  if (!date) return "";
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

export default function MonthlySchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    new Date().getDate()
  );
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chaptersCovered, setChaptersCovered] = useState<string>("");
  const [expectedSyllabus, setExpectedSyllabus] = useState<string>("");
  const [availableHoursPerDay, setAvailableHoursPerDay] = useState<number[]>([
    2, 2, 2, 2, 2, 2, 2,
  ]);
  const [customGoals, setCustomGoals] = useState<string>("");
  const [weekStartDate, setWeekStartDate] = useState<string>("");

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<{
    id: string;
  } | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");

  const [profileOpen, setProfileOpen] = useState(false);

  // FIX: All profile-related states are now consolidated into profileData
  const [profileData, setProfileData] =
    useState<ScheduleProfilePayload>(DEFAULT_PROFILE);
  // const [weeklySubjectConfidence, setWeeklySubjectConfidence] = useState<{
  //   [key: string]: number;
  // }>({
  //   physics: 2,
  //   chemistry: 2,
  //   mathematics: 2,
  //   biology: 2,
  // });

  const [scheduleData, setScheduleData] = useState<MonthlyScheduleData>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [weekPlanOpen, setWeekPlanOpen] = useState(false);
  const [modalMockDay, setModalMockDay] = useState<
    "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  >("Sat");
  const [weaknessTestDay, setWeaknessTestDay] = useState<
    "None" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  >("None");

  const [topicOptions, setTopicOptions] = useState<SubjectWithTopics[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);

  const router = useRouter();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const fetchMonthlySchedule = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // API expects 1-12
      const data = await apiService.getMonthlySchedule(year, month);
      console.log("Fetched schedule data:", data, month);
      setScheduleData(data);
    } catch (err: any) {
      toast.error("Failed to load schedule", { description: err.message });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const examId = 1; // This should be dynamic

    const initialLoad = async () => {
      setLoading(true);
      try {
        const [profile, schedule] = await Promise.all([
          apiService.getScheduleProfile(examId),
          apiService.getMonthlySchedule(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1
          ),
        ]);
        if (profile) {
          setProfileData({
            ...DEFAULT_PROFILE,
            ...profile,
            // Ensure examDate is correctly formatted for the input
            examDate: toISODateString(profile.examDate),
          });
        }
        setScheduleData(schedule);
      } catch (err: any) {
        toast.error("Failed to load page data", { description: err.message });
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, [currentDate]); // Depend on currentDate to refetch when month changes

  const handleSaveProfile = async () => {
    setActionLoading(true);
    try {
      // FIX: profileData is now guaranteed to be up-to-date
      await apiService.upsertScheduleProfile(profileData);
      toast.success("Profile saved successfully!");
      setProfileOpen(false);
    } catch (err: any) {
      toast.error("Failed to save profile", { description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSession = async (sessionId: string, completed: boolean) => {
    try {
      await apiService.updateSession(sessionId, {
        status: completed ? "COMPLETED" : "PENDING",
      });
      toast.success(`Session marked as ${completed ? "complete" : "pending"}.`);
      fetchMonthlySchedule(currentDate);
    } catch (err: any) {
      toast.error("Failed to update session", { description: err.message });
    }
  };

  const TopicMultiSelect = ({
    subject,
    selectedTopicIds,
    onSelectionChange,
  }: {
    subject: SubjectWithTopics;
    selectedTopicIds: number[];
    onSelectionChange: (topicId: number) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredTopics = subject.topics.filter((topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="relative" ref={dropdownRef}>
        <label className="text-sm font-medium text-[#2d3748]">
          {subject.name}
        </label>
        <div
          className="w-full mt-1 rounded-md border p-2 min-h-10 cursor-pointer bg-white flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm text-gray-500">
            {
              selectedTopicIds.filter((id) =>
                subject.topics.some((t) => t.id === id)
              ).length
            }{" "}
            selected
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopicIds.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => onSelectionChange(topic.id)}
                  >
                    <span>{topic.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#fe724c]" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleGenerateWeek = async () => {
    if (selectedTopicIds.length === 0) {
      return toast.error(
        "Please select at least one chapter to plan your week."
      );
    }
    setActionLoading(true);
    try {
      const payload: GenerateSchedulePayload = {
        examId: 1,
        weekStartDate: weekStartDate,
        topicIds: selectedTopicIds,
        mockDay: modalMockDay.toUpperCase() as any,
        weaknessTestDay:
          weaknessTestDay !== "None"
            ? (weaknessTestDay.toUpperCase() as any)
            : undefined,
        // subjectConfidence: weeklySubjectConfidence,
      };
      await apiService.generateWeeklySchedule(payload);
      toast.success("AI is generating your schedule!");
      setWeekPlanOpen(false);
      fetchMonthlySchedule(currentDate);
    } catch (err: any) {
      toast.error("Failed to generate schedule", { description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const daysToSubtract = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - daysToSubtract);
    return d;
  };

  const getDaysInMonth = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonthCount = lastDayOfMonth.getDate();

    // Get the day of the week, normalized so Monday = 0, Sunday = 6
    let startingDayOfWeek = firstDayOfMonth.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonthCount; day++) {
      days.push(day);
    }
    return days;
  };

  const mondayOf = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const daysToSubtract = day === 0 ? 6 : day - 1;

    d.setDate(d.getDate() - daysToSubtract);
    return d;
  };

  const toISO = (date: Date) => date.toISOString().slice(0, 10);

  const handleOpenWeekPlanner = async (day: number) => {
    const clickedDate = new Date(year, month, day);
    const monday = getMonday(clickedDate);
    console.log(monday.toLocaleDateString("en-CA"));
    setWeekStartDate(monday.toLocaleDateString("en-CA"));
    setWeekPlanOpen(true);

    if (topicOptions.length === 0) {
      setTopicsLoading(true);
      try {
        const examId = 1; // This should be dynamic
        const topics = await apiService.getTopicsForScheduling(examId);
        setTopicOptions(topics);
      } catch (error: any) {
        toast.error("Failed to load chapters", { description: error.message });
      } finally {
        setTopicsLoading(false);
      }
    }
  };

  const handleReschedule = async () => {
    if (!sessionToReschedule || !rescheduleDate) return;
    setActionLoading(true);
    try {
      await apiService.updateSession(sessionToReschedule.id, {
        newDate: rescheduleDate,
      });
      toast.success("Session rescheduled successfully!");
      setRescheduleOpen(false);
      setSessionToReschedule(null); // Clear session after rescheduling
      fetchMonthlySchedule(currentDate);
    } catch (err: any) {
      toast.error("Failed to reschedule", { description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const getDaySchedule = (day: number | null) => {
    if (day === null || !scheduleData[day]) return [];
    let filtered = scheduleData[day];
    if (filterSubject !== "all") {
      filtered = filtered.filter((item) => item.subject === filterSubject);
    }
    if (filterPriority !== "all") {
      filtered = filtered.filter((item) => item.priority === filterPriority);
    }
    return filtered;
  };

  const getMonthlyStats = () => {
    const allSessions = Object.values(scheduleData).flat();
    const completed = allSessions.filter((s) => s.completed).length;
    const total = allSessions.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const subjectTime = {};
    const priorityCount = { high: 0, medium: 0, low: 0 };
    allSessions.forEach((session) => {
      subjectTime[session.subject] =
        (subjectTime[session.subject] || 0) + session.duration;
      priorityCount[session.priority]++;
    });
    return { completionRate, subjectTime, priorityCount, total };
  };

  const monthlyStats = getMonthlyStats();
  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const handleStartTest = async (session: ScheduledSession) => {
    console.log(session);
    if (
      !session.topicId ||
      !session.questionCount ||
      !session.difficultyLevel ||
      !session.timeLimitMinutes
    ) {
      console.log("missing");
      return toast.error("Test details are missing for this session.");
    }

    setActionLoading(true);
    try {
      let response;
      const examId = 1; // This should be dynamic

      if (session.method === "CONCEPT_QUIZ") {
        response = await apiService.generateAIQuiz({
          examId,
          topicIds: [session.topicId],
          difficultyLevel: session.difficultyLevel,
          questionCount: session.questionCount,
          timeLimitMinutes: session.timeLimitMinutes,
          questionTypes: ["conceptual"], // Default for concept quiz
          scheduledSessionId: session.id,
        });
      } else if (session.method.startsWith("DRILL_")) {
        response = await apiService.generateDrill({
          examId,
          topicIds: [session.topicId],
          difficultyLevels: [session.difficultyLevel],
          questionCount: session.questionCount,
          timeLimitMinutes: session.timeLimitMinutes,
          scheduledSessionId: session.id,
        });
      } else {
        throw new Error("This session type cannot be started as a test.");
      }

      if (response && response.testInstanceId) {
        toast.success("Test created successfully! Redirecting...");
        router.push(`/ai-test/${response.testInstanceId}`);
      }
    } catch (err: any) {
      toast.error("Failed to start test", { description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      <div>
        <header className="bg-white border-b border-[#edf2f7] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[#2d3748]">
                  Monthly Schedule
                </h1>
                <p className="text-[#718096] mt-1">
                  AI-optimized study plan based on your inputs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProfileOpen(true)}
              >
                <User className="h-4 w-4 mr-2" /> Profile
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Stats Cards ... */}
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#fe724c]/10 rounded-lg">
                    <Target className="h-5 w-5 text-[#fe724c]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#718096]">Completion Rate</p>
                    <p className="text-2xl font-bold text-[#2d3748]">
                      {monthlyStats.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#718096]">High Priority</p>
                    <p className="text-2xl font-bold">
                      {monthlyStats.priorityCount.high}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#718096]">Total Sessions</p>
                    <p className="text-2xl font-bold text-[#2d3748]">
                      {monthlyStats.total}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#718096]">Study Hours</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        Object.values(monthlyStats.subjectTime).reduce(
                          (a: number, b: number) => a + b,
                          0
                        ) / 60
                      )}
                      h
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth(-1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-xl font-semibold">
                        {monthName} {year}
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth(1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      {monthlyStats.total} sessions planned
                    </Badge>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <div
                          key={day}
                          className="p-2 text-center text-sm font-medium text-[#718096]"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`
                          min-h-24 p-1 border rounded-md cursor-pointer transition-all duration-200
                          ${day ? "hover:bg-[#e2e8f0]/50" : ""}
                          ${
                            day && isToday(day)
                              ? "bg-[#fe724c]/10 border-[#fe724c]"
                              : "border-[#edf2f7]"
                          }
                          ${
                            day && selectedDay === day
                              ? "ring-2 ring-[#fe724c] ring-offset-2"
                              : ""
                          }
                        `}
                        onClick={() =>
                          day &&
                          (getDaySchedule(day).length > 0
                            ? setSelectedDay(day)
                            : handleOpenWeekPlanner(day))
                        }
                      >
                        {day && (
                          <>
                            <div
                              className={`text-sm font-medium mb-1 ${
                                isToday(day)
                                  ? "text-[#fe724c]"
                                  : "text-[#2d3748]"
                              }`}
                            >
                              {day}
                            </div>
                            <div className="space-y-1">
                              {getDaySchedule(day)
                                .slice(0, 2)
                                .map((session) => (
                                  <div
                                    key={session.id}
                                    className={`text-xs px-1 py-0.5 rounded truncate ${getSubjectColor(
                                      session.subject
                                    )} text-white ${
                                      session.completed ? "opacity-50" : ""
                                    }`}
                                  >
                                    {session.topic}
                                  </div>
                                ))}
                              {getDaySchedule(day).length === 0 && (
                                <div className="text-[11px] text-center text-[#718096] px-1 pt-2">
                                  Plan Week
                                </div>
                              )}
                              {getDaySchedule(day).length > 2 && (
                                <div className="text-xs text-[#718096] px-1">
                                  +{getDaySchedule(day).length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {selectedDay && (
                  <Card className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {monthName} {selectedDay}, {year}
                      </h3>
                      {isToday(selectedDay) && (
                        <Badge
                          variant="default"
                          className="bg-[#fe724c] text-white"
                        >
                          Today
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      {getDaySchedule(selectedDay).length === 0 ? (
                        <p className="text-[#718096] text-center py-8">
                          No sessions scheduled for this day.
                        </p>
                      ) : (
                        getDaySchedule(selectedDay).map((session) => {
                          const SubjectIcon = getSubjectIcon(session.subject);
                          const isStartableTest =
                            session.method === "CONCEPT_QUIZ" ||
                            session.method.startsWith("DRILL_");
                          return (
                            <div
                              key={session.id}
                              className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                                session.completed
                                  ? "bg-[#e2e8f0]/50 opacity-75"
                                  : "bg-white"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`p-1.5 rounded ${getSubjectColor(
                                      session.subject
                                    )}`}
                                  >
                                    <SubjectIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm">
                                      {session.topic}
                                    </h4>
                                    <p className="text-xs text-[#718096] capitalize">
                                      {session.subject} • {session.method}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={getPriorityColor(
                                      session.priority
                                    )}
                                  >
                                    {concateString(session.priority)}
                                  </Badge>
                                  <input
                                    type="checkbox"
                                    checked={session.completed}
                                    className="h-4 w-4"
                                    onChange={(e) =>
                                      handleUpdateSession(
                                        session.id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              {isStartableTest && !session.completed && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStartTest(session)}
                                  disabled={actionLoading}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {actionLoading ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Play className="w-4 h-4 mr-2" />
                                  )}
                                  Start{" "}
                                  {session.method === "CONCEPT_QUIZ"
                                    ? "Quiz"
                                    : "Drill"}
                                </Button>
                              )}
                              <div className="flex items-center justify-between text-xs text-[#718096] mb-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {session.time} ({session.duration}min)
                                </span>
                                <Button
                                  variant="link"
                                  className="text-xs h-auto p-0"
                                  onClick={() => {
                                    setSessionToReschedule({
                                      id: session.id,
                                    });
                                    setRescheduleOpen(true);
                                  }}
                                >
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </>
        </main>
      </div>

      {weekPlanOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setWeekPlanOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-md border border-[#edf2f7] p-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#2d3748]">
                Plan Your Week
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekPlanOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <label className="text-sm font-medium text-[#2d3748]">
                    Select Chapters to Focus On This Week
                  </label>
                  {topicsLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <Loader className="animate-spin" />
                    </div>
                  ) : topicOptions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {topicOptions.map((subject) => (
                        <TopicMultiSelect
                          key={subject.id}
                          subject={subject}
                          selectedTopicIds={selectedTopicIds}
                          onSelectionChange={(topicId) => {
                            setSelectedTopicIds((prev) =>
                              prev.includes(topicId)
                                ? prev.filter((id) => id !== topicId)
                                : [...prev, topicId]
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-center text-gray-500">
                      Could not load chapters.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d3748]">
                    Mock test day
                  </label>
                  <select
                    value={modalMockDay}
                    onChange={(e) => setModalMockDay(e.target.value as any)}
                    className="w-full rounded-md border border-[#edf2f7] p-2"
                  >
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d3748]">
                    Weakness test day
                  </label>
                  <select
                    value={weaknessTestDay}
                    onChange={(e) => setWeaknessTestDay(e.target.value as any)}
                    className="w-full rounded-md border border-[#edf2f7] p-2"
                  >
                    {[
                      "None",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                      "Sun",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d3748]">
                    Week start date
                  </label>
                  <input
                    type="date"
                    value={weekStartDate}
                    className="w-full rounded-md border border-[#edf2f7] p-2"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d3748]">
                    Custom goals (optional)
                  </label>
                  <input
                    type="text"
                    value={customGoals}
                    onChange={(e) => setCustomGoals(e.target.value)}
                    className="w-full rounded-md border border-[#edf2f7] p-2"
                    placeholder='e.g., "Master Electrostatics"'
                  />
                </div>
              </div>
              {/* <div className="md:col-span-2 space-y-4 pt-4">
                <label className="text-sm font-medium text-[#2d3748]">
                  Subject confidence levels this week
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Physics", "Chemistry", "Mathematics", "Biology"].map(
                    (subject) => (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#2d3748]">
                            {subject}
                          </span>
                          <span className="text-xs text-[#718096]">
                            {weeklySubjectConfidence[subject.toLowerCase()] ===
                            1
                              ? "Low"
                              : weeklySubjectConfidence[
                                  subject.toLowerCase()
                                ] === 2
                              ? "Mid"
                              : "High"}
                          </span>
                        </div>
                        <div className="px-2">
                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="1"
                            value={
                              weeklySubjectConfidence[subject.toLowerCase()] ||
                              2
                            }
                            onChange={(e) =>
                              setWeeklySubjectConfidence((prev) => ({
                                ...prev,
                                [subject.toLowerCase()]: Number(e.target.value),
                              }))
                            }
                            className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-[#718096] mt-1">
                            <span>Low</span>
                            <span>Mid</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div> */}
              <div className="mt-4 pt-4 border-t flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setWeekPlanOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleGenerateWeek} disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                  ) : null}
                  Generate Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setRescheduleOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-md border border-[#edf2f7] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold mb-4 text-[#2d3748]">
              Reschedule Session
            </h4>
            <p className="text-sm text-[#718096] mb-4">
              Select a new date for this session.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#2d3748] block mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-md border border-[#edf2f7] p-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setRescheduleOpen(false)}
              >
                Cancel
              </Button>
              {/* FIX: This button now correctly calls the API handler */}
              <Button
                onClick={handleReschedule}
                disabled={actionLoading || !rescheduleDate}
              >
                {actionLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Reschedule"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Onboarding Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setProfileOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-md border border-[#edf2f7] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#2d3748]">
                User Profile
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProfileOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-2">
              {/* FIX: All inputs now read from and write to the profileData state object */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Coaching timing - Start
                </label>
                <input
                  type="time"
                  value={profileData.coachingStartTime}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      coachingStartTime: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-[#edf2f7] p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Coaching timing - End
                </label>
                <input
                  type="time"
                  value={profileData.coachingEndTime}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      coachingEndTime: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-[#edf2f7] p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Exam date
                </label>
                <input
                  type="date"
                  value={profileData.examDate}
                  onChange={(e) =>
                    setProfileData({ ...profileData, examDate: e.target.value })
                  }
                  className="w-full rounded-md border border-[#edf2f7] p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Current level
                </label>
                <select
                  value={profileData.currentLevel}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      currentLevel: e.target.value as any,
                    })
                  }
                  className="w-full rounded-md border border-[#edf2f7] p-2"
                >
                  <option value="NEW">New</option>
                  <option value="MID">Mid</option>
                  <option value="STRONG">Strong</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Preferred mock day
                </label>
                <select
                  value={profileData.preferredMockDay}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      preferredMockDay: e.target.value as any,
                    })
                  }
                  className="w-full rounded-md border border-[#edf2f7] p-2"
                >
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Study style
                </label>
                <select
                  value={profileData.studyStyle}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      studyStyle: e.target.value as any,
                    })
                  }
                  className="w-full rounded-md border border-[#edf2f7] p-2"
                >
                  <option value="TESTS_FIRST">Tests First</option>
                  <option value="CONCEPT_FIRST">Concept First</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-[#2d3748]">
                  Available hours per day (Mon–Sun)
                </label>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d, i) => (
                      <div key={d} className="text-center">
                        <span className="text-xs text-[#718096]">{d}</span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={profileData.dailyAvailableHours[i]}
                          onChange={(e) => {
                            const newHours = [
                              ...profileData.dailyAvailableHours,
                            ];
                            newHours[i] = Number(e.target.value);
                            setProfileData({
                              ...profileData,
                              dailyAvailableHours: newHours,
                            });
                          }}
                          className="w-full rounded-md border border-[#edf2f7] p-2 text-center"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-sm font-medium text-[#2d3748]">
                  Subject confidence levels
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(profileData.subjectConfidence).map(
                    (subjectKey) => (
                      <div key={subjectKey} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#2d3748] capitalize">
                            {subjectKey}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="1"
                          value={profileData.subjectConfidence[subjectKey]}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              subjectConfidence: {
                                ...profileData.subjectConfidence,
                                [subjectKey]: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full h-2 bg-[#e2e8f0] rounded-lg"
                        />
                        <div className="flex justify-between text-xs text-[#718096] mt-1">
                          <span>Low</span>
                          <span>Mid</span>
                          <span>High</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={actionLoading}>
                {actionLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
