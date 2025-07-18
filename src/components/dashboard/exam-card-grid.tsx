"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Atom,
  Dna,
  Cpu,
  FlaskConical,
  Book,
  BrainCircuit,
  Calculator,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExamCardGridProps {
  onExamClick: (examId: string) => void;
}

const exams = [
  {
    id: "jee",
    name: "JEE Main & Advanced",
    description: "Engineering entrance for IITs, NITs, and other top colleges.",
    icon: Atom,
    subjects: ["Physics", "Chemistry", "Maths"],
    color: "bg-orange-500",
    hoverColor: "hover:border-orange-500",
  },
  {
    id: "neet",
    name: "NEET (UG)",
    description:
      "Medical entrance for MBBS, BDS, and other undergraduate medical courses.",
    icon: Dna,
    subjects: ["Physics", "Chemistry", "Biology"],
    color: "bg-green-500",
    hoverColor: "hover:border-green-500",
  },
  {
    id: "viteee",
    name: "VITEEE",
    description:
      "Engineering entrance for Vellore Institute of Technology (VIT).",
    icon: Cpu,
    subjects: ["Physics", "Chemistry", "Maths", "English"],
    color: "bg-blue-500",
    hoverColor: "hover:border-blue-500",
  },
  {
    id: "bitsat",
    name: "BITSAT",
    description:
      "Admission test for BITS Pilani, Goa, and Hyderabad campuses.",
    icon: BrainCircuit,
    subjects: ["Physics", "Chemistry", "Maths", "English", "Logic"],
    color: "bg-purple-500",
    hoverColor: "hover:border-purple-500",
  },
  {
    id: "srmjee",
    name: "SRMJEEE",
    description:
      "Joint engineering entrance examination for SRM Institute of Science.",
    icon: FlaskConical,
    subjects: ["Physics", "Chemistry", "Maths"],
    color: "bg-red-500",
    hoverColor: "hover:border-red-500",
s  },
  {
    id: "eamcet",
    name: "AP-TS EAMCET",
    description:
      "For admission into various professional courses in AP & Telangana.",
    icon: Book,
    subjects: ["Physics", "Chemistry", "Maths/Biology"],
    color: "bg-indigo-500",
    hoverColor: "hover:border-indigo-500",
  },
  {
    id: "mhcet",
    name: "MHCET",
    description: "State-level entrance exam for admission in Maharashtra.",
    icon: Calculator,
    subjects: ["Physics", "Chemistry", "Maths/Biology"],
    color: "bg-teal-500",
    hoverColor: "hover:border-teal-500",
  },
];

export function ExamCardGrid({ onExamClick }: ExamCardGridProps) {
  return (
    <div className="p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Select Your Exam</h1>
        <p className="text-muted-foreground mt-2">
          Choose an exam to access tailored study materials, mock tests, and
          more.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const Icon = exam.icon;
          return (
            <Link href={`/dashboard/${exam.id}`} key={exam.id}>
              <Card
                className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${exam.hoverColor}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-3 text-primary-foreground ${exam.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="font-headline text-xl">
                          {exam.name}
                        </CardTitle>
                        <CardDescription>{exam.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exam.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
