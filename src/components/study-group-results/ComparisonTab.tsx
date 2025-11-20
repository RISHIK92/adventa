// src/components/ComparisonTab.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Users, ChevronDown, ChevronRight } from "lucide-react";
import { getSubjectColor, formatTime, toggleExpansion } from "@/utils/helpers";

// Define props
interface ComparisonTabProps {
  leaderboard: any[];
  currentUserId?: string;
  hierarchicalData: any;
  memberHierarchicalData: any;
  groupAverageData: any;
  memberMap: Map<string, string>;
  me: any;
  testResult: any;
  lowestScore: number;
}

export const ComparisonTab = ({
  leaderboard,
  currentUserId,
  hierarchicalData,
  memberHierarchicalData,
  groupAverageData,
  memberMap,
  me,
  testResult,
  lowestScore,
}: ComparisonTabProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("group");
  const [expandedCompareSubjects, setExpandedCompareSubjects] = useState<
    Set<string>
  >(new Set());
  // New state to manage topic expansion within the comparison tab
  const [expandedCompareTopics, setExpandedCompareTopics] = useState<
    Set<string>
  >(new Set());

  const comparisonData =
    selectedMemberId === "group"
      ? groupAverageData
      : memberHierarchicalData[selectedMemberId];
  const comparisonTargetName =
    selectedMemberId === "group"
      ? "Group Average"
      : memberMap.get(selectedMemberId) || "Member";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Hierarchical Performance
            Comparison
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium">
              Compare my results with:
            </span>
            <Select
              value={selectedMemberId}
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Group Average</SelectItem>
                {leaderboard
                  .filter((m) => m.id !== currentUserId)
                  .map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} (Rank #{member.rank})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {comparisonData && me ? (
            <div className="space-y-4">
              {Object.entries(hierarchicalData.subjects).map(
                ([subjectName, mySubjectData]: [string, any]) => {
                  // Safely access the corresponding subject data for the comparison target
                  const memberSubjectData =
                    comparisonData.subjects?.[subjectName];
                  // If the other user has no data for this subject, skip rendering it
                  if (!memberSubjectData) return null;

                  const subjectCompareKey = `compare-${subjectName}`;
                  return (
                    <Card key={subjectName} className="border overflow-hidden">
                      {/* --- SUBJECT LEVEL COMPARISON --- */}
                      <CardHeader
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          toggleExpansion(
                            subjectCompareKey,
                            setExpandedCompareSubjects
                          )
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedCompareSubjects.has(subjectCompareKey) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <h4
                              className="text-lg font-semibold"
                              style={{
                                color: getSubjectColor(subjectName),
                              }}
                            >
                              {subjectName}
                            </h4>
                          </div>
                        </div>
                        <div className="space-y-3 mt-3 pl-7">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>You: {mySubjectData.accuracy}%</span>
                                <span>
                                  Time: {formatTime(mySubjectData.time)}
                                </span>
                              </div>
                              <Progress
                                value={mySubjectData.accuracy}
                                className="h-2"
                                style={{
                                  backgroundColor: `${getSubjectColor(
                                    subjectName
                                  )}20`,
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>
                                  {comparisonTargetName}:{" "}
                                  {memberSubjectData.accuracy}%
                                </span>
                                <span>
                                  Time: {formatTime(memberSubjectData.time)}
                                </span>
                              </div>
                              <Progress
                                value={memberSubjectData.accuracy}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      {/* --- TOPIC & SUBTOPIC LEVEL COMPARISON --- */}
                      {expandedCompareSubjects.has(subjectCompareKey) && (
                        <CardContent className="pt-0 pl-12 pr-4 pb-4 space-y-3">
                          {Object.entries(mySubjectData.topics).map(
                            ([topicName, myTopicData]: [string, any]) => {
                              const memberTopicData =
                                memberSubjectData.topics?.[topicName];
                              if (!memberTopicData) return null;

                              const topicCompareKey = `${subjectCompareKey}-${topicName}`;
                              return (
                                <div key={topicCompareKey}>
                                  <div
                                    className="p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                                    onClick={() =>
                                      toggleExpansion(
                                        topicCompareKey,
                                        setExpandedCompareTopics
                                      )
                                    }
                                  >
                                    <div className="flex items-center gap-3 mb-2">
                                      {expandedCompareTopics.has(
                                        topicCompareKey
                                      ) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                      <h5 className="font-semibold text-base">
                                        {topicName}
                                      </h5>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-5">
                                      {/* Topic comparison bars */}
                                      <div>
                                        <div className="flex justify-between text-xs mb-1">
                                          <span>
                                            You: {myTopicData.accuracy}%
                                          </span>
                                          <span>
                                            {formatTime(myTopicData.time)}
                                          </span>
                                        </div>
                                        <Progress
                                          value={myTopicData.accuracy}
                                          className="h-1.5"
                                        />
                                      </div>
                                      <div>
                                        <div className="flex justify-between text-xs mb-1">
                                          <span>
                                            {comparisonTargetName}:{" "}
                                            {memberTopicData.accuracy}%
                                          </span>
                                          <span>
                                            {formatTime(memberTopicData.time)}
                                          </span>
                                        </div>
                                        <Progress
                                          value={memberTopicData.accuracy}
                                          className="h-1.5"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Subtopic details */}
                                  {expandedCompareTopics.has(
                                    topicCompareKey
                                  ) && (
                                    <div className="pl-10 pt-2 space-y-2">
                                      {Object.entries(
                                        myTopicData.subtopics
                                      ).map(
                                        ([subtopicName, mySubtopicData]: [
                                          string,
                                          any
                                        ]) => {
                                          const memberSubtopicData =
                                            memberTopicData.subtopics?.[
                                              subtopicName
                                            ];
                                          if (!memberSubtopicData) return null;
                                          return (
                                            <div
                                              key={subtopicName}
                                              className="p-3 bg-slate-50/70 rounded-md"
                                            >
                                              <p className="font-medium text-sm text-gray-700 mb-2">
                                                {subtopicName}
                                              </p>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                  <div className="flex justify-between text-xs mb-1">
                                                    <span>
                                                      You:{" "}
                                                      {mySubtopicData.accuracy}%
                                                    </span>
                                                    <span>
                                                      {formatTime(
                                                        mySubtopicData.time
                                                      )}
                                                    </span>
                                                  </div>
                                                  <Progress
                                                    value={
                                                      mySubtopicData.accuracy
                                                    }
                                                    className="h-1"
                                                  />
                                                </div>
                                                <div>
                                                  <div className="flex justify-between text-xs mb-1">
                                                    <span>
                                                      {comparisonTargetName}:{" "}
                                                      {
                                                        memberSubtopicData.accuracy
                                                      }
                                                      %
                                                    </span>
                                                    <span>
                                                      {formatTime(
                                                        memberSubtopicData.time
                                                      )}
                                                    </span>
                                                  </div>
                                                  <Progress
                                                    value={
                                                      memberSubtopicData.accuracy
                                                    }
                                                    className="h-1"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                }
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a member to start a comparison.
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- GROUP PERFORMANCE OVERVIEW CARD --- */}
      <Card>
        <CardHeader>
          <CardTitle>Group Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {testResult.groupAverage}
              </div>
              <div className="text-sm text-gray-500">Group Average</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {testResult.highestScore}
              </div>
              <div className="text-sm text-gray-500">Highest Score</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {lowestScore}
              </div>
              <div className="text-sm text-gray-500">Lowest Score</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {testResult.myScore - testResult.groupAverage > 0 ? "+" : ""}
                {Math.round(testResult.myScore - testResult.groupAverage)}
              </div>
              <div className="text-sm text-gray-500">Your Gap</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
