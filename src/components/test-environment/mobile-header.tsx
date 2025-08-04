"use client";

import { Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  testName: string;
  currentQuestion: number;
  totalQuestions: number;
  onSubmitTest: () => void;
}

export default function MobileHeader({
  testName,
  currentQuestion,
  totalQuestions,
  onSubmitTest,
}: MobileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-600" />
        <div>
          <h1 className="text-sm font-semibold text-gray-900">{testName}</h1>
          <p className="text-xs text-gray-600">
            Q{currentQuestion}/{totalQuestions}
          </p>
        </div>
      </div>
      <Button
        onClick={onSubmitTest}
        size="sm"
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs"
      >
        <Send className="w-3 h-3 mr-1" />
        Submit
      </Button>
    </div>
  );
}
