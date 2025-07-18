"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQs = [
  {
    question: "How does the AI generate personalized quizzes?",
    answer:
      "Our AI analyzes your performance history, identifies weak areas, and creates customized quizzes targeting specific topics. It adapts question difficulty based on your progress and learning patterns to maximize your preparation efficiency.",
  },
  {
    question: "Are the mock tests similar to actual JEE/NEET exams?",
    answer:
      "Yes, our mock tests are designed to mirror the exact pattern, difficulty level, and marking scheme of actual JEE Main, JEE Advanced, and NEET exams. They include the same question types, time limits, and negative marking system.",
  },
  {
    question: "How does performance analysis help improve scores?",
    answer:
      "Our detailed performance analysis identifies your strengths and weaknesses across subjects and topics. It provides personalized recommendations, shows time management patterns, and suggests study strategies to optimize your preparation.",
  },
  {
    question: "Can I access previous year questions with solutions?",
    answer:
      "Yes, we provide comprehensive collections of previous year questions from JEE Main, JEE Advanced, and NEET with detailed step-by-step solutions. Questions are organized by year, subject, and topic for easy access.",
  },
  {
    question: "How does the dynamic timetable work?",
    answer:
      "The dynamic timetable automatically adjusts based on your progress, upcoming exams, and weak areas. It creates a personalized study schedule that balances all subjects while prioritizing topics that need more attention.",
  },
  {
    question: "What subjects are covered?",
    answer:
      "For JEE: Physics, Chemistry, and Mathematics. For NEET: Physics, Chemistry, and Biology (Botany & Zoology). All subjects include comprehensive topic coverage aligned with the latest syllabus.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, our mobile app is available for both iOS and Android devices. It offers full functionality including offline quiz access, progress tracking, and synchronized study materials across all your devices.",
  },
  {
    question: "What's included in the free trial?",
    answer:
      "Our free trial includes access to sample quizzes, basic performance analytics, limited mock tests, and study materials for all subjects. You can explore core features for 7 days before choosing a premium plan.",
  },
  {
    question: "How can I track my progress?",
    answer:
      "Our comprehensive dashboard shows your performance trends, subject-wise progress, accuracy rates, time management statistics, and comparative rankings. You can monitor improvement over time with detailed analytics.",
  },
  {
    question: "Do you provide study materials for both JEE and NEET?",
    answer:
      "Yes, we provide specialized study materials for both JEE and NEET preparation. This includes concept notes, formula sheets, practice questions, video explanations, and revision materials tailored to each exam's requirements.",
  },
];

export function FrequentlyAskedQuestionsAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-20 md:grid-cols-2 md:px-8 md:py-40">
      <h2 className="text-center text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-left md:text-6xl">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-[var(--border)]">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <div
      className="cursor-pointer py-6"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start">
        <div className="relative mr-4 mt-1 h-6 w-6 flex-shrink-0">
          <Plus
            className={cn(
              "absolute inset-0 h-6 w-6 transform text-[#ff6b35] transition-all duration-200",
              isOpen && "rotate-90 scale-0"
            )}
          />
          <Minus
            className={cn(
              "absolute inset-0 h-6 w-6 rotate-90 scale-0 transform text-[#ff6b35] transition-all duration-200",
              isOpen && "rotate-0 scale-100"
            )}
          />
        </div>
        <div className="flex-1">
          <h3
            className={cn(
              "text-lg font-semibold transition-colors duration-200",
              isOpen ? "text-[#ff6b35]" : "text-[var(--foreground)]"
            )}
          >
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
