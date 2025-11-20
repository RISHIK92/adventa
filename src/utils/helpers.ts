// src/utils/helpers.ts

// Define subject colors for consistent styling
const subjectColors: { [key: string]: string } = {
  Physics: "#fe7244",
  Chemistry: "#2dd4bf",
  Mathematics: "#8b5cf6",
  Biology: "#10b981",
  Default: "#6b7280",
};

export const getSubjectColor = (subject: string) =>
  subjectColors[subject] || subjectColors.Default;

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-600 bg-green-100 border-green-200";
    case "Medium":
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    case "Hard":
      return "text-red-600 bg-red-100 border-red-200";
    default:
      return "text-gray-600 bg-gray-100 border-gray-200";
  }
};

export const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return "text-green-600";
  if (accuracy >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return minutes > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

// Generic handler to toggle membership in a Set (used for collapsible sections)
export const toggleExpansion = (
  key: string,
  setExpanded: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  setExpanded((prev) => {
    const newSet = new Set(prev);
    newSet.has(key) ? newSet.delete(key) : newSet.add(key);
    return newSet;
  });
};
