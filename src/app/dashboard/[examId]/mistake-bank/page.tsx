"use client"; // This directive is crucial for using hooks like useState, useEffect, etc.

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { examIdMap } from "@/lib/utils";
import { apiService, FormattedMistake } from "@/services/weaknessApi";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { FilterPanel } from "@/components/practice/filterPanel";

// A simple spinner for the loading state
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const MistakeCard = ({ mistake }: { mistake: FormattedMistake }) => {
  const { question, context, test, answeredOn } = mistake;
  const yourAnswerText =
    question.options[question.yourAnswer || ""] || question.yourAnswer;
  const correctAnswerText = question.options[question.correctOption];

  const isImageUrl = (url: string): boolean => {
    if (typeof url !== "string") return false;
    return url.startsWith("http");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3 text-sm">
        <span className="font-semibold text-gray-700">
          {context.subject} &gt; {context.topic} &gt; {context.subtopic}
        </span>
        <span className="text-gray-500 text-right">
          From: "{test.name}"<br />
          {answeredOn && `On: ${new Date(answeredOn).toLocaleDateString()}`}
        </span>
      </div>

      {/* Question Text with LaTeX */}
      <div className="py-3 text-gray-800 font-medium text-lg">
        <Latex>{question.text}</Latex>
      </div>

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question visual"
          className="my-3 rounded-lg max-w-64 h-auto border"
        />
      )}

      {/* Display All Options */}
      <div className="mt-4 space-y-3">
        {Object.entries(question.options).map(([key, value]) => {
          const isCorrect = key === question.correctOption;
          const isYourAnswer = key === question.yourAnswer;

          let optionStyle = "border-gray-300";
          if (isCorrect) {
            optionStyle = "border-green-500 bg-green-50";
          } else if (isYourAnswer) {
            optionStyle = "border-red-500 bg-red-50";
          }

          return (
            <div
              key={key}
              className={`flex items-start p-3 border rounded-md ${optionStyle}`}
            >
              <span className="font-bold mr-3">{key}.</span>
              <div className="w-full">
                {isImageUrl(value) ? (
                  <img
                    src={value}
                    alt={`Option ${key}`}
                    className="max-h-32 rounded border border-gray-200"
                  />
                ) : (
                  <Latex>{value}</Latex>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Solution Section */}
      <details className="mt-5">
        <summary className="cursor-pointer text-orange-600 hover:underline font-semibold">
          View Detailed Solution
        </summary>
        <div className="mt-2 p-4 bg-gray-50 border rounded-md text-gray-700 prose max-w-none">
          <>
            {question.solution?.split("\n").map((line, index) => (
              <p key={index}>
                <Latex>{line}</Latex>
              </p>
            ))}
            {question.imagesolurl && (
              <img src={question.imagesolurl} className="max-w-64" />
            )}
          </>
        </div>
      </details>
    </div>
  );
};

export default function MistakeReviewPage() {
  const params = useParams();
  const { examId } = params;

  const [allMistakes, setAllMistakes] = useState<FormattedMistake[]>([]);
  const [filteredMistakes, setFilteredMistakes] = useState<FormattedMistake[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // The cleanest and most maintainable version
  useEffect(() => {
    if (typeof examId !== "string" || !examId) {
      setLoading(false);
      setError("Exam not specified in the URL.");
      return;
    }

    const fetchMistakes = async () => {
      setLoading(true);
      const numericExamId = examIdMap[examId.toUpperCase() as string];

      if (!numericExamId) {
        setError("Invalid exam specified. Please check the URL.");
        setLoading(false);
        return;
      }

      try {
        // This single line handles auth, fetching, error checking, and unwrapping the 'data' property
        const mistakesArray = await apiService.getMistakesByExam(numericExamId);
        setAllMistakes(mistakesArray.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMistakes();
  }, [examId]);

  const allSubjects = useMemo(
    () => [...new Set(allMistakes.map((m) => m.context.subject))],
    [allMistakes]
  );

  const availableTopics = useMemo(() => {
    if (selectedSubjects.length === 0) {
      return [...new Set(allMistakes.map((m) => m.context.topic))];
    }
    const topicsInSelectedSubjects = allMistakes
      .filter((m) => selectedSubjects.includes(m.context.subject))
      .map((m) => m.context.topic);
    return [...new Set(topicsInSelectedSubjects)];
  }, [selectedSubjects, allMistakes]);

  useEffect(() => {
    let result = [...allMistakes];

    if (selectedSubjects.length > 0) {
      result = result.filter((mistake) =>
        selectedSubjects.includes(mistake.context.subject)
      );
    }

    if (selectedTopics.length > 0) {
      result = result.filter((mistake) =>
        selectedTopics.includes(mistake.context.topic)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.answeredOn || 0).getTime();
      const dateB = new Date(b.answeredOn || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredMistakes(result);
  }, [allMistakes, selectedSubjects, selectedTopics, sortBy]);

  // Effect to clean up selected topics if a parent subject is deselected
  useEffect(() => {
    setSelectedTopics((currentTopics) =>
      currentTopics.filter((topic) => availableTopics.includes(topic))
    );
  }, [availableTopics]);

  const handleClearFilters = () => {
    setSelectedSubjects([]);
    setSelectedTopics([]);
    setSortBy("newest");
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error)
      return (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
          {error}
        </div>
      );
    if (allMistakes.length === 0)
      return (
        <div className="text-center text-gray-600 bg-green-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold">No Mistakes Found!</h2>
          <p>Congratulations! You have a perfect record for this exam.</p>
        </div>
      );
    if (filteredMistakes.length === 0)
      return (
        <div className="text-center text-gray-500 p-6">
          <h3 className="text-lg font-semibold">
            No mistakes match your current filters.
          </h3>
          <p>Try adjusting your filter criteria or clearing them.</p>
        </div>
      );

    return (
      <div className="space-y-4">
        {filteredMistakes.map((mistake, index) => (
          <MistakeCard
            key={`${mistake.question.id}-${mistake.test.id}-${index}`}
            mistake={mistake}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Mistakes for {examId?.toString().toUpperCase()}
            </h1>
            <p className="text-gray-500">
              Review and filter your incorrect answers to improve your score.
            </p>
          </div>
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            {isFilterVisible ? "Hide Filters" : "Filter & Sort"}
          </button>
        </div>
      </header>
      <FilterPanel
        isVisible={isFilterVisible}
        allSubjects={allSubjects}
        availableTopics={availableTopics}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClear={handleClearFilters}
      />
      <main>{renderContent()}</main>
    </div>
  );
}
