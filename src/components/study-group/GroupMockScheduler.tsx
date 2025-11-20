"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Play,
  Eye,
  Share2,
  Copy,
  Plus,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiService, CreateScheduledTestPayload } from "@/services/weaknessApi"; // Assuming weaknessApi is your apiService file
import { useRouter } from "next/navigation";

interface Subject {
  id: number;
  name: string;
}

interface MemberSelection {
  id: string;
  fullName: string;
}

interface ScheduledTest {
  id: string;
  name: string;
  description?: string;
  subjects: string[];
  participantCount: number;
  durationInMinutes: number;
  scheduledStartTime: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED";
  isCompletedByUser: boolean;
}

// Default state aligned with the API payload
const initialConfigState: CreateScheduledTestPayload = {
  name: "",
  description: "",
  subjectIds: [],
  difficultyDistribution: { Easy: 40, Medium: 40, Hard: 20 },
  totalQuestions: 50,
  durationInMinutes: 180,
  scheduledStartTime: "",
};

export const GroupMockScheduler = ({
  studyRoomId,
}: {
  studyRoomId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingTests, setLoadingTests] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [startingTestId, setStartingTestId] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  // Note: Members are fetched but not used for selection as backend adds all members by default
  const [members, setMembers] = useState<MemberSelection[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>([]);
  const [config, setConfig] =
    useState<CreateScheduledTestPayload>(initialConfigState);
  const [showAllTests, setShowAllTests] = useState(false);

  const router = useRouter();

  const fetchTests = useCallback(async () => {
    if (!studyRoomId) return;
    setLoadingTests(true);
    try {
      const data = await apiService.getScheduledTests(studyRoomId);
      const formattedData = data.map((test: any) => ({
        ...test,
        status: getTestStatus(test.scheduledStartTime, test.durationInMinutes),
      }));
      setScheduledTests(formattedData);
    } catch (error) {
      toast.error("Failed to load scheduled tests.");
    } finally {
      setLoadingTests(false);
    }
  }, [studyRoomId]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const getTestStatus = (
    startTime: string,
    duration: number
  ): ScheduledTest["status"] => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    if (now > end) return "COMPLETED";
    if (now >= start && now <= end) return "LIVE";
    return "SCHEDULED";
  };

  useEffect(() => {
    const fetchTests = async () => {
      if (!studyRoomId) return;
      setLoadingTests(true);
      try {
        const data = await apiService.getScheduledTests(studyRoomId);
        // Map the backend response to the frontend's ScheduledTest type
        const formattedData = data.map((test: any) => ({
          ...test,
          status: getTestStatus(
            test.scheduledStartTime,
            test.durationInMinutes
          ),
        }));
        setScheduledTests(formattedData);
      } catch (error) {
        toast.error("Failed to load scheduled tests.");
        console.error(error);
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, [studyRoomId]);

  useEffect(() => {
    if (isOpen) {
      const fetchFormData = async () => {
        setLoadingFormData(true);
        try {
          // Assume examId=1 for fetching subjects. This could be a prop.
          const [subjectsData, membersData] = await Promise.all([
            apiService.getSubjectsWithTopicsByExam(1),
            apiService.getGroupMembersForSelection(studyRoomId),
          ]);
          setSubjects(subjectsData);
          setMembers(membersData); // Members are fetched for context but not for selection UI
        } catch (error) {
          toast.error("Failed to load necessary data for the form.");
          console.error(error);
        } finally {
          setLoadingFormData(false);
        }
      };
      fetchFormData();
    }
  }, [isOpen, studyRoomId]);

  // Updated steps since member selection is automatic on the backend
  const steps = [
    { title: "Basic Info", description: "Test details and configuration" },
    { title: "Questions", description: "Content and difficulty settings" },
    { title: "Schedule", description: "Set the test timing" },
    { title: "Review", description: "Confirm and create test" },
  ];

  const resetForm = () => {
    setConfig(initialConfigState);
    setCurrentStep(0);
  };

  const handleCreateTest = async () => {
    // Basic validation
    if (config.name.trim().length < 3) {
      toast.error("Test name must be at least 3 characters long.");
      return;
    }
    if (config.subjectIds.length === 0) {
      toast.error("Please select at least one subject.");
      return;
    }
    const totalDifficulty = Object.values(config.difficultyDistribution).reduce(
      (a, b) => a + b,
      0
    );
    if (Math.abs(totalDifficulty - 100) > 1) {
      toast.error("Difficulty percentages must add up to 100.");
      return;
    }
    if (!config.scheduledStartTime) {
      toast.error("Please set a scheduled start time.");
      return;
    }

    setIsCreatingTest(true);
    try {
      await apiService.createScheduledTest(studyRoomId, config);
      await fetchTests(); // Refresh the list after creation
      setIsOpen(false);
      resetForm();
      toast.success("Mock test created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create mock test.");
    } finally {
      setIsCreatingTest(false);
    }
  };

  const handleStartTest = async (scheduledTestId: string) => {
    setStartingTestId(scheduledTestId); // Set loading state for this specific button
    try {
      const response = await apiService.startGroupTest(scheduledTestId);
      const { testInstanceId } = response;
      if (testInstanceId) {
        router.push(`/group-mock/${testInstanceId}`);
      } else {
        throw new Error("Could not retrieve the test instance ID.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to start the test.");
    } finally {
      setStartingTestId(null); // Clear loading state
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const getTimeUntilStart = (scheduledStart: string) => {
    const now = new Date();
    const start = new Date(scheduledStart);
    const diff = start.getTime() - now.getTime();

    if (diff <= 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return config.name.trim().length > 2;
      case 1:
        return config.subjectIds.length > 0 && config.totalQuestions > 0;
      case 2:
        return config.scheduledStartTime !== "";
      default:
        return true;
    }
  };

  const getSelectedSubjectNames = () => {
    return subjects
      .filter((s) => config.subjectIds.includes(s.id))
      .map((s) => s.name);
  };

  const handleNavigateToResults = async (scheduledTestId: string) => {
    // Note: The results page might also need a resolver like the test page,
    // to find the user's specific test instance ID. For now, we navigate with the event ID.
    const response = await apiService.startGroupTest(scheduledTestId);
    const { testInstanceId } = response;
    if (testInstanceId) {
      router.push(`/group-mock-results/${testInstanceId}`);
    } else {
      throw new Error("Could not retrieve the test instance ID.");
    }
  };

  const renderActionButton = (test: ScheduledTest) => {
    const isLoading = startingTestId === test.id;

    if (test.isCompletedByUser) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleNavigateToResults(test.id)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View Results
        </Button>
      );
    }

    switch (test.status) {
      case "LIVE":
        return (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleStartTest(test.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-1" />
            )}
            {isLoading ? "Starting..." : "Go to Test"}
          </Button>
        );
      case "SCHEDULED":
        return (
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => handleStartTest(test.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isLoading ? "Preparing..." : "Start Now"}
          </Button>
        );
      case "COMPLETED":
        return (
          <Button size="sm" variant="outline" disabled>
            Test Ended
          </Button>
        );
    }
  };

  const testsToDisplay = showAllTests
    ? scheduledTests
    : scheduledTests.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1c1f24]">
            Mock Test Scheduler
          </h2>
          <p className="text-text-body">Create and manage group mock tests</p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#fe7244] hover:bg-[#fe7244]/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Mock Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>Create Mock Test</DialogTitle>
              <DialogDescription>
                Set up a new mock test for your group members.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= currentStep
                            ? "bg-[#fe7244] text-[#ffffff]"
                            : "bg-muted text-[#7d7e80]"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-2 hidden sm:block">
                        <p className="text-sm font-medium">{step.title}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          index < currentStep ? "bg-[#fe7244]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step Content */}
              {currentStep === 0 && (
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Configure the basic details of your mock test.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="test-name">Test Name *</Label>
                      <Input
                        id="test-name"
                        value={config.name}
                        onChange={(e) =>
                          setConfig({ ...config, name: e.target.value })
                        }
                        placeholder="e.g., Weekly Mathematics Mock Test"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="test-description">Description</Label>
                      <Textarea
                        id="test-description"
                        value={config.description}
                        onChange={(e) =>
                          setConfig({ ...config, description: e.target.value })
                        }
                        placeholder="Optional description of the test content"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Question Configuration</CardTitle>
                    <CardDescription>
                      Set up the content and structure of your test.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Subjects *</Label>
                      <Select
                        onValueChange={(value) => {
                          const subjectId = parseInt(value);
                          if (!config.subjectIds.includes(subjectId)) {
                            setConfig({
                              ...config,
                              subjectIds: [...config.subjectIds, subjectId],
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Add subjects..." />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem
                              key={subject.id}
                              value={subject.id.toString()}
                            >
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getSelectedSubjectNames().map((subjectName, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {subjectName}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => {
                                const subjectIdToRemove = subjects.find(
                                  (s) => s.name === subjectName
                                )?.id;
                                setConfig({
                                  ...config,
                                  subjectIds: config.subjectIds.filter(
                                    (id) => id !== subjectIdToRemove
                                  ),
                                });
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="total-questions">Total Questions</Label>
                        <Input
                          id="total-questions"
                          type="number"
                          value={config.totalQuestions}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              totalQuestions: parseInt(e.target.value) || 1,
                            })
                          }
                          className="mt-1"
                          min="1"
                          max="200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={config.durationInMinutes}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              durationInMinutes: parseInt(e.target.value) || 1,
                            })
                          }
                          className="mt-1"
                          min="1"
                          max="480"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Difficulty Distribution (%)</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {/* Easy, Medium, Hard inputs remain the same */}
                        <div>
                          <Label htmlFor="easy">Easy</Label>
                          <Input
                            id="easy"
                            type="number"
                            value={config.difficultyDistribution.Easy}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                difficultyDistribution: {
                                  ...config.difficultyDistribution,
                                  Easy: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="mt-1"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="medium">Medium</Label>
                          <Input
                            id="medium"
                            type="number"
                            value={config.difficultyDistribution.Medium}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                difficultyDistribution: {
                                  ...config.difficultyDistribution,
                                  Medium: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="mt-1"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hard">Hard</Label>
                          <Input
                            id="hard"
                            type="number"
                            value={config.difficultyDistribution.Hard}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                difficultyDistribution: {
                                  ...config.difficultyDistribution,
                                  Hard: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="mt-1"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>
                      Set when the test should be available to participants.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="scheduled-start">
                        Scheduled Start Time *
                      </Label>
                      <Input
                        id="scheduled-start"
                        type="datetime-local"
                        value={config.scheduledStartTime}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            scheduledStartTime: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Create</CardTitle>
                    <CardDescription>
                      Confirm your test configuration before creating.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-500">Test Name</Label>
                        <p className="font-medium">{config.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Duration</Label>
                        <p className="font-medium">
                          {config.durationInMinutes} minutes
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Total Questions</Label>
                        <p className="font-medium">{config.totalQuestions}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Participants</Label>
                        <p className="font-medium">
                          All {members.length} group members
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-500">Subjects</Label>
                        <p className="font-medium">
                          {getSelectedSubjectNames().join(", ") || "None"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-500">Scheduled Start</Label>
                        <p className="font-medium">
                          {config.scheduledStartTime
                            ? new Date(
                                config.scheduledStartTime
                              ).toLocaleString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceed()}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleCreateTest} disabled={!canProceed()}>
                      Confirm & Create Test
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loadingTests ? (
          <p>Loading tests...</p>
        ) : scheduledTests.length > 0 ? (
          <>
            {/* Map over the conditionally sliced array */}
            {testsToDisplay.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{test.name}</h3>
                        <Badge
                          variant={
                            test.status === "LIVE" ? "destructive" : "secondary"
                          }
                        >
                          {test.status}
                        </Badge>
                      </div>
                      {test.description && (
                        <p className="text-sm text-[#7d7e80] max-w-lg">
                          {test.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-[#7d7e80]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.durationInMinutes} minutes
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {test.participantCount} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {getTimeUntilStart(test.scheduledStartTime)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {test.subjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="outline"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderActionButton(test)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(`Test ID: ${test.id}`, "Test ID")
                        }
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {scheduledTests.length > 3 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="link"
                  className="text-[#fe7244] hover:text-[#fe7244]/80"
                  onClick={() => setShowAllTests(!showAllTests)}
                >
                  {showAllTests
                    ? "View Less"
                    : `View ${scheduledTests.length - 3} More...`}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#7d7e80]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No tests scheduled</h3>
                  <p className="text-[#7d7e80]">
                    Create your first mock test to get started.
                  </p>
                </div>
                <Button
                  onClick={() => setIsOpen(true)}
                  className="bg-[#fe7244] hover:bg-[#fe7244]/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Mock Test
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
