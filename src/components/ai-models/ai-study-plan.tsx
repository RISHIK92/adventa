"use client";

import {
  Bot,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PriorityArea {
  topic: string;
  priority: "urgent" | "important" | "beneficial";
  studyTime: string;
  confidence: number;
  description: string;
}

interface StudyStep {
  title: string;
  description: string;
  estimatedTime: string;
  isPrerequisite: boolean;
  completed: boolean;
}

interface PracticeSuggestion {
  type: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  focus: string;
}

interface ResourceRecommendation {
  title: string;
  type: "video" | "cheatsheet" | "practice" | "mock";
  description: string;
  estimatedTime: string;
}

const priorityAreas: PriorityArea[] = [
  {
    topic: "Algebraic Expressions",
    priority: "urgent",
    studyTime: "2-3 hours",
    confidence: 35,
    description: "Focus on factoring and simplification techniques",
  },
  {
    topic: "Linear Equations",
    priority: "important",
    studyTime: "1-2 hours",
    confidence: 65,
    description: "Review solving systems and graphing methods",
  },
  {
    topic: "Quadratic Functions",
    priority: "beneficial",
    studyTime: "1 hour",
    confidence: 78,
    description: "Polish vertex form and discriminant applications",
  },
];

const studyPath: StudyStep[] = [
  {
    title: "Review Basic Operations",
    description:
      "Strengthen foundation with order of operations and properties",
    estimatedTime: "30 min",
    isPrerequisite: true,
    completed: false,
  },
  {
    title: "Master Factoring Techniques",
    description: "Practice common factoring patterns and methods",
    estimatedTime: "45 min",
    isPrerequisite: false,
    completed: false,
  },
  {
    title: "Apply to Word Problems",
    description: "Connect algebraic concepts to real-world scenarios",
    estimatedTime: "60 min",
    isPrerequisite: false,
    completed: false,
  },
];

const practiceSuggestions: PracticeSuggestion[] = [
  {
    type: "Adaptive Quiz",
    difficulty: "medium",
    questionCount: 15,
    focus: "Algebraic manipulation",
  },
  {
    type: "Timed Practice",
    difficulty: "easy",
    questionCount: 20,
    focus: "Basic factoring patterns",
  },
  {
    type: "Mixed Review",
    difficulty: "hard",
    questionCount: 10,
    focus: "Complex expressions",
  },
];

const resourceRecommendations: ResourceRecommendation[] = [
  {
    title: "Algebra Fundamentals Cheat Sheet",
    type: "cheatsheet",
    description: "Quick reference for key formulas and techniques",
    estimatedTime: "5 min read",
  },
  {
    title: "Factoring Methods Video Series",
    type: "video",
    description: "Step-by-step visual explanations of factoring approaches",
    estimatedTime: "25 min watch",
  },
  {
    title: "Algebra Practice Test",
    type: "mock",
    description: "Full-length practice exam with detailed explanations",
    estimatedTime: "90 min",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-50 border-red-200 text-red-800";
    case "important":
      return "bg-orange-50 border-orange-200 text-orange-800";
    case "beneficial":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700 hover:bg-red-200";
    case "important":
      return "bg-orange-100 text-orange-700 hover:bg-orange-200";
    case "beneficial":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "text-green-600";
    case "medium":
      return "text-orange-600";
    case "hard":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case "video":
      return <BookOpen className="w-4 h-4" />;
    case "cheatsheet":
      return <Target className="w-4 h-4" />;
    case "practice":
      return <Zap className="w-4 h-4" />;
    case "mock":
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export default function AIRecommendationsPanel() {
  return (
    <div className="bg-white">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">
                AI-Powered Study Recommendations
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Personalized guidance based on your quiz performance
              </p>
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-foreground font-medium">
              Based on your current performance level, I've identified key areas
              for improvement and created a customized study plan to boost your
              confidence and scores.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Priority Focus Areas */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Priority Focus Areas
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {priorityAreas.map((area, index) => (
                <Card
                  key={index}
                  className={`${getPriorityColor(
                    area.priority
                  )} border-2 hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-sm">{area.topic}</h4>
                      <Badge
                        className={getPriorityBadgeColor(area.priority)}
                        variant="secondary"
                      >
                        {area.priority}
                      </Badge>
                    </div>
                    <p className="text-xs mb-3 opacity-80">
                      {area.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {area.studyTime}
                        </span>
                        <span>{area.confidence}% confidence</span>
                      </div>
                      <Progress value={area.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommended Study Path */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Recommended Study Path
            </h3>
            <div className="space-y-4">
              {studyPath.map((step, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {step.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {step.estimatedTime}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {step.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {step.isPrerequisite && (
                            <Badge variant="outline" className="text-xs">
                              Prerequisite
                            </Badge>
                          )}
                          <Button size="sm" className="ml-auto">
                            Start Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Practice Suggestions */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Practice Suggestions
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {practiceSuggestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground">
                        {suggestion.type}
                      </h4>
                      <Badge
                        className={getDifficultyColor(suggestion.difficulty)}
                        variant="outline"
                      >
                        {suggestion.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">
                          {suggestion.questionCount}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Focus:
                        </span>{" "}
                        {suggestion.focus}
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resource Recommendations */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Resource Recommendations
            </h3>
            <div className="space-y-4">
              {resourceRecommendations.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {resource.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {resource.estimatedTime}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Access Resource
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Ready to improve your scores?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Follow these recommendations for targeted improvement
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Star className="w-4 h-4" />
                Save Recommendations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
