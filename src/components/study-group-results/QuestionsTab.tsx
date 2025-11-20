// src/components/QuestionsTab.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import the Button component
import {
  BookOpen,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  getDifficultyColor,
  formatTime,
  toggleExpansion,
} from "@/utils/helpers";

// Define props
interface QuestionsTabProps {
  questionReview: any[];
  memberMap: Map<string, string>;
}

export const QuestionsTab = ({
  questionReview,
  memberMap,
}: QuestionsTabProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  // NEW STATE: Tracks which question's answer list is fully expanded
  const [expandedAnswerLists, setExpandedAnswerLists] = useState<Set<string>>(
    new Set()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> Detailed Question
          Analysis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Review each question with explanations and group performance data.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {questionReview.map((q, index) => {
          // Prepare variables for the member answer list
          const allMemberAnswers = Object.entries(q.memberAnswers);
          const isAnswerListExpanded = expandedAnswerLists.has(String(q.id));
          const answersToShow = isAnswerListExpanded
            ? allMemberAnswers
            : allMemberAnswers.slice(0, 3);

          return (
            <Card key={q.id} className="border">
              {/* --- COLLAPSIBLE HEADER (No changes here) --- */}
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  toggleExpansion(String(q.id), setExpandedQuestions)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {expandedQuestions.has(String(q.id)) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-semibold">Q{index + 1}</span>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(q.difficulty)}
                    >
                      {q.difficulty}
                    </Badge>
                    <Badge variant="outline">{q.subject}</Badge>
                    {q.myAnswer === q.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : q.myAnswer === null ? (
                      <span className="text-xs text-gray-500">(Skipped)</span>
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Your time: {formatTime(q.timeTaken)}</span>
                    <span>
                      Group avg: {formatTime(q.groupStats.averageTime)}
                    </span>
                    <span>{Math.round(q.groupStats.accuracy)}% correct</span>
                  </div>
                </div>
                <p className="text-left mt-2 pl-8 text-gray-900">{q.text}</p>
              </CardHeader>

              {/* --- EXPANDED CONTENT --- */}
              {expandedQuestions.has(String(q.id)) && (
                <CardContent className="pt-0 pl-8 space-y-4">
                  {/* Options List (no changes here) */}
                  <div className="space-y-2">
                    {Object.entries(q.options).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                            key === q.correctAnswer
                              ? "border-green-300 bg-green-50"
                              : q.myAnswer === key
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <span className="flex-1">
                            {key}. {value}
                          </span>
                          <div className="flex items-center gap-2 ml-4">
                            {key === q.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {q.myAnswer === key && key !== q.correctAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {q.groupStats.optionDistribution[key] || 0}{" "}
                              members
                            </Badge>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Explanation (no changes here) */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Explanation
                    </h4>
                    <p className="text-sm text-blue-800">{q.explanation}</p>
                  </div>

                  {/* --- MEMBER ANSWERS SECTION (UPDATED) --- */}
                  <div>
                    <h4 className="font-semibold mb-2">Member Answers</h4>
                    <div className="text-sm space-y-1 border rounded-md p-2 bg-slate-50">
                      {answersToShow.map(
                        ([memberId, answer]: [string, any]) => (
                          <div
                            key={memberId}
                            className="flex justify-between items-center pr-2"
                          >
                            <span className="text-gray-700">
                              {memberMap.get(memberId) || "Unknown User"}
                            </span>
                            {answer ? (
                              <span
                                className={`font-bold py-0.5 px-2 rounded-md text-xs ${
                                  answer === q.correctAnswer
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                Chose {answer}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs font-medium">
                                Skipped
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                    {/* --- VIEW MORE/LESS BUTTON (NEW) --- */}
                    {allMemberAnswers.length > 3 && (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm mt-2"
                        onClick={() =>
                          toggleExpansion(String(q.id), setExpandedAnswerLists)
                        }
                      >
                        {isAnswerListExpanded
                          ? "View Less"
                          : `View ${
                              allMemberAnswers.length - 3
                            } more answers...`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};
