// src/components/TestResultsHeader.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, Download } from "lucide-react";

// Define the prop types based on the 'testResult' object structure from your API
interface TestResult {
  name: string;
  date: string;
  duration: number;
  myScore: number;
  accuracy: number;
  rank: number;
  totalParticipants: number;
}

interface TestResultsHeaderProps {
  testResult: TestResult;
}

export const TestResultsHeader = ({ testResult }: TestResultsHeaderProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {testResult.name}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date(testResult.date).toLocaleDateString()} &bull;{" "}
                {Math.round(testResult.duration / 60)} Minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {testResult.myScore}
              </div>
              <div className="text-xs text-gray-500">Your Score</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-700">
                {testResult.accuracy}%
              </div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-700">
                #{testResult.rank}
              </div>
              <div className="text-xs text-gray-500">
                of {testResult.totalParticipants}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
