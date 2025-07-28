import { useState } from "react";
import { Check } from "lucide-react";

interface QuestionDisplayProps {
  questionNumber?: number;
  totalQuestions?: number;
  subject?: string;
  type?: "mcq" | "numerical";
  questionText?: string;
  options?: string[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function QuestionDisplay({
  questionNumber = 1,
  totalQuestions = 180,
  subject = "Physics",
  type = "mcq",
  questionText = "What is the relationship between the pressure and volume of a gas at constant temperature according to Boyle's Law?",
  options = [
    "Pressure is directly proportional to volume (P ∝ V)",
    "Pressure is inversely proportional to volume (P ∝ 1/V)",
    "Pressure has no relationship with volume at constant temperature",
    "Pressure is equal to volume in all cases (P = V)",
  ],
  value = "",
  onValueChange = (val) => console.log("Value changed:", val),
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 pb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${getSubjectColor(
            subject
          )}`}
        >
          {subject}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-md md:text-lg font-semibold text-gray-900 leading-relaxed">
          {questionText}
        </h2>
      </div>

      {/* MCQ Options */}
      {type === "mcq" && (
        <div className="space-y-3">
          {options?.map((option, index) => {
            const letters = ["A", "B", "C", "D"];
            const letter = letters[index];
            const isSelected = selectedValue === option;

            return (
              <div
                key={index}
                className={`
                  group relative flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200
                  ${isSelected ? "bg-green-50 shadow-sm" : "hover:bg-gray-50"}
                `}
                onClick={() => handleValueChange(option)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0
                    ${
                      isSelected
                        ? "text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }
                  `}
                    style={isSelected ? { backgroundColor: "#12b981" } : {}}
                  >
                    {letter}
                  </div>

                  <span
                    className={`
                    text-base leading-relaxed transition-colors duration-200
                    ${
                      isSelected ? "text-gray-900 font-medium" : "text-gray-700"
                    }
                  `}
                  >
                    {option}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Numerical Input */}
      {type === "numerical" && (
        <div className="space-y-4">
          <label className="block text-base font-medium text-gray-700 mb-3">
            Enter your answer below
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Type your answer here..."
              value={selectedValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full px-4 py-4 text-lg rounded-xl focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              style={{
                focusRingColor: "#12b981",
                boxShadow: selectedValue
                  ? `0 0 0 4px rgba(18, 185, 129, 0.1)`
                  : undefined,
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 4px rgba(18, 185, 129, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "";
              }}
            />
            {selectedValue && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Check className="w-5 h-5" style={{ color: "#12b981" }} />
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 bg-green-50 p-4 rounded-lg">
            <strong>Note:</strong> Enter numerical values only. Use decimal
            points where necessary.
          </div>
        </div>
      )}
    </div>
  );
}
