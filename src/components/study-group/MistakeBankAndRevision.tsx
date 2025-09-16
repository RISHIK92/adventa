"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  BookOpen,
  Target,
  Users,
  Clock,
  Download,
  Upload,
  Share2,
  Play,
  Plus,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  BarChart3,
  Grid3X3,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { QuestionReviewItem, LeaderboardMember } from "@/services/weaknessApi";

// Mock data types
interface MistakeQuestion {
  id: string;
  subject: string;
  chapter: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  correctAnswer: string;
  selectedAnswers: Record<string, string>;
  explanation: string;
  frequency: number;
  lastAttempted: Date;
  tags: string[];
  membersWhoMissed: string[];
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  progress: {
    practiced: number;
    total: number;
    mastery: number;
  };
}

interface RevisionTest {
  id: string;
  name: string;
  questionCount: number;
  timeLimit?: number;
  createdAt: Date;
  status: "Draft" | "Scheduled" | "Active" | "Completed";
}

const subjectColors = {
  Mathematics: "bg-blue-500",
  Physics: "bg-green-500",
  Chemistry: "bg-purple-500",
  Biology: "bg-orange-500",
};

interface MistakeQuestion {
  id: string;
  subject: string;
  chapter: string;
  difficulty: "Easy" | "Medium" | "Hard"; // Note: This is mocked as backend doesn't provide it yet
  question: string;
  correctAnswer: string;
  selectedAnswers: Record<string, string>;
  explanation: string;
  frequency: number; // How many people missed it
  membersWhoMissed: string[];
}

interface MistakeBankAndRevisionProps {
  questionReview: QuestionReviewItem[];
  members: LeaderboardMember[];
}

export default function MistakeBankAndRevision({
  questionReview,
  members,
}: MistakeBankAndRevisionProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [testConfig, setTestConfig] = useState({
    name: "",
    questionCount: 10,
    timeLimit: 60,
    isTimeLimited: true,
  });

  const memberMap = useMemo(() => {
    return new Map(members.map((m) => [m.id, m.name]));
  }, [members]);

  // Convert the fetched questionReview data into the format this component needs
  const mistakeBankQuestions = useMemo((): MistakeQuestion[] => {
    return questionReview
      .map((q) => {
        const missedBy: string[] = [];
        const wrongAnswers: Record<string, string> = {};

        Object.entries(q.memberAnswers).forEach(([userId, answer]) => {
          if (answer !== q.correctAnswer && answer !== null) {
            missedBy.push(userId);
            wrongAnswers[memberMap.get(userId) || userId] = answer;
          }
        });

        if (missedBy.length === 0) return null; // Don't include questions everyone got right

        return {
          id: String(q.id),
          subject: q.subject,
          chapter: q.topic,
          difficulty: "Medium", // Placeholder until backend provides this
          question: q.questionText,
          correctAnswer: q.options[q.correctAnswer] || q.correctAnswer,
          selectedAnswers: wrongAnswers,
          explanation: q.explanation,
          frequency: missedBy.length,
          membersWhoMissed: missedBy.map((id) => memberMap.get(id) || id),
          lastAttempted: new Date(),
          tags: [q.topic.toLowerCase().replace(" ", "-")],
        };
      })
      .filter((q): q is MistakeQuestion => q !== null);
  }, [questionReview, memberMap]);

  // Filter questions based on search and filters
  const filteredQuestions = useMemo(() => {
    return mistakeBankQuestions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesSubject =
        subjectFilter === "all" || question.subject === subjectFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || question.difficulty === difficultyFilter;
      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  }, [mistakeBankQuestions, searchTerm, subjectFilter, difficultyFilter]);

  const analytics = useMemo(() => {
    const totalQuestions = mistakeBankQuestions.length;
    if (totalQuestions === 0) {
      return {
        totalQuestions: 0,
        mostFailedConcept: "N/A",
        averageFrequency: 0,
      };
    }
    const mostFailedConcept = mistakeBankQuestions.reduce((prev, curr) =>
      curr.frequency > prev.frequency ? curr : prev
    );
    const averageFrequency =
      mistakeBankQuestions.reduce((sum, q) => sum + q.frequency, 0) /
      totalQuestions;

    return {
      totalQuestions,
      mostFailedConcept: mostFailedConcept.tags[0] || "derivatives",
      averageFrequency: Math.round(averageFrequency),
    };
  }, []);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuestions(
      selectedQuestions.length === filteredQuestions.length
        ? []
        : filteredQuestions.map((q) => q.id)
    );
  };

  const handleCreatePracticeSet = () => {
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question");
      return;
    }
    setShowCreateTest(true);
  };

  const handleAutoGenerate = () => {
    // Mock auto-generation logic
    const highFrequencyQuestions = mistakeBankQuestions
      .sort((a, b) => b.frequency - a.frequency)
      .slice(
        0,
        Math.min(testConfig.questionCount, mistakeBankQuestions.length)
      );

    setSelectedQuestions(highFrequencyQuestions.map((q) => q.id));
    setShowAutoGenerate(true);
  };

  const handleCreateTest = () => {
    toast.success(
      `Created revision test "${testConfig.name}" with ${selectedQuestions.length} questions`
    );
    setShowCreateTest(false);
    setSelectedQuestions([]);
    setTestConfig({
      name: "",
      questionCount: 10,
      timeLimit: 60,
      isTimeLimited: true,
    });
  };

  // const handleAssignToBuddy = (memberId: string) => {
  //   if (selectedQuestions.length === 0) {
  //     toast.error("Please select questions to assign");
  //     return;
  //   }
  //   const member = memberMap.find((m: any) => m.id === memberId);
  //   toast.success(
  //     `Assigned ${selectedQuestions.length} questions to ${member?.name}`
  //   );
  //   setSelectedQuestions([]);
  // };

  const handleExport = () => {
    toast.success("Questions exported to CSV");
  };

  const handleImport = () => {
    toast.success("Questions imported successfully");
  };

  return (
    <div className="space-y-6 md:p-24 p-0">
      {/* Header with Analytics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-header">
              Mistake Bank & Revision
            </h1>
            <p className="text-text-body">
              Collaborative mistake tracking and targeted revision
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#ffffff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fe7244]/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-[#fe7244]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-xl font-semibold">
                    {analytics.totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffffff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ef4444]/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-[#ef4444]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Most Failed Concept
                  </p>
                  <p className="text-xl font-semibold capitalize">
                    {analytics.mostFailedConcept}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffffff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg. Frequency
                  </p>
                  <p className="text-xl font-semibold">
                    {analytics.averageFrequency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="mistakes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="mistakes">Mistake Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="mistakes" className="space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedQuestions.length > 0 && (
            <Card className="bg-[#ffffff]">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {selectedQuestions.length} question
                    {selectedQuestions.length !== 1 ? "s" : ""} selected
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={handleCreatePracticeSet}>
                      <Play className="h-4 w-4 mr-1" />
                      Create Practice Set
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAutoGenerate}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Auto Generate
                    </Button>
                    {/* <Select onValueChange={handleAssignToBuddy}>
                      <SelectTrigger className="w-40">
                        <Users className="h-4 w-4 mr-1" />
                        <SelectValue placeholder="Assign to Buddy" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberMap.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <Button size="sm" variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedQuestions.length === filteredQuestions.length &&
                  filteredQuestions.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share Bank
              </Button>
            </div>
          </div>

          {/* Questions Grid/List */}
          <div
            className={`grid gap-4 ${
              viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="bg-[#ffffff]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={() =>
                          handleSelectQuestion(question.id)
                        }
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              subjectColors[
                                question.subject as keyof typeof subjectColors
                              ]
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {question.subject}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {question.chapter}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              question.difficulty === "Hard"
                                ? "destructive"
                                : question.difficulty === "Medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            Failed {question.frequency}x
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Question</h4>
                    <p className="text-sm text-muted-foreground">
                      {question.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-green-500 mb-1">
                        Correct Answer
                      </h5>
                      <p className="text-sm bg-green-500/10 p-2 rounded border-l-2 border-green-500">
                        {question.correctAnswer}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-[#ef4444] mb-1">
                        Wrong Answers
                      </h5>
                      <div className="space-y-1">
                        {Object.entries(question.selectedAnswers).map(
                          ([student, answer]) => (
                            <div
                              key={student}
                              className="text-xs bg-[#ef4444]/10 p-2 rounded"
                            >
                              <span className="font-medium capitalize">
                                {student}:
                              </span>{" "}
                              {answer}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-1">Explanation</h5>
                    <p className="text-sm text-muted-foreground bg-gray-100 p-3 rounded">
                      {question.explanation}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {question.membersWhoMissed.length} member
                      {question.membersWhoMissed.length !== 1 ? "s" : ""} missed
                    </div> */}
                    <div className="flex items-center gap-2">
                      {/* <Button size="sm" variant="outline">
                        Practice
                      </Button> */}
                      <Button size="sm">Add to Revision</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Practice Set Dialog */}
      <Dialog open={showCreateTest} onOpenChange={setShowCreateTest}>
        <DialogContent className="bg-[#ffffff]">
          <DialogHeader>
            <DialogTitle>Create Practice Set</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Test Name
              </label>
              <Input
                placeholder="Enter test name..."
                value={testConfig.name}
                onChange={(e) =>
                  setTestConfig((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Number of Questions
              </label>
              <Input
                type="number"
                min="1"
                max={selectedQuestions.length}
                value={testConfig.questionCount}
                onChange={(e) =>
                  setTestConfig((prev) => ({
                    ...prev,
                    questionCount: parseInt(e.target.value) || 10,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="time-limit"
                  checked={testConfig.isTimeLimited}
                  onCheckedChange={(checked) =>
                    setTestConfig((prev) => ({
                      ...prev,
                      isTimeLimited: !!checked,
                    }))
                  }
                />
                <label htmlFor="time-limit" className="text-sm font-medium">
                  Set time limit
                </label>
              </div>

              {testConfig.isTimeLimited && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="5"
                    value={testConfig.timeLimit}
                    onChange={(e) =>
                      setTestConfig((prev) => ({
                        ...prev,
                        timeLimit: parseInt(e.target.value) || 60,
                      }))
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateTest(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTest}
                disabled={!testConfig.name.trim()}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Create Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto Generate Dialog */}
      <Dialog open={showAutoGenerate} onOpenChange={setShowAutoGenerate}>
        <DialogContent className="bg-[#ffffff]">
          <DialogHeader>
            <DialogTitle>Auto-Generated Revision Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded">
              <h4 className="font-medium mb-2">Test Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Questions Selected:</span>
                  <span className="font-medium">
                    {selectedQuestions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Focus Areas:</span>
                  <span className="font-medium">High-frequency mistakes</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty Mix:</span>
                  <span className="font-medium">Balanced</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Test Name
              </label>
              <Input
                placeholder="Auto-Generated Revision Test"
                value={testConfig.name}
                onChange={(e) =>
                  setTestConfig((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAutoGenerate(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTest}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Generate Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
