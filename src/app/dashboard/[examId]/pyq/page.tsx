"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Calendar,
  CheckCircle,
  Play,
  ChevronRight,
  Loader2,
  AlertCircle,
  CircleAlert,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService, AvailablePyqData } from "@/services/weaknessApi";
import { examIdMap } from "@/lib/utils";

interface PyqCardData {
  examSessionId: number;
  year: number;
  name: string;
  date: string;
  userAttempts: number;
  totalAttempts: number;
  subjects: string[];
  isLatest: boolean;
  bestScore: number | null | "loading";
  totalQuestions?: number;
}

export default function PYQPage() {
  const router = useRouter();
  const params = useParams();

  const [pyqCards, setPyqCards] = useState<PyqCardData[]>([]);
  const { examId: examSlug } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingTestId, setGeneratingTestId] = useState<number | null>(null);
  const [viewingResultsId, setViewingResultsId] = useState<number | null>(null);

  useEffect(() => {
    const loadPyqData = async () => {
      const numericExamId = examIdMap[examSlug as string];
      if (!numericExamId) {
        setError("Invalid exam specified in URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.getAvailablePyqs(numericExamId);

        if (data && data.length > 0) {
          const latestYear = data[0].year;
          const flattenedData: PyqCardData[] = data.flatMap((yearData) =>
            yearData.shifts.map((shift) => ({
              ...shift,
              year: yearData.year,
              isLatest: yearData.year === latestYear,
              totalQuestions: 90,
              bestScore: shift.userAttempts > 0 ? "loading" : null,
            }))
          );
          setPyqCards(flattenedData);

          flattenedData.forEach(async (card) => {
            if (card.bestScore === "loading") {
              try {
                const { bestScore } = await apiService.getPyqBestScore(
                  card.examSessionId
                );
                setPyqCards((prevCards: any) =>
                  prevCards.map((p: any) =>
                    p.examSessionId === card.examSessionId
                      ? { ...p, bestScore }
                      : p
                  )
                );
              } catch (e) {
                console.error(`Failed to fetch score for ${card.name}`, e);
                setPyqCards((prevCards) =>
                  prevCards.map((p) =>
                    p.examSessionId === card.examSessionId
                      ? { ...p, bestScore: null }
                      : p
                  )
                );
              }
            }
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load PYQ data."
        );
      } finally {
        setLoading(false);
      }
    };
    loadPyqData();
  }, [examSlug]);

  const handleStartTest = async (examSessionId: number) => {
    setGeneratingTestId(examSessionId);
    try {
      const { testInstanceId } = await apiService.generatePyqTest(
        examSessionId
      );
      // Route to your generic mock test page
      router.push(`/mock-test/${testInstanceId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start the test.");
      setGeneratingTestId(null);
    }
  };

  const handleViewResults = async (examSessionId: number) => {
    setViewingResultsId(examSessionId);
    try {
      // 1. Call the new API endpoint to get the ID
      const { testInstanceId } = await apiService.getLatestPyqResultId(
        examSessionId
      );

      // 2. Navigate to the generic test result page with that ID
      router.push(`/pyq-results/${testInstanceId}`);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Could not find the result for this test."
      );
    } finally {
      setViewingResultsId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {/* Skeleton Loader */}
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="min-w-[300px] bg-white/70 flex-shrink-0 animate-pulse"
            >
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700">
            Error Loading Data
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    return (
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {pyqCards.map((cardData: any) => (
          <Card
            key={cardData.examSessionId}
            className="min-w-[300px] bg-white/70 backdrop-blur-xl border-0 p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-3 rounded-xl ${
                      cardData.isLatest
                        ? "bg-gradient-to-br from-red-100 to-pink-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <Calendar
                      className={`w-6 h-6 ${
                        cardData.isLatest ? "text-red-600" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {cardData.name}
                    </CardTitle>
                    {cardData.isLatest && (
                      <Badge className="mt-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                        Latest
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Questions</div>
                  <div className="font-semibold text-slate-900">
                    {cardData.totalQuestions}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Your Attempts</div>
                  <div className="font-semibold text-slate-900">
                    {cardData.userAttempts}
                  </div>
                </div>
                {cardData.userAttempts > 0 && (
                  <>
                    <div>
                      <div className="text-slate-500">Best Score</div>
                      <div className="font-semibold text-green-600">
                        {cardData.bestScore}/300
                      </div>
                    </div>
                    {cardData.bestScore ? (
                      <div>
                        <div className="text-slate-500">Status</div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-semibold">
                            Completed
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-slate-500">Status</div>
                        <div className="flex items-center gap-1">
                          <CircleAlert className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-semibold">
                            Incomplete
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="space-y-2">
                {cardData.subjects.map((subject: any) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="mr-2 text-xs"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                {cardData.userAttempts > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewResults(cardData.examSessionId)}
                    disabled={viewingResultsId === cardData.examSessionId}
                  >
                    {viewingResultsId === cardData.examSessionId ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : null}
                    View Results
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleStartTest(cardData.examSessionId)}
                  disabled={generatingTestId === cardData.examSessionId}
                >
                  {generatingTestId === cardData.examSessionId ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-1" />
                  )}
                  {generatingTestId === cardData.examSessionId
                    ? "Generating..."
                    : cardData.userAttempts > 0
                    ? "Retry"
                    : "Start"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Previous Year Questions
                </h1>
                <p className="text-slate-600">
                  Practice with authentic exam papers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {renderContent()}

        {/* Navigation hint */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-full">
            <ChevronLeft className="w-4 h-4" />
            <span>Scroll horizontally to view all years</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
