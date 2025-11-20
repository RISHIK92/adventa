// src/components/PerformanceTab.tsx

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Timer, ChevronDown, ChevronRight } from "lucide-react";
import {
  getSubjectColor,
  getAccuracyColor,
  formatTime,
  toggleExpansion,
} from "@/utils/helpers";
import { DifficultyAnalysis } from "./DifficultyAnalysis"; // Import the difficulty component

// Define prop types
interface PerformanceTabProps {
  hierarchicalData: any;
  groupAverageData: any;
  testResult: any;
}

export const PerformanceTab = ({
  hierarchicalData,
  groupAverageData,
  testResult,
}: PerformanceTabProps) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set()
  );
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Memoized transformation of hierarchical data, grouped by subject for the DifficultyAnalysis component
  const groupedDifficultyData = useMemo(() => {
    const groupedData: { [key: string]: any[] } = {};
    if (!hierarchicalData?.subjects) {
      return {};
    }

    // Step 1: Group all attempted weak areas (accuracy < 100%) by subject
    for (const [subjectName, subject] of Object.entries(
      hierarchicalData.subjects as any
    )) {
      if (!subject.topics) continue;
      for (const topic of Object.values(subject.topics as any)) {
        if (!topic.subtopics) continue;
        for (const [subtopicName, subtopicData] of Object.entries(
          topic.subtopics as any
        )) {
          if (!subtopicData.difficulties) continue;
          for (const [difficulty, diffData] of Object.entries(
            subtopicData.difficulties as any
          )) {
            if (diffData.attempted) {
              if (!groupedData[subjectName]) {
                groupedData[subjectName] = [];
              }
              groupedData[subjectName].push({
                topicName: subtopicName,
                difficulty: difficulty,
                accuracy: diffData.accuracy,
                totalQuestions: diffData.totalQuestions,
                correctAnswers: diffData.correct,
              });
            }
          }
        }
      }
    }

    // Step 2: For each subject, sort by lowest accuracy and take the top few
    for (const subjectName in groupedData) {
      groupedData[subjectName].sort((a, b) => a.accuracy - b.accuracy);
      // Show up to 3 weakest areas per subject to keep the UI focused
      groupedData[subjectName] = groupedData[subjectName].slice(0, 3);
    }

    return groupedData;
  }, [hierarchicalData]);

  return (
    <div className="space-y-6">
      {/* --- CARD 1: HIERARCHICAL PERFORMANCE ANALYSIS --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Hierarchical
            Performance Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Drill down from Subject → Topic → Subtopic to pinpoint weaknesses.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(hierarchicalData.subjects).map(
            ([subjectName, subjectData]: [string, any]) => (
              <div key={subjectName}>
                {/* --- SUBJECT LEVEL --- */}
                <div
                  className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    toggleExpansion(subjectName, setExpandedSubjects)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedSubjects.has(subjectName) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: getSubjectColor(subjectName) }}
                      >
                        {subjectName}
                      </h3>
                      <Badge
                        variant="outline"
                        className={getAccuracyColor(subjectData.accuracy)}
                      >
                        {subjectData.accuracy}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>Time/Q: {formatTime(subjectData.avgTimeSec)}</span>
                      <span>
                        Group Avg:{" "}
                        {groupAverageData.subjects[subjectName]?.accuracy ?? 0}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={subjectData.accuracy}
                    className="h-1.5 mt-2"
                    style={{
                      backgroundColor: `${getSubjectColor(subjectName)}20`,
                    }}
                  />
                </div>
                {/* --- TOPIC LEVEL --- */}
                {expandedSubjects.has(subjectName) && (
                  <div className="pl-8 pt-2 space-y-2">
                    {Object.entries(subjectData.topics).map(
                      ([topicName, topicData]: [string, any]) => {
                        const topicKey = `${subjectName}-${topicName}`;
                        return (
                          <div key={topicKey}>
                            <div
                              className="p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                              onClick={() =>
                                toggleExpansion(topicKey, setExpandedTopics)
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {expandedTopics.has(topicKey) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                  <h4 className="font-semibold">{topicName}</h4>
                                  <Badge
                                    variant="outline"
                                    size="sm"
                                    className={getAccuracyColor(
                                      topicData.accuracy
                                    )}
                                  >
                                    {topicData.accuracy}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>
                                    Time/Q: {formatTime(topicData.avgTimeSec)}
                                  </span>
                                  <span>
                                    Group Avg:{" "}
                                    {groupAverageData.subjects[subjectName]
                                      ?.topics[topicName]?.accuracy ?? 0}
                                    %
                                  </span>
                                </div>
                              </div>
                              <Progress
                                value={topicData.accuracy}
                                className="h-1.5 mt-2"
                              />
                            </div>
                            {/* --- SUBTOPIC LEVEL --- */}
                            {expandedTopics.has(topicKey) && (
                              <div className="pl-8 pt-2 space-y-2">
                                {Object.entries(topicData.subtopics).map(
                                  ([subtopicName, subtopicData]: [
                                    string,
                                    any
                                  ]) => (
                                    <div
                                      key={`${topicKey}-${subtopicName}`}
                                      className="p-3 rounded-lg bg-slate-50/50"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <h5 className="font-medium text-sm text-gray-800">
                                            {subtopicName}
                                          </h5>
                                          <Badge
                                            variant="outline"
                                            size="sm"
                                            className={getAccuracyColor(
                                              subtopicData.accuracy
                                            )}
                                          >
                                            {subtopicData.accuracy}%
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                          <span>
                                            Time/Q:{" "}
                                            {formatTime(
                                              subtopicData.avgTimeSec
                                            )}
                                          </span>
                                          <span>
                                            Group Avg:{" "}
                                            {groupAverageData.subjects[
                                              subjectName
                                            ]?.topics[topicName]?.subtopics[
                                              subtopicName
                                            ]?.accuracy ?? 0}
                                            %
                                          </span>
                                        </div>
                                      </div>
                                      <Progress
                                        value={subtopicData.accuracy}
                                        className="h-1 mt-2"
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* --- CARD 2: DIFFICULTY-SPECIFIC PERFORMANCE ANALYSIS --- */}
      <DifficultyAnalysis data={groupedDifficultyData} />

      {/* --- CARD 3: TIME ANALYSIS SUMMARY --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" /> Time Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(testResult.timeTaken)}
              </div>
              <div className="text-sm text-gray-500">Total Time</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(testResult.timeTaken / testResult.totalQuestions)}
              </div>
              <div className="text-sm text-gray-500">Avg per Question</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatTime(testResult.duration - testResult.timeTaken)}
              </div>
              <div className="text-sm text-gray-500">Time Saved</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {Math.round(
                  Math.max(
                    0,
                    100 - (testResult.timeTaken / testResult.duration) * 100
                  )
                )}
                %
              </div>
              <div className="text-sm text-gray-500">Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
