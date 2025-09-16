import React, { useMemo } from "react";

interface FilterPanelProps {
  isVisible: boolean;
  allSubjects: string[];
  availableTopics: string[];
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
  sortBy: "newest" | "oldest";
  setSortBy: (sort: "newest" | "oldest") => void;
  onClear: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isVisible,
  allSubjects,
  availableTopics,
  selectedSubjects,
  setSelectedSubjects,
  selectedTopics,
  setSelectedTopics,
  sortBy,
  setSortBy,
  onClear,
}) => {
  if (!isVisible) return null;

  const handleSubjectChange = (subject: string) => {
    const newSelection = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];
    setSelectedSubjects(newSelection);
  };

  const handleTopicChange = (topic: string) => {
    const newSelection = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newSelection);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subjects Filter */}
        <div>
          <h3 className="font-semibold mb-2">Filter by Subject</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {allSubjects.map((subject) => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                  className="rounded"
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Topics Filter */}
        <div>
          <h3 className="font-semibold mb-2">Filter by Topic</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {availableTopics.map((topic) => (
              <label key={topic} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleTopicChange(topic)}
                  className="rounded"
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sorting */}
        <div>
          <h3 className="font-semibold mb-2">Sort By</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sort"
                value="newest"
                checked={sortBy === "newest"}
                onChange={() => setSortBy("newest")}
              />
              <span>Newest First</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sort"
                value="oldest"
                checked={sortBy === "oldest"}
                onChange={() => setSortBy("oldest")}
              />
              <span>Oldest First</span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t pt-4 flex justify-end">
        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export { FilterPanel };
