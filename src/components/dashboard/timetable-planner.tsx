"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarDays,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  Bell,
  Repeat,
  Edit,
  Trash2,
  CheckCircle,
  Calendar as CalendarIcon,
  MoreHorizontal,
  GraduationCap,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface StudyEvent {
  id: string;
  title: string;
  description?: string;
  subject: string;
  type: "study" | "exam" | "test" | "review" | "assignment";
  date: Date;
  startTime: string;
  endTime: string;
  completed?: boolean;
  recurring?: "none" | "daily" | "weekly" | "monthly";
  reminder?: number; // minutes before
  priority?: "low" | "medium" | "high";
  color?: string;
}

interface StudyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: "hours" | "sessions" | "topics";
  deadline: Date;
  subject: string;
}

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
  "Economics",
];

const EVENT_COLORS = {
  study: "bg-emerald-100 border-emerald-300 text-emerald-800",
  exam: "bg-red-100 border-red-300 text-red-800",
  test: "bg-amber-100 border-amber-300 text-amber-800",
  review: "bg-blue-100 border-blue-300 text-blue-800",
  assignment: "bg-purple-100 border-purple-300 text-purple-800",
};

export default function TimetablePlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [events, setEvents] = useState<StudyEvent[]>([
    {
      id: "1",
      title: "Calculus Review",
      subject: "Mathematics",
      type: "study",
      date: new Date(),
      startTime: "09:00",
      endTime: "11:00",
      completed: true,
      priority: "high",
    },
    {
      id: "2",
      title: "Physics Mock Test",
      subject: "Physics",
      type: "test",
      date: new Date(Date.now() + 86400000),
      startTime: "14:00",
      endTime: "16:00",
      reminder: 60,
      priority: "high",
    },
  ]);

  const [goals, setGoals] = useState<StudyGoal[]>([
    {
      id: "1",
      title: "Complete Calculus Course",
      target: 40,
      current: 28,
      unit: "hours",
      deadline: new Date(Date.now() + 7 * 86400000),
      subject: "Mathematics",
    },
    {
      id: "2",
      title: "Physics Practice Tests",
      target: 10,
      current: 6,
      unit: "sessions",
      deadline: new Date(Date.now() + 10 * 86400000),
      subject: "Physics",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<StudyEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<StudyEvent | null>(null);

  const getWeekDays = useCallback((date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    start.setDate(start.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, []);

  const weekDays = useMemo(
    () => getWeekDays(currentWeek),
    [currentWeek, getWeekDays]
  );

  const getEventsForDate = useCallback(
    (date: Date) => {
      return events
        .filter((event) => event.date.toDateString() === date.toDateString())
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [events]
  );

  const getEventsForMonth = useCallback(
    (date: Date) => {
      const month = date.getMonth();
      const year = date.getFullYear();
      return events.filter(
        (event) =>
          event.date.getMonth() === month && event.date.getFullYear() === year
      );
    },
    [events]
  );

  const addEvent = (eventData: Omit<StudyEvent, "id">) => {
    const newEvent: StudyEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    setIsDialogOpen(false);
  };

  const updateEvent = (updatedEvent: StudyEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      )
    );
  };

  const addGoal = (goalData: Omit<StudyGoal, "id">) => {
    const newGoal: StudyGoal = {
      ...goalData,
      id: Date.now().toString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    setIsGoalDialogOpen(false);
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, current: Math.min(progress, goal.target) }
          : goal
      )
    );
  };

  const getCompletionRate = () => {
    if (events.length === 0) return 0;
    const completedEvents = events.filter((event) => event.completed).length;
    return Math.round((completedEvents / events.length) * 100);
  };

  const handleDragStart = (event: StudyEvent) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (
      draggedEvent &&
      targetDate.toDateString() !== draggedEvent.date.toDateString()
    ) {
      updateEvent({
        ...draggedEvent,
        date: targetDate,
      });
    }
    setDraggedEvent(null);
  };

  const EventCard = ({ event }: { event: StudyEvent }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-2 rounded-md border text-xs cursor-move ${
        EVENT_COLORS[event.type]
      } ${event.completed ? "opacity-60" : ""}`}
      draggable
      onDragStart={() => handleDragStart(event)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium truncate flex-1">{event.title}</span>
        <div className="flex items-center gap-1">
          {event.completed && <CheckCircle className="h-3 w-3" />}
          {event.priority === "high" && (
            <Zap className="h-3 w-3 text-amber-500" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs opacity-75">
        <Clock className="h-3 w-3" />
        <span>
          {event.startTime} - {event.endTime}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <Badge variant="secondary" className="text-xs py-0">
          {event.subject}
        </Badge>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleEventCompletion(event.id);
            }}
          >
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setEditingEvent(event);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              deleteEvent(event.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const EventForm = () => {
    const [formData, setFormData] = useState<Omit<StudyEvent, "id">>({
      title: editingEvent?.title || "",
      description: editingEvent?.description || "",
      subject: editingEvent?.subject || "",
      type: editingEvent?.type || "study",
      date: editingEvent?.date || selectedDate,
      startTime: editingEvent?.startTime || "09:00",
      endTime: editingEvent?.endTime || "10:00",
      completed: editingEvent?.completed || false,
      recurring: editingEvent?.recurring || "none",
      reminder: editingEvent?.reminder || 15,
      priority: editingEvent?.priority || "medium",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingEvent) {
        updateEvent({ ...editingEvent, ...formData });
      } else {
        addEvent(formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Study session title"
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={formData.subject}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, subject: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: StudyEvent["type"]) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="study">Study Session</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startTime: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endTime: e.target.value }))
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: StudyEvent["priority"]) =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Additional notes..."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false);
              setEditingEvent(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const GoalForm = () => {
    const [goalData, setGoalData] = useState<Omit<StudyGoal, "id">>({
      title: "",
      target: 1,
      current: 0,
      unit: "hours",
      deadline: new Date(Date.now() + 7 * 86400000),
      subject: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addGoal(goalData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="goalTitle">Goal Title</Label>
          <Input
            id="goalTitle"
            value={goalData.title}
            onChange={(e) =>
              setGoalData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., Complete Algebra Course"
            required
          />
        </div>

        <div>
          <Label htmlFor="goalSubject">Subject</Label>
          <Select
            value={goalData.subject}
            onValueChange={(value) =>
              setGoalData((prev) => ({ ...prev, subject: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              type="number"
              value={goalData.target}
              onChange={(e) =>
                setGoalData((prev) => ({
                  ...prev,
                  target: parseInt(e.target.value),
                }))
              }
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={goalData.unit}
              onValueChange={(value: StudyGoal["unit"]) =>
                setGoalData((prev) => ({ ...prev, unit: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="topics">Topics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={goalData.deadline.toISOString().split("T")[0]}
            onChange={(e) =>
              setGoalData((prev) => ({
                ...prev,
                deadline: new Date(e.target.value),
              }))
            }
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Create Goal
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsGoalDialogOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display font-bold text-foreground">
              Timetable Planner
            </h1>
            <p className="text-muted-foreground mt-1">
              Plan your study sessions and track your progress
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>Study Sessions</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Exams</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Tests</span>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingEvent(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? "Edit Event" : "Create New Event"}
                  </DialogTitle>
                </DialogHeader>
                <EventForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-muted-foreground">
                    Today's Events
                  </p>
                  <p className="text-lg font-semibold">
                    {getEventsForDate(new Date()).length}
                  </p>
                </div>
                <CalendarDays className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-muted-foreground">
                    Completion Rate
                  </p>
                  <p className="text-lg font-semibold">
                    {getCompletionRate()}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption text-muted-foreground">
                    Active Goals
                  </p>
                  <p className="text-lg font-semibold">{goals.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar and Schedule */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-card">
              <CardContent className="p-6">
                <Tabs
                  value={view}
                  onValueChange={(value: "week" | "month") => setView(value)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="week">Week View</TabsTrigger>
                      <TabsTrigger value="month">Month View</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (view === "week") {
                            setCurrentWeek(
                              new Date(currentWeek.getTime() - 7 * 86400000)
                            );
                          } else {
                            setSelectedDate(
                              new Date(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth() - 1,
                                1
                              )
                            );
                          }
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <span className="font-medium min-w-[120px] text-center">
                        {view === "week"
                          ? `Week of ${currentWeek.toLocaleDateString()}`
                          : selectedDate.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (view === "week") {
                            setCurrentWeek(
                              new Date(currentWeek.getTime() + 7 * 86400000)
                            );
                          } else {
                            setSelectedDate(
                              new Date(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth() + 1,
                                1
                              )
                            );
                          }
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="week" className="space-y-4">
                    <div className="grid grid-cols-7 gap-4">
                      {weekDays.map((day, index) => {
                        const dayEvents = getEventsForDate(day);
                        const isToday =
                          day.toDateString() === new Date().toDateString();

                        return (
                          <div
                            key={index}
                            className={`min-h-[200px] p-3 border rounded-lg bg-background ${
                              isToday
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-border"
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day)}
                          >
                            <div className="text-center mb-2">
                              <p className="text-caption text-muted-foreground">
                                {day.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </p>
                              <p
                                className={`font-medium ${
                                  isToday ? "text-emerald-700" : ""
                                }`}
                              >
                                {day.getDate()}
                              </p>
                            </div>

                            <div className="space-y-2">
                              {dayEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="month">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border bg-background"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Goals */}
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Study Goals</CardTitle>
                  <Dialog
                    open={isGoalDialogOpen}
                    onOpenChange={setIsGoalDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background">
                      <DialogHeader>
                        <DialogTitle>Create Study Goal</DialogTitle>
                      </DialogHeader>
                      <GoalForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  const isCompleted = goal.current >= goal.target;

                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>

                      <Progress value={progress} className="h-2" />

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary">{goal.subject}</Badge>
                        <span className="text-muted-foreground">
                          Due: {goal.deadline.toLocaleDateString()}
                        </span>
                      </div>

                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            updateGoalProgress(goal.id, goal.current + 1)
                          }
                        >
                          Mark Progress
                        </Button>
                      )}
                    </div>
                  );
                })}

                {goals.length === 0 && (
                  <p className="text-caption text-muted-foreground text-center py-4">
                    No goals yet. Create your first study goal!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events
                  .filter((event) => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((event) => {
                    const isToday =
                      event.date.toDateString() === new Date().toDateString();

                    return (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-background"
                      >
                        <div
                          className={`w-2 h-8 rounded-full ${
                            event.type === "exam"
                              ? "bg-red-500"
                              : event.type === "test"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isToday
                              ? "Today"
                              : event.date.toLocaleDateString()}{" "}
                            • {event.startTime}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {event.subject}
                          </Badge>
                        </div>

                        {event.reminder && (
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}

                {events.filter((event) => event.date >= new Date()).length ===
                  0 && (
                  <p className="text-caption text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Today's Schedule */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {getEventsForDate(new Date()).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 border rounded-lg bg-background"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{event.title}</h4>
                      {event.completed && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                      {event.priority === "high" && (
                        <Zap className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {event.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEventCompletion(event.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingEvent(event);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {getEventsForDate(new Date()).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled for today</p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Event
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
