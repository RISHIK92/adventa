"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Check,
  Clock,
  Facebook,
  ChevronRight,
  ChevronLeft,
  Target,
  BookOpen,
  Bell,
  Users,
  Shield,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface OnboardingData {
  examType: string;
  customExam?: string;
  targetScore: string;
  examDate: string;
  studyHours: number;
  studySlots: string[];
  studyTime: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  socialPreference: string;
  privacyConsent: boolean;
}

const INITIAL_DATA: OnboardingData = {
  examType: "",
  customExam: "",
  targetScore: "",
  examDate: "",
  studyHours: 6,
  studySlots: [],
  studyTime: "",
  notifications: {
    push: true,
    email: true,
    sms: false,
  },
  socialPreference: "",
  privacyConsent: false,
};

const STEPS = [
  { id: "welcome", title: "Welcome", description: "Let's get started" },
  { id: "goals", title: "Goals", description: "Set your targets" },
  {
    id: "preferences",
    title: "Preferences",
    description: "Customize your experience",
  },
  { id: "consent", title: "Privacy", description: "Complete setup" },
  { id: "preview", title: "Preview", description: "Your study plan" },
];

const EXAM_PRESETS = [
  { value: "90", label: "90th Percentile" },
  { value: "95", label: "95th Percentile" },
  { value: "99", label: "99th Percentile" },
];

const STUDY_SLOTS = [
  "Early Morning (5-8 AM)",
  "Morning (8-12 PM)",
  "Afternoon (12-4 PM)",
  "Evening (4-8 PM)",
  "Night (8-12 AM)",
  "Late Night (12-5 AM)",
];

const SOCIAL_OPTIONS = [
  {
    value: "solo",
    label: "Solo Study",
    icon: BookOpen,
    description: "I prefer studying alone",
  },
  {
    value: "social",
    label: "Social Study",
    icon: Users,
    description: "I enjoy group sessions",
  },
  {
    value: "competitive",
    label: "Competitive",
    icon: Target,
    description: "I thrive on competition",
  },
];

export default function OnboardingProfileFlow({
  onComplete,
  onSkip,
  className = "",
}: {
  onComplete?: (data: OnboardingData) => void;
  onSkip?: () => void;
  className?: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">(
    "idle"
  );
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingCount, setBreathingCount] = useState(0);

  // Auto-save functionality
  const saveToLocalStorage = useCallback(() => {
    setSaveStatus("saving");
    localStorage.setItem(
      "onboarding-draft",
      JSON.stringify({ currentStep, data })
    );
    setTimeout(() => setSaveStatus("saved"), 500);
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [currentStep, data]);

  useEffect(() => {
    const timer = setTimeout(saveToLocalStorage, 2000);
    return () => clearTimeout(timer);
  }, [data, currentStep, saveToLocalStorage]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem("onboarding-draft");
    if (saved) {
      try {
        const { currentStep: savedStep, data: savedData } = JSON.parse(saved);
        setCurrentStep(savedStep || 0);
        setData({ ...INITIAL_DATA, ...savedData });
      } catch (e) {
        console.error("Failed to load saved onboarding data");
      }
    }
  }, []);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return true;
      case "goals":
        return data.examType && data.targetScore && data.examDate;
      case "preferences":
        return data.studyTime && data.socialPreference;
      case "consent":
        return data.privacyConsent;
      case "preview":
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      saveToLocalStorage();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.removeItem("onboarding-draft");
    onComplete?.(data);
    toast.success("Onboarding completed successfully!");
  };

  const handleSkip = () => {
    localStorage.removeItem("onboarding-draft");
    onSkip?.();
    toast.info("You can complete setup anytime from settings");
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login integration coming soon!`);
  };

  const calculateDaysLeft = (examDate: string) => {
    if (!examDate) return 0;
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const generateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingPlan(false);
  };

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingCount(0);

    const interval = setInterval(() => {
      setBreathingCount((prev) => {
        if (prev >= 6) {
          // 20 seconds / ~3.33s per breath cycle
          clearInterval(interval);
          setBreathingActive(false);
          toast.success("Great! You're ready to focus 🧘‍♀️");
          return 0;
        }
        return prev + 1;
      });
    }, 3300);
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-foreground"
        >
          Welcome to StudySync
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-muted-foreground max-w-md mx-auto"
        >
          Let's create your personalized study plan and help you achieve your
          exam goals
        </motion.p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <Button
          onClick={nextStep}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Get Started
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("Google")}
            className="h-11"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialLogin("Facebook")}
            className="h-11"
          >
            <Facebook className="w-5 h-5 mr-2" />
            Facebook
          </Button>
        </div>

        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );

  const renderGoalsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Set Your Goals</h2>
        <p className="text-muted-foreground">
          Tell us about your exam and targets
        </p>
      </div>

      <div className="space-y-6">
        {/* Exam Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Which exam are you preparing for?
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {["JEE", "NEET", "Custom"].map((exam) => (
              <Button
                key={exam}
                variant={data.examType === exam ? "default" : "outline"}
                onClick={() => updateData({ examType: exam })}
                className="h-12"
              >
                {exam}
              </Button>
            ))}
          </div>
          {data.examType === "Custom" && (
            <Input
              placeholder="Enter your exam name"
              value={data.customExam || ""}
              onChange={(e) => updateData({ customExam: e.target.value })}
              className="mt-2"
            />
          )}
        </div>

        {/* Target Score */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            What's your target score/percentile?
          </Label>
          <div className="flex gap-2 mb-2">
            {EXAM_PRESETS.map((preset) => (
              <Badge
                key={preset.value}
                variant={
                  data.targetScore === preset.value ? "default" : "outline"
                }
                className="cursor-pointer px-3 py-1"
                onClick={() => updateData({ targetScore: preset.value })}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Or enter custom target"
            value={data.targetScore}
            onChange={(e) => updateData({ targetScore: e.target.value })}
          />
        </div>

        {/* Exam Date */}
        <div className="space-y-3">
          <Label className="text-base font-medium">When is your exam?</Label>
          <Input
            type="date"
            value={data.examDate}
            onChange={(e) => updateData({ examDate: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
          />
          {data.examDate && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {calculateDaysLeft(data.examDate)} days remaining
            </div>
          )}
        </div>

        {/* Study Hours */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            How many hours can you study daily? ({data.studyHours}h)
          </Label>
          <Slider
            value={[data.studyHours]}
            onValueChange={(value) => updateData({ studyHours: value[0] })}
            max={12}
            min={1}
            step={0.5}
            className="py-4"
          />
        </div>

        {/* Study Slots */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Preferred study time slots
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {STUDY_SLOTS.map((slot) => (
              <Button
                key={slot}
                variant={data.studySlots.includes(slot) ? "default" : "outline"}
                onClick={() => {
                  const newSlots = data.studySlots.includes(slot)
                    ? data.studySlots.filter((s) => s !== slot)
                    : [...data.studySlots, slot];
                  updateData({ studySlots: newSlots });
                }}
                className="h-auto py-2 px-3 text-xs"
                size="sm"
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Learning Preferences</h2>
        <p className="text-muted-foreground">Customize your study experience</p>
      </div>

      <div className="space-y-6">
        {/* Study Time Preference */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            When do you focus best?
          </Label>
          <RadioGroup
            value={data.studyTime}
            onValueChange={(value) => updateData({ studyTime: value })}
          >
            {[
              {
                value: "morning",
                label: "Morning Person",
                desc: "Early bird catches the worm",
              },
              {
                value: "day",
                label: "Day Time",
                desc: "Afternoon productivity",
              },
              {
                value: "evening",
                label: "Evening",
                desc: "Post-work focus time",
              },
              {
                value: "night",
                label: "Night Owl",
                desc: "Late night concentration",
              },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label
                    htmlFor={option.value}
                    className="font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Notification preferences
          </Label>
          <div className="space-y-3">
            {[
              {
                key: "push" as keyof typeof data.notifications,
                label: "Push Notifications",
                desc: "Reminders and updates",
              },
              {
                key: "email" as keyof typeof data.notifications,
                label: "Email Updates",
                desc: "Weekly progress reports",
              },
              {
                key: "sms" as keyof typeof data.notifications,
                label: "SMS Alerts",
                desc: "Important exam reminders",
              },
            ].map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <div className="font-medium">{notif.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {notif.desc}
                  </div>
                </div>
                <Checkbox
                  checked={data.notifications[notif.key]}
                  onCheckedChange={(checked) =>
                    updateData({
                      notifications: {
                        ...data.notifications,
                        [notif.key]: checked,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Preference */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Study style preference
          </Label>
          <div className="grid gap-3">
            {SOCIAL_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.socialPreference === option.value
                      ? "ring-2 ring-primary bg-secondary/50"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => updateData({ socialPreference: option.value })}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        data.socialPreference === option.value
                          ? "bg-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                    {data.socialPreference === option.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Breathing Exercise Suggestion */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">
                  Quick Focus Exercise
                </h4>
                <p className="text-sm text-blue-700">
                  Try our 20-second breathing exercise to center yourself
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={startBreathing}
                disabled={breathingActive}
                className="border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                {breathingActive ? (
                  <>
                    <motion.div
                      className="w-4 h-4 rounded-full bg-blue-500 mr-2"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 3.3, repeat: Infinity }}
                    />
                    {breathingCount}/6
                  </>
                ) : (
                  "Start"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderConsentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Privacy & Consent</h2>
        <p className="text-muted-foreground">
          Complete your setup with privacy consent
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We collect minimal data to provide personalized study
                recommendations. Your progress data stays secure and is never
                shared without permission.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Study progress and performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Personalized recommendations and insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Optional social features and leaderboards
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  No sharing of personal data with third parties
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
            <Checkbox
              id="privacy-consent"
              checked={data.privacyConsent}
              onCheckedChange={(checked) =>
                updateData({ privacyConsent: !!checked })
              }
            />
            <Label htmlFor="privacy-consent" className="text-sm cursor-pointer">
              I agree to the privacy policy and terms of service. I understand
              how my data will be used to improve my study experience.
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleSkip}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          Start with limited features instead
        </Button>
      </div>
    </motion.div>
  );

  const renderPreviewStep = () => {
    useEffect(() => {
      if (currentStep === STEPS.length - 1) {
        generateStudyPlan();
      }
    }, [currentStep]);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Your Study Plan Preview</h2>
          <p className="text-muted-foreground">
            AI-generated roadmap based on your preferences
          </p>
        </div>

        {isGeneratingPlan ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <div>
                <h3 className="font-semibold">
                  Generating your personalized study plan...
                </h3>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {data.examType === "Custom"
                        ? data.customExam
                        : data.examType}{" "}
                      Preparation Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Target: {data.targetScore}th percentile •{" "}
                      {calculateDaysLeft(data.examDate)} days remaining
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Daily Study Time
                    </div>
                    <div className="font-semibold">{data.studyHours} hours</div>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Study Style
                    </div>
                    <div className="font-semibold capitalize">
                      {data.socialPreference}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Weekly Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      {
                        subject: "Mathematics",
                        hours: Math.floor(data.studyHours * 0.4),
                        progress: 85,
                      },
                      {
                        subject: "Physics",
                        hours: Math.floor(data.studyHours * 0.3),
                        progress: 70,
                      },
                      {
                        subject: "Chemistry",
                        hours: Math.floor(data.studyHours * 0.3),
                        progress: 60,
                      },
                    ].map((subject) => (
                      <div
                        key={subject.subject}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">
                            {subject.subject}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {subject.hours}h/week
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={subject.progress}
                            className="w-20 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {subject.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">
                      Plan Confidence: 92%
                    </h4>
                    <p className="text-sm text-green-700">
                      Based on your goals and preferences, this plan has a high
                      success rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return renderWelcomeStep();
      case "goals":
        return renderGoalsStep();
      case "preferences":
        return renderPreferencesStep();
      case "consent":
        return renderConsentStep();
      case "preview":
        return renderPreviewStep();
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 bg-white z-50 flex flex-col ${className}`}>
      {/* Header with Progress */}
      <div className="border-b bg-[#ffffff]">
        <div className="container max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStep}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h1 className="text-lg font-semibold">
                  {STEPS[currentStep].title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {STEPS[currentStep].description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === "saving" && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </div>
              )}
              {saveStatus === "saved" && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="w-3 h-3" />
                  Saved
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Progress
              value={((currentStep + 1) / STEPS.length) * 100}
              className="flex-1 h-2"
            />
            <span className="text-xs text-muted-foreground">
              {currentStep + 1}/{STEPS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {currentStep > 0 && (
        <div className="border-t bg-[#ffffff]">
          <div className="container max-w-2xl mx-auto px-6 py-4">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed() || isGeneratingPlan}
                  className="min-w-[140px]"
                >
                  {isGeneratingPlan ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Complete Setup
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
