
"use client";

import { ExamCardGrid } from "@/components/dashboard/exam-card-grid";
import { useRouter } from "next/navigation";

export default function StudyDashboard() {
  const router = useRouter();

  const handleExamSelect = (examId: string) => {
    router.push(`/dashboard/${examId}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1">
        <ExamCardGrid onExamClick={handleExamSelect} />
      </div>
    </div>
  );
}
