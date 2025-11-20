"use client";

import { BarChart3 } from "lucide-react";

interface DifficultyTopicData {
  topicName: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Elite";
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
}

export function DifficultyAnalysis({ data }: { data: DifficultyTopicData[] }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-800">
          Difficulty-Specific Performance
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => {
          const isSuccess = item.accuracy >= 50;
          return (
            <div
              key={index}
              className="bg-white/80 rounded-xl border border-white/30 shadow-lg p-4"
            >
              <h3 className="font-semibold text-slate-700 mb-2">
                {item.topicName}
              </h3>
              <div
                className={`rounded-lg p-4 text-center ${
                  isSuccess
                    ? "bg-green-100/80 text-green-800"
                    : "bg-red-100/80 text-red-800"
                }`}
              >
                <div className="text-sm font-medium text-slate-600">
                  {item.difficulty}
                </div>
                <div className="text-4xl font-bold my-1">
                  {item.accuracy.toFixed(2)}%
                </div>
                <div className="text-sm text-slate-500">
                  {item.correctAnswers}/{item.totalQuestions} correct
                </div>
                {!isSuccess && item.accuracy === 0 && (
                  <div className="text-xs font-semibold text-red-600 mt-2">
                    Master fundamentals first
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
