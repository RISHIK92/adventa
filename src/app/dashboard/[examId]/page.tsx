"use client";

import { useParams, useRouter } from "next/navigation";
import ExamDashboard from "@/components/dashboard/exam-dashboard";
import { notFound } from "next/navigation";
import ImmersiveExamDashboard from "@/components/dashboard/exam-dashboard";

interface ExamDetails {
  id: string;
  name: string;
}

const examNames: Record<string, string> = {
  jee: "JEE Main 2024",
  neet: "NEET 2024",
  viteee: "VITEEE 2024",
  bitsat: "BITSAT 2024",
  srmjee: "SRMJEE 2024",
  eamcet: "AP-TS EAMCET 2024",
  mhcet: "MHCET 2024",
};

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  if (!examNames[examId]) {
    return notFound();
  }

  const examDetails: ExamDetails = {
    id: examId,
    name: examNames[examId],
  };

  const handleNavigate = (section: string) => {
    // Navigate to actual pages now
    if (section === "mock-test") {
      router.push("/test");
    } else if (section === "quiz") {
      router.push("/quiz");
    } else {
      // Handle other sections if needed, e.g., study material
      router.push(`/dashboard/${examId}/${section}`);
    }
  };

  const handleBackClick = () => {
    router.push("/dashboard");
  };

  return (
    <ImmersiveExamDashboard
      exam={examDetails}
      examName={examId}
      onNavigate={handleNavigate}
      onBackClick={handleBackClick}
    />
  );
}
