"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  History,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { type WeaknessTestHistoryItem } from "@/services/weaknessApi";

interface WeaknessTestHistoryProps {
  history: WeaknessTestHistoryItem[] | null;
  loading: boolean;
  error: string | null;
}

export const WeaknessTestHistory: React.FC<WeaknessTestHistoryProps> = ({
  history,
  loading,
  error,
}) => {
  const router = useRouter();

  const handleViewResults = (testInstanceId: string) => {
    router.push(`/test-result/${testInstanceId}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {/* Skeleton Loader */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
              <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center text-center text-red-600 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-6 h-6 mb-2" />
          <p className="font-medium">Could not load test history.</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!history || history.length === 0) {
      return (
        <div className="text-center text-gray-500 py-6">
          <p>You haven't completed any weakness tests yet.</p>
          <p className="text-sm mt-1">
            Your past tests will appear here once you complete them.
          </p>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {history.map((test) => (
          <li
            key={test.testInstanceId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <div className="p-2 bg-blue-100 text-[#12b981] rounded-full">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{test.testName}</p>
                <p className="text-sm text-gray-500">
                  Completed on{" "}
                  {new Date(test.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="text-right flex-1 sm:flex-initial">
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-bold text-lg text-gray-800">
                  {test.score}/{test.totalMarks}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewResults(test.testInstanceId)}
                className="w-full sm:w-auto !bg-[#12b981] !text-white hover:!bg-[#12b981]/90 font-semibold"
              >
                View Results <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-gray-500" />
          <CardTitle>Past Weakness Tests</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};
