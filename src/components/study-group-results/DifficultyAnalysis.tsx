// src/components/DifficultyAnalysis.tsx

"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSubjectColor } from "@/utils/helpers"; // Import the color helper

// The data structure for a single item remains the same
interface DifficultyTopicData {
  topicName: string;
  difficulty: string;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
}

// The component now expects data grouped by subject
interface GroupedDifficultyData {
  [subjectName: string]: DifficultyTopicData[];
}

// Helper to get styling for the difficulty badge
const getDifficultyStyling = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-700 font-medium";
    case "medium":
      return "text-yellow-700 font-medium";
    case "hard":
      return "text-red-700 font-medium";
    default:
      return "text-slate-700 font-medium";
  }
};

export function DifficultyAnalysis({ data }: { data: GroupedDifficultyData }) {
  // Don't render if the data object is empty
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Weakest Performance Areas by Subject
        </CardTitle>
        <p className="text-sm text-gray-600">
          Target these specific subtopics and difficulties to improve your
          score.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(data).map(([subjectName, topics]) => (
          <div key={subjectName}>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: getSubjectColor(subjectName) }}
            >
              {subjectName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((item, index) => {
                const isSuccess = item.accuracy >= 50;
                return (
                  <div
                    key={index}
                    className="bg-gray-50/80 rounded-xl border p-4 shadow-sm"
                  >
                    <h4
                      className="font-semibold text-slate-700 mb-2 truncate"
                      title={item.topicName}
                    >
                      {item.topicName}
                    </h4>
                    <div
                      className={`rounded-lg p-4 text-center ${
                        isSuccess
                          ? "bg-green-100/80 text-green-800"
                          : "bg-red-100/80 text-red-800"
                      }`}
                    >
                      <div
                        className={`text-sm ${getDifficultyStyling(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty}
                      </div>
                      <div className="text-4xl font-bold my-1">
                        {Math.round(item.accuracy)}%
                      </div>
                      <div className="text-sm text-slate-500">
                        {item.correctAnswers}/{item.totalQuestions} correct
                      </div>
                      {item.accuracy === 0 && item.totalQuestions > 0 && (
                        <div className="text-xs font-semibold text-red-600 mt-2">
                          Needs Revision
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
