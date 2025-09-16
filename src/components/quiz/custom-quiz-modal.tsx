"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, Clock, Target, Hash, X, Check } from "lucide-react";
import { apiService } from "@/services/weaknessApi";

interface CustomQuizModalProps {
  examId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizGenerated: (testInstanceId: string) => void;
}

interface SubjectOption {
  id: number;
  name: string;
}

interface QuizFormData {
  subjectIds: number[];
  difficulty: string;
  duration: string;
  numberOfQuestions: string;
}

const difficulties = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

const durations = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
];

export const CustomQuizModal: React.FC<CustomQuizModalProps> = ({
  examId,
  open,
  onOpenChange,
  onQuizGenerated,
}) => {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<QuizFormData>({
    subjectIds: [],
    difficulty: "",
    duration: "",
    numberOfQuestions: "10",
  });

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuizFormData, string>>
  >({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (open && subjects.length === 0) {
      const fetchOptions = async () => {
        try {
          const data = await apiService.getCustomQuizOptions(examId);
          setSubjects(data.subjects);
        } catch (err) {
          setGeneralError(
            err instanceof Error ? err.message : "Failed to load subjects."
          );
        }
      };
      fetchOptions();
    }
  }, [open, examId, subjects.length]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QuizFormData, string>> = {};
    if (formData.subjectIds.length === 0)
      newErrors.subjectIds = "At least one subject is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.numberOfQuestions)
      newErrors.numberOfQuestions = "Number of questions is required";
    else {
      const num = parseInt(formData.numberOfQuestions);
      if (isNaN(num) || num < 5 || num > 50)
        newErrors.numberOfQuestions = "Must be between 5 and 50";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof QuizFormData,
    value: string | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (generalError) setGeneralError("");
  };

  const toggleSubject = (subjectId: number) => {
    const newSubjects = formData.subjectIds.includes(subjectId)
      ? formData.subjectIds.filter((id) => id !== subjectId)
      : [...formData.subjectIds, subjectId];
    handleInputChange("subjectIds", newSubjects);
  };

  const generateQuiz = async () => {
    try {
      // >>> STEP 3: Call the apiService to generate the quiz <<<
      const result = await apiService.generateCustomQuiz({
        examId: examId,
        subjectIds: formData.subjectIds,
        difficultyLevels: formData.difficulty ? [formData.difficulty] : [],
        questionCount: parseInt(formData.numberOfQuestions),
        timeLimitMinutes: parseInt(formData.duration),
      });

      handleClose(true);

      onQuizGenerated(result.testInstanceId);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Failed to create quiz. Please try again."
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    startTransition(() => {
      generateQuiz();
    });
  };

  const handleClose = (wasSubmitted = false) => {
    if (isPending) return;
    if (!wasSubmitted) {
      setFormData({
        subjectIds: [],
        difficulty: "",
        duration: "",
        numberOfQuestions: "10",
      });
      setErrors({});
      setGeneralError("");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-[#ff7b37]" />
            Create Custom Quiz
          </DialogTitle>
          <DialogDescription>
            Customize your learning experience by creating a personalized quiz
            tailored to your needs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subjects" className="flex items-center gap-2">
                Subjects
              </Label>
              <div
                className={`border rounded-md ${
                  errors.subjectIds ? "border-bg-red-500" : ""
                }`}
              >
                <div className="p-2 space-y-1">
                  {subjects.map((subject) => {
                    const isSelected = formData.subjectIds.includes(subject.id);
                    return (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => toggleSubject(subject.id)}
                        disabled={isPending}
                        className={`w-full text-left p-2 rounded-md transition-colors flex items-center gap-2 ${
                          isSelected
                            ? "bg-orange-50 text-orange-700"
                            : "hover:bg-gray-200 hover:text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-orange-500 bg-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        {subject.name}
                      </button>
                    );
                  })}
                  {subjects.length === 0 && (
                    <p className="p-2 text-sm text-gray-500">
                      Loading subjects...
                    </p>
                  )}
                </div>
              </div>
              {errors.subjectIds && (
                <p className="text-sm text-red-500">{errors.subjectIds}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="flex items-center gap-2">
                Difficulty Level
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(v) => handleInputChange("difficulty", v)}
                disabled={isPending}
              >
                <SelectTrigger
                  className={errors.difficulty ? "border-bg-red-500" : ""}
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {difficulties.map((d) => (
                    <SelectItem
                      key={d.value}
                      value={d.value}
                      className="hover:bg-gray-400 hover:text-white cursor-pointer"
                    >
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-red-500">{errors.difficulty}</p>
              )}
            </div>

            {/* Two-column layout for Duration and Question Count */}
            <div className="grid grid-cols-2 gap-4">
              {/* Duration Selection */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  Duration
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(v) => handleInputChange("duration", v)}
                  disabled={isPending}
                >
                  <SelectTrigger
                    className={errors.duration ? "border-bg-red-500" : ""}
                  >
                    <SelectValue placeholder="Minutes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {durations.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={d.value}
                        className="hover:bg-gray-400 hover:text-white cursor-pointer"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
              </div>
              {/* Number of Questions */}
              <div className="space-y-2">
                <Label
                  htmlFor="numberOfQuestions"
                  className="flex items-center gap-2"
                >
                  Questions
                </Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min="5"
                  max="50"
                  placeholder="5-50"
                  value={formData.numberOfQuestions}
                  onChange={(e) =>
                    handleInputChange("numberOfQuestions", e.target.value)
                  }
                  disabled={isPending}
                  className={
                    errors.numberOfQuestions ? "border-bg-red-500" : ""
                  }
                />
                {errors.numberOfQuestions && (
                  <p className="text-sm text-red-500">
                    {errors.numberOfQuestions}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                  Generating...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
