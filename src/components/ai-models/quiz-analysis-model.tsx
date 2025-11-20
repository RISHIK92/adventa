"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Target, Zap, CheckCircle } from "lucide-react";

export interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  testSummary: {
    totalCorrect: number;
    totalIncorrect: number;
    totalUnattempted: number;
  };
  subjectAnalysis: {
    [subjectName: string]: {
      topics: {
        [topicName: string]: {
          accuracy: string;
        };
      };
    };
  };
  accuracyComparison: {
    topicName: string;
    change: string;
  }[];
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  isOpen,
  onClose,
  testSummary,
  subjectAnalysis,
  accuracyComparison,
}) => {
  // --- AI Analysis Logic (No changes needed here) ---
  const aiAnalysis = useMemo(() => {
    const totalAttempted =
      testSummary.totalCorrect + testSummary.totalIncorrect;
    const overallAccuracy =
      totalAttempted > 0
        ? (testSummary.totalCorrect / totalAttempted) * 100
        : 0;

    let strongestTopic = { topic: "N/A", accuracy: -1 };
    let weakestTopic = { topic: "N/A", accuracy: 101 };

    for (const subject in subjectAnalysis) {
      for (const topicName in subjectAnalysis[subject].topics) {
        const accuracy = parseFloat(
          subjectAnalysis[subject].topics[topicName].accuracy
        );
        if (accuracy > strongestTopic.accuracy) {
          strongestTopic = { topic: topicName, accuracy };
        }
        if (accuracy < weakestTopic.accuracy) {
          weakestTopic = { topic: topicName, accuracy };
        }
      }
    }

    const topicsImproved = accuracyComparison.filter(
      (t) => parseFloat(t.change) > 0
    ).length;

    const recommendations = [];
    if (overallAccuracy < 60) {
      recommendations.push(
        `Your overall accuracy is below 60%. Focus on strengthening foundational concepts, especially in ${weakestTopic.topic}.`
      );
    } else {
      recommendations.push(
        `Great work in ${strongestTopic.topic}! To improve further, dedicate some extra practice to ${weakestTopic.topic}.`
      );
    }
    if (testSummary.totalUnattempted > 3) {
      recommendations.push(
        "You skipped several questions. Try to manage your time to attempt every question, even if you're not completely sure."
      );
    }
    if (topicsImproved > 0) {
      recommendations.push(
        `You showed improvement in ${topicsImproved} topic(s). Keep up the great momentum!`
      );
    }

    return {
      overallPerformance:
        overallAccuracy >= 80
          ? "Excellent"
          : overallAccuracy >= 60
          ? "Good"
          : "Needs Improvement",
      strongestTopic,
      weakestTopic,
      recommendations,
    };
  }, [testSummary, subjectAnalysis, accuracyComparison]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            AI Performance Analysis
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Overall Performance:{" "}
              <span className="text-orange-600">
                {aiAnalysis.overallPerformance}
              </span>
            </h3>
            <p className="text-sm text-gray-600">
              This summary is based on your accuracy and topic-wise performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">
                  Strongest Topic
                </h4>
              </div>
              <p className="font-bold text-lg text-gray-900">
                {aiAnalysis.strongestTopic.topic}
              </p>
              <p className="text-sm text-gray-600">
                {aiAnalysis.strongestTopic.accuracy.toFixed(1)}% Accuracy
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Weakest Topic</h4>
              </div>
              <p className="font-bold text-lg text-gray-900">
                {aiAnalysis.weakestTopic.topic}
              </p>
              <p className="text-sm text-gray-600">
                {aiAnalysis.weakestTopic.accuracy.toFixed(1)}% Accuracy
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Actionable Recommendations
            </h3>
            <ul className="space-y-2">
              {aiAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-right">
          <Button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Got it, thanks!
          </Button>
        </div>
      </div>
    </div>
  );
};
