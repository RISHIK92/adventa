import { useState } from "react";
import {
  ChevronDown,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Circle,
} from "lucide-react";

interface QuestionNavigationProps {
  currentQuestion?: number;
  questions?: Array<{
    id: number;
    answered: boolean;
    markedForReview: boolean;
  }>;
  onQuestionClick?: (questionId: number) => void;
  onSubjectChange?: (subject: string) => void;
  selectedSubject?: string;
}

export default function QuestionNavigation({
  currentQuestion = 1,
  questions = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    answered: Math.random() > 0.6,
    markedForReview: Math.random() > 0.8,
  })),
  onQuestionClick = (id) => console.log(`Question ${id} clicked`),
  onSubjectChange = (subject) => console.log(`Subject changed to ${subject}`),
  selectedSubject = "All Subjects",
}: QuestionNavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const subjects = [
    "All Subjects",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
  ];

  const stats = {
    answered: questions.filter((q) => q.answered).length,
    marked: questions.filter((q) => q.markedForReview).length,
    total: questions.length,
  };

  const getQuestionStatus = (question: (typeof questions)[0]) => {
    const isCurrent = question.id === currentQuestion;
    const { answered, markedForReview } = question;

    if (isCurrent) return "current";
    if (answered && markedForReview) return "answered-marked";
    if (answered) return "answered";
    if (markedForReview) return "marked";
    return "unanswered";
  };

  const statusStyles = {
    current: "text-white border-2 shadow-lg scale-110 z-10",
    answered:
      "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200",
    marked:
      "bg-amber-50 text-amber-600 border-2 border-amber-300 hover:bg-amber-100",
    "answered-marked":
      "bg-gradient-to-br from-emerald-100 to-amber-50 text-emerald-700 border-2 border-amber-300 hover:from-emerald-200 hover:to-amber-100",
    unanswered:
      "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-800",
  };

  return (
    <div className="w-full max-w-md mt-4 ml-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with Subject Selector */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <h2 className="font-semibold text-slate-800">Question Navigator</h2>
        </div>

        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg transition-colors focus:outline-none"
            style={{
              borderColor: isDropdownOpen ? "#ff6b35" : undefined,
              boxShadow: isDropdownOpen
                ? "0 0 0 2px rgba(255, 107, 53, 0.2)"
                : undefined,
            }}
            onMouseEnter={(e) => {
              if (!isDropdownOpen) {
                e.currentTarget.style.borderColor = "#ff6b35";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDropdownOpen) {
                e.currentTarget.style.borderColor = "";
              }
            }}
          >
            <span className="flex items-center gap-2 text-sm">
              {selectedSubject}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => {
                    onSubjectChange(subject);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
                >
                  {subject}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress Stats */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
          <span>
            Progress: {stats.answered}/{stats.total}
          </span>
          <span>Marked: {stats.marked}</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${(stats.answered / stats.total) * 100}%`,
              backgroundColor: "#12b981",
            }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="p-4 max-h-80 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1.5">
          {questions.map((question) => {
            const status = getQuestionStatus(question);
            const isCurrent = status === "current";
            return (
              <button
                key={question.id}
                onClick={() => onQuestionClick(question.id)}
                className={`
                  relative w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 
                  hover:scale-105 focus:outline-none
                  ${statusStyles[status]}
                `}
                style={{
                  backgroundColor: isCurrent ? "#ff6b35" : undefined,
                  borderColor: isCurrent ? "#ff6b35" : undefined,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(255, 107, 53, 0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "";
                }}
                title={`Question ${question.id}${
                  question.answered ? " (Answered)" : ""
                }${question.markedForReview ? " (Marked)" : ""}`}
              >
                {question.id}
                {question.markedForReview && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Legend */}
      <div className="bg-gray-50 border-gray-200 p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Circle className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Unanswered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span className="text-gray-600">For Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ff6b35" }}
            />
            <span className="text-gray-600">Current</span>
          </div>
        </div>
      </div>
    </div>
  );
}
