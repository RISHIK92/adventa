"use client";

import { Card } from "@/components/home/testinomials-grid-with-centered-corousel";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Calendar,
  CheckCircle,
  Play,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PYQPage() {
  const router = useRouter();
  const params = useParams();
  const { examId } = params;

  const pyqData = Array.from({ length: 8 }, (_, i) => ({
    year: (2024 - i).toString(),
    attempts: Math.floor(Math.random() * 4),
    avgScore: Math.floor(Math.random() * 50) + 200,
    totalQuestions: 90,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    isLatest: i === 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
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
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {pyqData.map((yearData, index) => (
            <Card
              key={yearData.year}
              className="min-w-[300px] bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl ${
                        yearData.isLatest
                          ? "bg-gradient-to-br from-red-100 to-pink-100"
                          : "bg-slate-100"
                      }`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${
                          yearData.isLatest ? "text-red-600" : "text-slate-600"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {examId} {yearData.year}
                      </CardTitle>
                      {yearData.isLatest && (
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
                      {yearData.totalQuestions}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Attempts</div>
                    <div className="font-semibold text-slate-900">
                      {yearData.attempts}
                    </div>
                  </div>
                  {yearData.attempts > 0 && (
                    <>
                      <div>
                        <div className="text-slate-500">Best Score</div>
                        <div className="font-semibold text-green-600">
                          {yearData.avgScore}/300
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Status</div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-semibold">
                            Completed
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  {yearData.subjects.map((subject) => (
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
                  {yearData.attempts > 0 && (
                    <Button variant="outline" size="sm" className="flex-1">
                      View Results
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {yearData.attempts > 0 ? "Retry" : "Start"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
