"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { examIdMap } from "@/lib/utils";
import {
  apiService,
  PyqQuestion,
  Subject,
  Topic,
} from "@/services/weaknessApi";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

// --- Reusable Helper Components ---
const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex flex-col justify-center items-center h-full min-h-64 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
    <p className="text-gray-600">{text}</p>
  </div>
);

const RenderContent = ({ content }: { content: string }) => {
  if (typeof content !== "string") return null;
  const isImage = content.startsWith("http");
  if (isImage) {
    return (
      <img src={content} alt="Content" className="max-h-32 rounded border" />
    );
  }
  return <Latex>{content}</Latex>;
};

const QuestionCard = ({ question }: { question: PyqQuestion }) => (
  <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
    <div className="flex justify-between items-start mb-3 text-sm">
      <span className="font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {question.examSession.name}
      </span>
    </div>
    <div className="py-3 text-gray-800 font-medium">
      <Latex>{question.text}</Latex>
    </div>
    {question.imageUrl && (
      <img
        src={question.imageUrl}
        alt="Question visual"
        className="my-3 rounded-lg max-w-64 h-auto border"
      />
    )}
    <div className="mt-4 space-y-3">
      {Object.entries(question.options).map(([key, value]) => (
        <div key={key} className={`flex items-start p-3 border rounded-md `}>
          <span className="font-bold mr-4">{key}.</span>
          <div className="w-full">
            <RenderContent content={value} />
          </div>
        </div>
      ))}
    </div>
    <details className="mt-5">
      <summary className="cursor-pointer text-orange-600 hover:underline font-semibold">
        View Solution
      </summary>
      <div className="mt-2 p-4 bg-gray-50 border rounded-md text-gray-700 prose max-w-none">
        {question.correctOption && (
          <p className="font-semibold">
            Correct Option: {question.correctOption}
          </p>
        )}
        {question.imagesolurl && (
          <img
            src={question.imagesolurl}
            className="mt-4 max-w-64"
            alt="Solution visual"
          />
        )}
        {question.solution?.split("\n").map((line, index) => (
          <p key={index}>
            <Latex>{line}</Latex>
          </p>
        ))}
      </div>
    </details>
  </div>
);

// --- Main Page Component ---
export default function PyqExplorerPage() {
  const params = useParams();
  const { examId } = params;

  const [subjectsWithTopics, setSubjectsWithTopics] = useState<Subject[]>([]);
  const [openSubjectId, setOpenSubjectId] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<PyqQuestion[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Subjects and Topics on Page Load
  useEffect(() => {
    const numericExamId = examIdMap[(examId as string)?.toUpperCase()];
    if (!numericExamId) {
      setError("Invalid exam specified.");
      setIsLoadingSubjects(false);
      return;
    }

    const fetchSubjects = async () => {
      try {
        // Assume you've added `getSubjectsWithTopicsByExam` to your apiService
        const data = await apiService.getSubjectsWithTopicsByExam(
          numericExamId
        );
        setSubjectsWithTopics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [examId]);

  // 2. Fetch Questions when a Topic is Selected
  const handleTopicSelect = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsLoadingQuestions(true);
    setQuestions([]); // Clear old questions immediately
    setError(null);

    const numericExamId = examIdMap[(examId as string)?.toUpperCase()];

    try {
      // Assume you've added `getPyqsByTopicAndExam` to your apiService
      const data = await apiService.getPyqsByTopicAndExam(
        numericExamId,
        topic.id
      );
      setQuestions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // 3. Handle Accordion Toggle
  const toggleSubject = (subjectId: number) => {
    setOpenSubjectId(openSubjectId === subjectId ? null : subjectId);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          PYQ Explorer for {examId?.toString().toUpperCase()}
        </h1>
        <p className="text-gray-500">
          Select a subject and topic to view previous year questions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column: Navigation Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="font-bold text-lg mb-4">Subjects</h2>
            {isLoadingSubjects ? (
              <p>Loading subjects...</p>
            ) : (
              <div className="space-y-2">
                {subjectsWithTopics.map((subject) => (
                  <div key={subject.id}>
                    <button
                      onClick={() => toggleSubject(subject.id)}
                      className="w-full text-left font-semibold p-2 rounded hover:bg-gray-100 flex justify-between items-center"
                    >
                      {subject.name}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openSubjectId === subject.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {openSubjectId === subject.id && (
                      <ul className="pl-4 pt-2 border-l-2 border-orange-200">
                        {subject.topics.map((topic) => (
                          <li key={topic.id}>
                            <button
                              onClick={() => handleTopicSelect(topic)}
                              className={`w-full text-left p-2 text-sm rounded ${
                                selectedTopic?.id === topic.id
                                  ? "bg-orange-100 font-semibold text-orange-700"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              {topic.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Column: Question Display Area */}
        <main className="md:col-span-3">
          {isLoadingQuestions && (
            <LoadingSpinner text="Fetching questions..." />
          )}
          {error && (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
              {error}
            </div>
          )}

          {!isLoadingQuestions && !error && (
            <>
              {questions.length > 0 ? (
                <div className="space-y-6">
                  {questions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-10 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold">
                    {selectedTopic
                      ? `No PYQs found for ${selectedTopic.name}`
                      : "Select a topic to begin"}
                  </h3>
                  <p>
                    {!selectedTopic &&
                      "Choose a subject from the left panel, then select a topic to see the questions here."}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
