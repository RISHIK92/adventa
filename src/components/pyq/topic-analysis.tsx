"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  TrendingUp,
  Target,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Users,
  User,
} from "lucide-react";

interface SubtopicData {
  name: string;
  accuracy: number;
  communityAccuracy: number;
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  avgTime: number;
}

interface TopicData {
  name: string;
  accuracy: number;
  communityAccuracy: number;
  questions: number;
  avgTime: number;
  status: "Cutoff Cleared" | "Close to Cutoff" | "Needs Work";
  subtopics: SubtopicData[];
  difficultyBreakdown: {
    easy: { accuracy: number; communityAccuracy: number; questions: number };
    medium: { accuracy: number; communityAccuracy: number; questions: number };
    hard: { accuracy: number; communityAccuracy: number; questions: number };
  };
}

interface SubjectData {
  subject: string;
  overallAccuracy: number;
  communityAccuracy: number;
  totalQuestions: number;
  avgTime: number;
  status: "Cutoff Cleared" | "Close to Cutoff" | "Needs Work";
  topics: TopicData[];
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Cutoff Cleared":
      return <Target className="w-3 h-3" />;
    case "Close to Cutoff":
      return <TrendingUp className="w-3 h-3" />;
    case "Needs Work":
      return <AlertTriangle className="w-3 h-3" />;
    default:
      return null;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Cutoff Cleared":
      return "from-emerald-400 to-green-500";
    case "Close to Cutoff":
      return "from-amber-400 to-orange-500";
    case "Needs Work":
      return "from-red-400 to-pink-500";
    default:
      return "from-slate-400 to-slate-500";
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "from-emerald-400 to-green-500";
    case "Medium":
      return "from-amber-400 to-orange-500";
    case "Hard":
      return "from-red-400 to-pink-500";
    default:
      return "from-slate-400 to-slate-500";
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function TopicAnalysis({
  performanceData,
}: {
  performanceData: SubjectData[];
}) {
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleTopic = (topicKey: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicKey)
        ? prev.filter((t) => t !== topicKey)
        : [...prev, topicKey]
    );
  };

  return (
    <div className="space-y-6">
      {performanceData.map((subjectData) => (
        <div
          key={subjectData.subject}
          className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
        >
          {/* Subject Header */}
          <div
            className="p-6 cursor-pointer hover:bg-white/40 transition-all duration-300"
            onClick={() => toggleSubject(subjectData.subject)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {expandedSubjects.includes(subjectData.subject) ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {subjectData.subject}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-slate-600">
                      {subjectData.totalQuestions} questions
                    </span>
                    <span className="text-sm text-slate-600">
                      Avg: {formatTime(subjectData.avgTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Your Accuracy */}
                <div className="text-center">
                  <div className="flex items-center space-x-1 mb-1">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-600">Your Score</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {subjectData.overallAccuracy}%
                  </div>
                </div>

                {/* Community Accuracy */}
                <div className="text-center">
                  <div className="flex items-center space-x-1 mb-1">
                    <Users className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-600">Community</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-600">
                    {subjectData.communityAccuracy}%
                  </div>
                </div>

                {/* Status Badge */}
                <Badge
                  className={`bg-gradient-to-r ${getStatusColor(
                    subjectData.status
                  )} text-white border-0 shadow-lg`}
                >
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(subjectData.status)}
                    <span>{subjectData.status}</span>
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          {/* Expanded Subject Content */}
          {expandedSubjects.includes(subjectData.subject) && (
            <div className="px-6 pb-6 space-y-4">
              {subjectData.topics.map((topic, topicIndex) => {
                const topicKey = `${subjectData.subject}-${topic.name}`;
                return (
                  <div
                    key={topicIndex}
                    className="bg-white/80 rounded-xl border border-white/30 shadow-lg"
                  >
                    {/* Topic Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-white/60 transition-all duration-300"
                      onClick={() => toggleTopic(topicKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {expandedTopics.includes(topicKey) ? (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          )}
                          <div>
                            <h4 className="font-semibold text-slate-800">
                              {topic.name}
                            </h4>
                            <span className="text-sm text-slate-600">
                              {topic.questions} questions
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-800">
                              {topic.accuracy}%
                            </div>
                            <div className="text-xs text-slate-600">You</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-600">
                              {topic.communityAccuracy}%
                            </div>
                            <div className="text-xs text-slate-600">
                              Community
                            </div>
                          </div>
                          <Badge
                            className={`bg-gradient-to-r ${getStatusColor(
                              topic.status
                            )} text-white border-0 text-xs`}
                          >
                            {topic.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Topic Content */}
                    {expandedTopics.includes(topicKey) && (
                      <div className="px-4 pb-4 space-y-4">
                        {/* Subtopics */}
                        <div className="bg-slate-50/80 rounded-lg p-4">
                          <h5 className="font-semibold text-slate-800 mb-3">
                            Subtopic Analysis
                          </h5>
                          <div className="space-y-3">
                            {topic.subtopics.map((subtopic, subtopicIndex) => (
                              <div
                                key={subtopicIndex}
                                className="bg-white rounded-lg p-3 border border-slate-200"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div>
                                      <div className="font-medium text-slate-800">
                                        {subtopic.name}
                                      </div>
                                      <div className="text-sm text-slate-600">
                                        {subtopic.questions} questions •{" "}
                                        {formatTime(subtopic.avgTime)}
                                      </div>
                                    </div>
                                    <Badge
                                      className={`bg-gradient-to-r ${getDifficultyColor(
                                        subtopic.difficulty
                                      )} text-white border-0 text-xs`}
                                    >
                                      {subtopic.difficulty}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-slate-800">
                                        {subtopic.accuracy}%
                                      </div>
                                      <div className="text-xs text-slate-600">
                                        You
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-slate-600">
                                        {subtopic.communityAccuracy}%
                                      </div>
                                      <div className="text-xs text-slate-600">
                                        Community
                                      </div>
                                    </div>
                                    <div className="w-24">
                                      <Progress
                                        value={subtopic.accuracy}
                                        className="h-2"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
