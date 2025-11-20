"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface Option {
  label: string;
  value: string;
}

interface QuestionDisplayProps {
  questionNumber?: number;
  totalQuestions?: number;
  subject: string;
  type?: "mcq" | "numerical";
  questionText?: string;
  options?: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  isMobile?: boolean;
  imageUrl?: string | null;
}

const isImageUrl = (url: string) => {
  return (
    url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null ||
    url.startsWith("https://res.cloudinary.com")
  );
};

export default function QuestionDisplay({
  questionNumber = 1,
  totalQuestions = 180,
  subject,
  type,
  questionText,
  imageUrl,
  options,
  value,
  onValueChange = (val) => console.log("Value changed:", val),
  isMobile = false,
}: QuestionDisplayProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      Physics: "bg-[#12b981]",
      Chemistry: "bg-[#f59e0c]",
      Mathematics: "bg-[#ff6b35]",
      Biology: "bg-[#3a7eee]",
    };
    return colors[subject as keyof typeof colors] || "bg-slate-600";
  };

  const containerPadding = isMobile ? "p-4 md:p-6" : "p-8 md:p-10";
  const textSize = isMobile ? "text-sm md:text-base" : "text-md md:text-lg";
  const optionPadding = isMobile ? "p-3 md:p-4" : "p-5";

  const renderOptionContent = (optionValue: string) => {
    if (optionValue.startsWith("http")) {
      return (
        <img
          src={optionValue}
          alt={`Option image`}
          className="max-w-xs h-auto rounded-md object-contain"
        />
      );
    }
    return <Latex>{optionValue}</Latex>;
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm ${containerPadding} max-w-4xl mx-auto`}
    >
      <div className="flex items-center justify-between mb-3 pb-4 md:pb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-sm font-medium text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
        <div
          className={`px-2 md:px-4 py-1 md:py-2 rounded-sm text-white text-xs md:text-sm font-semibold ${getSubjectColor(
            subject
          )}`}
        >
          {subject}
        </div>
      </div>

      <div className="mb-6 md:mb-8">
        <div className="text-md md:text-lg font-semibold text-gray-900 leading-relaxed">
          {questionText && <Latex>{questionText}</Latex>}
        </div>
        {imageUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-center">
            <img
              src={imageUrl}
              alt="Question illustration"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        )}
      </div>

      {/* MCQ Options */}
      {type === "mcq" && (
        <div className="space-y-2 md:space-y-3">
          {options?.map((option) => {
            const isSelected = value === option.label;
            return (
              <div
                key={option.label}
                className={`
                  group relative flex items-start gap-3 md:gap-4 ${optionPadding} rounded-xl cursor-pointer transition-all duration-200 border
                  ${
                    isSelected
                      ? "bg-green-50 shadow-sm border-gray-300"
                      : "hover:bg-gray-50 border-gray-200"
                  }
                `}
                onClick={() => handleValueChange(option.label)}
              >
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div
                    className={`
                      w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs md:text-sm font-semibold flex-shrink-0
                      ${
                        isSelected
                          ? "text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }
                    `}
                    style={isSelected ? { backgroundColor: "#12b981" } : {}}
                  >
                    {option.label}
                  </div>
                  <span
                    className={`
                      text-sm md:text-base leading-relaxed transition-colors duration-200
                      ${
                        isSelected
                          ? "text-gray-900 font-medium"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {renderOptionContent(option.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Numerical Input */}
      {type === "numerical" && (
        <div className="space-y-3 md:space-y-4">
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2 md:mb-3">
            Enter your answer below
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type your answer here..."
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full px-3 md:px-4 py-3 md:py-4 text-base md:text-lg rounded-xl focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white border border-gray-200"
              style={{
                boxShadow: value
                  ? `0 0 0 3px rgba(18, 185, 129, 0.1)`
                  : undefined,
              }}
            />
            {value && (
              <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                <Check
                  className="w-4 h-4 md:w-5 md:h-5"
                  style={{ color: "#12b981" }}
                />
              </div>
            )}
          </div>
          <div className="text-xs md:text-sm text-gray-500 bg-green-50 p-3 md:p-4 rounded-lg">
            <strong>Note:</strong> Enter numerical values only. Use decimal
            points where necessary.
          </div>
        </div>
      )}
    </div>
  );
}
