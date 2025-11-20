import { getAuth } from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * A reusable helper to get the current user's Firebase authentication token.
 * This should be called before every authenticated API request.
 */
const getAuthToken = async (): Promise<string> => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("User not authenticated. Please log in.");
  }
  return await auth.currentUser.getIdToken();
};

/**
 * A generic helper to process the response from the `fetch` API.
 * It handles network errors, API errors, and JSON parsing.
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "An unknown network error occurred." }));
    throw new Error(
      errorData.error || `HTTP error! Status: ${response.status}`
    );
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(
      result.error ||
        "The API indicated a failure but provided no error message."
    );
  }
  return result.data;
};

export const apiService = {
  /**
   * Fetches the dashboard data for custom quizzes (list of past tests).
   * GET /custom-quiz/dashboard/:examId
   */
  async getCustomQuizDashboard(examId: number) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/custom-quiz/dashboard/${examId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches the options (e.g., subjects) for creating a new custom quiz.
   * GET /custom-quiz/options/:examId
   */
  async getCustomQuizOptions(examId: number) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/custom-quiz/options/${examId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Generates a new custom quiz based on user-defined criteria.
   * POST /custom-quiz/generate
   */
  async generateCustomQuiz(payload: {
    examId: number;
    subjectIds: number[];
    difficultyLevels: string[];
    questionCount: number;
    timeLimitMinutes: number;
  }) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/custom-quiz/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  /**
   * Fetches the data needed to take any test (weakness or custom).
   * Corresponds to both /weakness/test/:id and /custom-quiz/test/:id
   */
  async getTestDataForTaking(testInstanceId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/custom-quiz/test/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Saves real-time progress for a question to Redis.
   * POST /weakness/progress/:testInstanceId (assuming this is shared)
   */
  async saveProgress(
    testInstanceId: string,
    questionId: number,
    userAnswer: string | null,
    timeSpentChunk: number
  ) {
    const token = await getAuthToken();
    fetch(`${API_BASE_URL}/test/progress/${testInstanceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId, userAnswer, timeSpentChunk }),
    });
  },

  /**
   * Submits a completed test from Redis data.
   * Corresponds to both /weakness/submit/:id and /custom-quiz/submit/:id
   */
  async submitTest(testInstanceId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/custom-quiz/submit/${testInstanceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches the combined data for any test results page.
   * Fetches from /weakness/results/:id and /weakness/results/:id/comparison
   */
  async getCombinedTestResults(testInstanceId: string) {
    const token = await getAuthToken();

    const [resultsResponse, comparisonResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/weakness/results/${testInstanceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/weakness/results/${testInstanceId}/comparison`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const detailedResultsData = await handleResponse(resultsResponse);
    const accuracyComparisonData = await handleResponse(comparisonResponse);

    return {
      testSummary: detailedResultsData.testSummary,
      subjectAnalysis: detailedResultsData.subjectAnalysis,
      accuracyComparison: accuracyComparisonData,
    };
  },
};
