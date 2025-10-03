import { getAuth } from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type TestType = "custom" | "weakness";

export interface CreateScheduledTestPayload {
  name: string;
  description?: string;
  subjectIds: number[];
  difficultyDistribution: { Easy: number; Medium: number; Hard: number };
  totalQuestions: number;
  durationInMinutes: number;
  scheduledStartTime?: string;
}

export interface QuizResultsData {
  quizName: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  timeTaken: string;
  topics: {
    name: string;
    questionsAttempted: number;
    correctAnswers: number;
    accuracy: number;
    avgTimePerQuestionSec: number;
  }[];
  questions: {
    id: number;
    questionText: string;
    topic: string;
    status: "correct" | "incorrect" | "unattempted";
    selectedAnswer?: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
    imageUrl?: string;
    timeTakenSec?: number;
  }[];
}

interface UserPerformanceRecord {
  totalAttempted: number;
  totalCorrect: number;
  accuracyPercent: string;
  avgTimePerQuestionSec: string;
}

interface QuestionResult {
  questionId: number;
  question: string;
  userAnswer: string | null;
  correctOption: string;
  options?: Record<string, string>;
  solution: string;
  isCorrect: boolean;
  timeTakenSec: number;
  humanDifficultyLevel: string;
  imageUrl?: string | null;
  imagesolurl?: string | null;
}

interface SubtopicAnalysis {
  accuracy: string;
  communityAverageAccuracy: string;
  userOverallPerformance: UserPerformanceRecord | null;
  questions: QuestionResult[];
  totalTimeTakenSec: number;
  avgTimePerQuestionSec: string;
}

interface DifficultyBreakdown {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: string;
  userOverallPerformance: UserPerformanceRecord | null;
  totalTimeTakenSec: number;
  avgTimePerQuestionSec: string;
}

interface TopicAnalysis {
  accuracy: string;
  communityAverageAccuracy: string;
  userOverallPerformance: UserPerformanceRecord | null;
  subtopics: {
    [subtopicName: string]: SubtopicAnalysis;
  };
  difficultyBreakdown: {
    [difficulty: string]: DifficultyBreakdown;
  };
  totalTimeTakenSec: number;
  avgTimePerQuestionSec: string;
}

interface SubjectAnalysis {
  accuracy: string;
  topics: {
    [topicName: string]: TopicAnalysis;
  };
  totalTimeTakenSec: number;
  avgTimePerQuestionSec: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface TestSummary {
  testInstanceId: string;
  testName: string;
  score: number;
  totalMarks: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  completedAt: string;
  userOverallAverageAccuracy: string;
  totalTimeTakenSec: number;
  avgTimePerQuestionSec: string;
}

export interface WeaknessTestHistoryItem {
  testInstanceId: string;
  testName: string;
  completedAt: string;
  score: number;
  totalMarks: number;
  timeLimitInMinutes: number;
}

interface AccuracyComparison {
  topicName: string;
  accuracyBefore: string;
  accuracyAfter: string;
  change: string;
  communityAverageAccuracy: string;
}

export interface CombinedResultsData {
  testSummary: TestSummary;
  subjectAnalysis: {
    [subjectName: string]: SubjectAnalysis;
  };
  accuracyComparison?: AccuracyComparison[];
}

export interface RestoredProgress {
  answers: Record<string, string>;
  totalTime: number;
}

export interface AvailablePyqData {
  year: number;
  shifts: {
    examSessionId: number;
    name: string;
    date: string;
    userAttempts: number;
    totalAttempts: number;
    subjects: string[];
  }[];
}

export interface PyqPercentileData {
  score: number;
  percentile: number;
}

export interface FormattedMistake {
  test: {
    id: string;
    name: string | null;
    completedAt: string | null;
  };
  question: {
    id: number;
    text: string;
    options: Record<string, string>;
    correctOption: string;
    solution: string;
    imageUrl: string | null;
    yourAnswer: string | null;
    imagesolurl: string | null;
  };
  context: {
    subject: string;
    topic: string;
    subtopic: string;
  };
  answeredOn: string | null;
}

export interface Subject {
  id: number;
  name: string;
  topics: Topic[];
}
export interface Topic {
  id: number;
  name: string;
}
export interface PyqQuestion {
  id: number;
  text: string;
  options: Record<string, string>;
  correctOption: string;
  solution: string;
  imageUrl: string | null;
  imagesolurl: string | null;
  subtopicName: string;
  examSession: {
    name: string;
    date: string | null;
  };
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  examIds?: number[];
  subjectIds?: number[];
  maxMembers?: number;
}

export interface ApiMember {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Assuming the backend might add this later
  role: "admin" | "member";
  subjects: {
    name: string;
    strength: number;
    weakness: number;
  }[];
  badges: string[];
  stats: {
    streak: number;
    averageScore: number;
    totalPoints: number;
  };
}

// Input type for public group filters
export interface PublicGroupFilters {
  search?: string;
  subjectId?: number;
  examId?: number;
  sortBy?: "score" | "memberCount" | "lastActivityAt";
  page?: number;
  limit?: number;
}

export interface ScheduledTestDetails {
  id: string;
  name: string;
  testInstanceId: string;
  durationInMinutes: number;
  totalQuestions: number;
  scheduledStartTime: string;
  subjects: string[];
  timeLimit: number;
  isParticipant: boolean;
  questions: {
    id: number;
    text: string;
    options: { id: number; text: string }[];
  }[];
}

export interface StartedTestData {
  testInstanceId: string;
  questions: {
    id: number;
    text: string;
    options: { id: number; text: string }[];
  }[];
  durationInMinutes: number;
  startedAt: string;
}

export interface SubmitAnswersPayload {
  answers: Record<string, number>;
}

export interface TestSubmissionResult {
  testInstanceId: string;
  score: number;
  totalMarks: number;
}

export interface StartGroupTestResponse {
  testInstanceId: string;
}

export interface TestResult {
  id: string;
  name: string;
  date: string;
  duration: number;
  totalQuestions: number;
  myScore: number;
  groupAverage: number;
  highestScore: number;
  accuracy: number;
  timeTaken: number;
  rank: number;
  percentile: number;
  totalParticipants: number;
}

export interface GroupMember {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  timeTaken: number;
  rank: number;
  badges: string[];
}

export interface QuestionReview {
  id: number;
  text: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  myAnswer?: string;
  timeTaken: number;
  groupStats: {
    optionDistribution: Record<string, number>;
    averageTime: number;
    accuracy: number;
  };
  memberAnswers: { [memberId: string]: string };
}

export interface DifficultyPerformance {
  accuracy: number;
  avgTimeSec: number;
}

export interface SubtopicPerformance {
  accuracy: number;
  avgTimeSec: number;
  difficulties: {
    Easy?: DifficultyPerformance;
    Medium?: DifficultyPerformance;
    Hard?: DifficultyPerformance;
  };
}

export interface TopicPerformance {
  accuracy: number;
  avgTimeSec: number;
  subtopics: Record<string, SubtopicPerformance>;
}

export interface SubjectPerformance {
  accuracy: number;
  avgTimeSec: number;
  topics: Record<string, TopicPerformance>;
}

export interface HierarchicalData {
  subjects: Record<string, SubjectPerformance>;
}

export interface GroupTestResultsData {
  testResult: TestResult;
  leaderboard: GroupMember[];
  hierarchicalData: HierarchicalData;
  memberHierarchicalData: Record<string, HierarchicalData>;
  groupAverageData: HierarchicalData;
  questionReview: QuestionReview[];
  aiInsights: any[];
}

export interface TopicOption {
  id: number;
  name: string;
}

export interface SubjectWithOptions {
  id: number;
  name: string;
  topics: TopicOption[];
}

export interface Challenge {
  id: string;
  title: string;
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number;
  creator: string;
  participantCount: number;
  status: "ACTIVE" | "ENDED";
  deadline: string;
  userStatus: "NOT_ACCEPTED" | "ACCEPTED" | "COMPLETED";
  userTestInstanceId: string | null;
  userPrediction: {
    score: number;
    confidence: number;
  } | null;
  totalQuestions: number;
}

export interface CreateChallengePayload {
  title: string;
  challengeType: "topic" | "subject";
  typeId: number;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number;
  questionCount: 3 | 6 | 9 | 12 | 15;
}

export interface StartChallengeResponse {
  testInstanceId: string;
}

export interface ChallengeTestDetails {
  testInstanceId: string;
  name: string;
  timeLimit: number; // in seconds
  challengeId: string;
  questions: {
    id: number;
    questionNumber: number;
    subject: string;
    type: "mcq" | "numerical";
    text: string;
    options: { label: string; value: string }[];
    imageUrl?: string;
  }[];
}

export interface LeaderboardMember extends ApiMember {
  score: number;
  correctness: number;
}

export interface SubmitPredictionPayload {
  predictedScore: number;
  confidence: number;
}

export interface ChallengeSubmissionResult {
  score: number;
  totalTimeTaken: number;
  numCorrect: number;
  numIncorrect: number;
  numUnattempted: number;
}

export interface ChallengeDetails {
  id: string;
  title: string;
  totalQuestions: number;
}

export interface LeaderboardMember {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number; // This is a percentage score (0-100)
  timeCompleted: number; // in minutes
  accuracy: number; // percentage
  badges: string[];
}

export interface PredictionAnalysis {
  id: string;
  name: string;
  avatar: string;
  predicted: number | null; // The number of questions they predicted correct
  actual: number; // The actual number they got correct
  predictionAccuracy: number; // A calculated score of how good their prediction was
}

export interface QuestionReviewItem {
  id: number;
  questionText: string;
  subject: string;
  topic: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  myAnswer: string | null;
  isCorrect: boolean;
  memberAnswers: Record<string, string | null>;
  optionDistribution: Record<string, number>;
}

export interface ChallengeResultsData {
  challengeDetails: ChallengeDetails;
  leaderboard: LeaderboardMember[];
  predictionAnalysis: PredictionAnalysis[];
  questionReview: QuestionReviewItem[];
}
export interface DiscussionUser {
  id: string;
  name: string;
  avatar?: string; // Keep avatar optional
  reputation: number;
  badges: string[];
}

// Type for the list of threads
export interface ThreadSummary {
  id: string;
  title: string;
  content: string;
  author: DiscussionUser;
  timestamp: string;
  upvotes: number;
  isUpvoted: boolean;
  status: "open" | "resolved";
  repliesCount: number;
  questionId?: number;
  tags: string[];
}

// Type for a single, detailed thread with all replies
export interface ThreadDetail extends Omit<ThreadSummary, "repliesCount"> {
  replies: ReplyDetail[];
}

export interface ReplyDetail {
  id: string;
  content: string;
  author: DiscussionUser;
  timestamp: string; // ISO Date String
  upvotes: number;
  isUpvoted: boolean;
  isPinned: boolean;
}

export interface CreateThreadPayload {
  title: string;
  content: string;
  questionId?: number;
}

export interface AddReplyPayload {
  content: string;
}

export interface PinReplyPayload {
  replyId: string | null;
}

export interface TestResultsData {
  summary: {
    testInstanceId: string;
    testName: string;
    testType: "drill" | "quiz" | "weakness" | "custom";
    numCorrect: number;
    numIncorrect: number;
    numUnattempted: number;
    totalQuestions: number;
    previousOverallAccuracy: number;
  };
  questions: {
    id: number;
    questionText: string;
    options: Record<string, string>;
    correctAnswer: string;
    explanation?: string;
    selectedAnswer?: string | null;
    status: "Correct" | "Incorrect" | "Unattempted";
  }[];
}

export interface PublicGroupFilters {
  search?: string;
  subjectId?: number;
  examId?: number;
  sortBy?: "score" | "memberCount" | "lastActivityAt";
  page?: number;
  limit?: number;
}

// --- RESPONSE DATA INTERFACES (shape of data from the backend) ---

export interface MyGroup {
  id: string;
  name: string;
  description: string | null;
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  memberCount: number;
  subjects: string[];
  exams: string[];
  isOwner: boolean;
  isMember: boolean;
  activity: "high" | "medium" | "low";
  lastActivityAt: Date | null;
}

export interface GroupInvitation {
  id: string;
  studyRoom: { id: string; name: string };
  inviter: { id: string; fullName: string | null };
  createdAt: string;
}

export interface PublicGroup {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  subjects: { subject: { name: string } }[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QuickStats {
  groupsJoined: number;
  groupsOwned: number;
  totalMemberReach: number;
  reviewsCount: number;
}

export interface RecommendedGroup {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  subjects: string[];
  recommendationScore: number;
}

export interface GroupDetails {
  name: string;
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
  memberCount: number;
  sampleMembers: (string | null)[];
  yourRole: "ADMIN" | "MEMBER";
  inviteLink: string | null;
  inviteLinkExpiry: string | null;
}

export interface GeneratedInviteLink {
  inviteLink: string;
  expiresAt: string;
}

export interface InviteMemberPayload {
  email: string;
}

export interface PromoteAdminPayload {
  memberIdToPromote: string;
}

export interface UpdatePrivacyPayload {
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
}

export interface GenerateInviteLinkPayload {
  expiresInHours?: number;
}

export interface LeaderboardMember extends ApiMember {
  score: number;
  correctness: number;
}

export interface OverallStats {
  totalAttempted: number;
  totalCorrect: number;
  totalTime: number; // in hours
  avgAccuracy: number; // percentage
}

export interface WeeklyStats {
  questionsAttemptedLast7Days: number;
  timeSpentLast7Days: number; // in hours
  accuracyImprovementLast7Days: number; // percentage points
}

export interface ChapterPerformance {
  name: string;
  accuracy: number;
  attempted: number;
  correct: number;
  avgTime: number; // in minutes
}

export interface SubjectPerformance {
  name: string;
  color: string;
  accuracy: number;
  questionsAttempted: number;
  questionsCorrect: number;
  avgTimePerQuestion: number; // in minutes
  totalTimeSpent: number; // in hours
  chapters: ChapterPerformance[];
  communityAverage: number; // Community average accuracy for this subject
}

export interface AnalyticsDifficultyPerformance {
  level: "Easy" | "Medium" | "Hard" | "Elite";
  accuracy: number;
  attempted: number;
  correct: number;
  avgTime: number; // in minutes
}

export interface DailyProgress {
  date: string; // Formatted as "YYYY-MM-DD"
  accuracy: number;
  questionsAttempted: number;
  timeSpent: number; // in hours
}

export interface TopPerformer {
  name: string | null;
  accuracy: number;
  rank: number;
}

export interface CommunityData {
  userRank: number;
  totalUsers: number;
  percentile: number;
  averageAccuracy: number; // Global average accuracy
  userAccuracy: number;
  topPerformers: TopPerformer[];
}

export interface SubtopicPerformanceData {
  subject: string;
  chapter: string;
  subtopic: string;
  accuracy: number;
  attempted: number;
}

export interface TimeDistributionDataPoint {
  name: string; // Subject name
  value: number; // Total time spent in hours
  color: string;
}

export interface AnalyticsData {
  overallStats: OverallStats;
  weeklyStats: WeeklyStats;
  subjectData: SubjectPerformance[];
  difficultyData: AnalyticsDifficultyPerformance[];
  progressData: DailyProgress[];
  communityData: CommunityData;
  subtopicData: SubtopicPerformanceData[];
  timeDistributionData: TimeDistributionDataPoint[];
  userStreak: number;
  goals: any[];
  achievements: any[];
}

// For the user's profile/preferences payload
export interface ScheduleProfilePayload {
  examId: number;
  dailyAvailableHours: number[];
  coachingStartTime: string;
  coachingEndTime: string;
  examDate?: string;
  currentLevel: "NEW" | "MID" | "STRONG";
  studyStyle: "TESTS_FIRST" | "CONCEPT_FIRST";
  subjectConfidence: Record<string, number>;
  preferredMockDay:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  weaknessTestDay?:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
}

// For the weekly generation payload
export interface GenerateSchedulePayload {
  examId: number;
  weekStartDate: string; // "YYYY-MM-DD"
  topicIds: number[];
  mockDay:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  weaknessTestDay?:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
}

// For updating a single session
export interface UpdateSessionPayload {
  status?: "COMPLETED" | "SKIPPED";
  newDate?: string; // "YYYY-MM-DD"
}

// For the data returned by the getMonthlySchedule endpoint
export interface ScheduledSession {
  id: string;
  subject: string;
  topic: string; // This will be the sessionTitle for mock/weakness tests
  topicId: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  method: string; // e.g., "PRACTICE", "REVISION"
  duration: number; // in minutes
  time: string; // "HH:mm"
  completed: boolean;
  questionCount?: number;
  timeLimitMinutes?: number;
  difficultyLevel?: "Easy" | "Medium" | "Hard" | "Elite";
}

export type MonthlyScheduleData = Record<number, ScheduledSession[]>;

export interface TopicOption {
  id: number;
  name: string;
}

export interface SubjectWithTopics {
  id: number;
  name: string;
  topics: TopicOption[];
}

export interface VideoJobStatus {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  videoUrl: string | null;
  errorMessage: string | null;
  retryCount: number;
}

const getAuthToken = async (): Promise<string> => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("User not authenticated. Please log in.");
  }
  return await auth.currentUser.getIdToken();
};

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
  return result.data;
};

export const apiService = {
  /**
   * GENERIC: Fetches the data needed to take any test.
   * The `testType` parameter determines which backend route is called.
   */
  async getTestData(testInstanceId: string, testType: TestType) {
    const token = await getAuthToken();
    const url =
      testType === "custom"
        ? `${API_BASE_URL}/custom-quiz/test/${testInstanceId}`
        : `${API_BASE_URL}/weakness/test-details/${testInstanceId}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * GENERIC: Submits a completed test.
   * The `testType` parameter determines which backend route is called.
   */
  async submitTest(testInstanceId: string, testType: TestType) {
    const token = await getAuthToken();
    const url =
      testType === "custom"
        ? `${API_BASE_URL}/custom-quiz/submit/${testInstanceId}`
        : `${API_BASE_URL}/weakness/submit/${testInstanceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },

  /**
   * SHARED: Saves real-time progress for a question to Redis.
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
      body: JSON.stringify({
        questionId,
        userAnswer,
        timeSpentChunk,
      }),
    });
  },

  async getSavedProgress(testInstanceId: string): Promise<RestoredProgress> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/test/progress/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  async saveMarkProgress(
    testInstanceId: string,
    questionId: number,
    userAnswer: string | null,
    markedForReview: boolean,
    timeSpentChunk: number
  ) {
    const token = await getAuthToken();
    fetch(`${API_BASE_URL}/test/mark-progress/${testInstanceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId,
        userAnswer,
        markedForReview,
        timeSpentChunk,
      }),
    });
  },

  async getSavedMarkProgress(
    testInstanceId: string
  ): Promise<RestoredProgress> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/test/mark-progress/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * SHARED: Fetches the combined data for any test results page.
   * Note: This assumes results for both test types are fetched from the same endpoints.
   */
  async getCombinedTestResults(
    testInstanceId: string
  ): Promise<CombinedResultsData> {
    const token = await getAuthToken();
    const [resultsResponse, comparisonResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/weakness/results/${testInstanceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/weakness/accuracy-comparison/${testInstanceId}`, {
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

  async getQuizResults(testInstanceId: string) {
    const token = await getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/custom-quiz/results/${testInstanceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch quiz results");
    }

    const result = await response.json();
    return result.data;
  },

  // WEAKNESS TEST SPECIFIC ENDPOINTS

  async getWeaknessTestHistory(): Promise<WeaknessTestHistoryItem[]> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/weakness/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async getWeakestTopics(examId: number) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/weakness/preview/${examId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async generateWeaknessTest(examId: number) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/weakness/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ examId }),
    });
    return handleResponse(response);
  },

  async getAvailablePyqs(examId: number): Promise<AvailablePyqData[]> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pyq/available/${examId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async getLatestPyqResultId(
    examSessionId: number
  ): Promise<{ testInstanceId: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/pyq/latest-result/${examSessionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  async generatePyqTest(
    examSessionId: number
  ): Promise<{ testInstanceId: string }> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pyq/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ examSessionId }),
    });
    return handleResponse(response);
  },

  async getPyqBestScore(
    examSessionId: number
  ): Promise<{ bestScore: string | null }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/pyq/best-score/${examSessionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  async getPyqPercentile(testInstanceId: string): Promise<PyqPercentileData> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/pyq/percentile/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },
  async getPyqTestData(testInstanceId: string): Promise<any> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pyq/test/${testInstanceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },
  async submitPyqTest(testInstanceId: string): Promise<any> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/pyq/submit/${testInstanceId}`,
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
  async getTestResults(testInstanceId: string): Promise<CombinedResultsData> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/pyq/results/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },
  async getMistakesByExam(examId: number): Promise<FormattedMistake[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/practice/mistakes/${examId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "An unknown error occurred." }));
      throw new Error(
        errorData.error || `HTTP error! Status: ${response.status}`
      );
    }
    return await response.json();
  },
  async getSubjectsWithTopicsByExam(examId: number): Promise<Subject[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/practice/subjects/${examId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches all PYQs for a given topic and exam.
   * Corresponds to: GET /practice/topic-pyq/:examId/:topicId
   */
  async getPyqsByTopicAndExam(
    examId: number,
    topicId: number
  ): Promise<PyqQuestion[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/practice/topic-pyq/${examId}/${topicId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches all groups the current user is a member of.
   */
  async getMyGroups() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/study-group/my-groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * Creates a new study group.
   * @param groupData - The details of the group to create.
   */
  async createGroup(groupData: CreateGroupPayload) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/study-group/create-group`, {
      // Note the RESTful route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });
    return handleResponse(response);
  },

  /**
   * Fetches all pending invitations for the current user.
   */
  async getGroupInvitations() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/study-group/invitations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * Responds to a group invitation.
   * @param invitationId - The ID of the invitation to respond to.
   * @param action - Whether to 'accept' or 'decline' the invitation.
   */
  async respondToInvitation(
    invitationId: string,
    action: "accept" | "decline"
  ) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/invitations/${invitationId}/respond`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches a paginated and filtered list of public groups.
   * @param filters - Optional query parameters for searching, filtering, and sorting.
   */
  async getPublicGroups(filters: PublicGroupFilters = {}) {
    const token = await getAuthToken();
    const queryParams = new URLSearchParams(filters as any).toString();
    const response = await fetch(
      `${API_BASE_URL}/study-group/public?${queryParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches quick statistics about the user's group activity.
   */
  async getQuickStats() {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/study-group/quick-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * Fetches personalized group recommendations for the user.
   */
  async getRecommendedGroups() {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },
  /**
   * Allows the current user to join a public group.
   * @param studyRoomId The ID of the public group to join.
   */
  async joinPublicGroup(studyRoomId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/join`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  async leaveGroup(studyRoomId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/leave`,
      {
        method: "DELETE", // Use the DELETE method
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  /**
   * Deletes a study group. Must be called by a group owner/admin.
   * @param studyRoomId The ID of the group to delete.
   */
  async deleteGroup(studyRoomId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getGroupMembers(studyRoomId: string): Promise<ApiMember[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/members`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return handleResponse(response);
  },

  async getLiveLeaderboard(studyRoomId: string): Promise<LeaderboardMember[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/leaderboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  async createScheduledTest(
    studyRoomId: string,
    payload: CreateScheduledTestPayload
  ) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/schedule-test`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  async getScheduledTests(studyRoomId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/scheduled-tests`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  async getGroupMembersForSelection(studyRoomId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/members-for-selection`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  async startGroupTest(
    scheduledTestId: string
  ): Promise<StartGroupTestResponse> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/start-group-test/${scheduledTestId}`,
      {
        method: "GET", // This is an action, so POST is appropriate
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches the full details of a single scheduled test, including questions.
   * @param studyRoomId - The ID of the study group.
   * @param testId - The ID of the scheduled test.
   */
  async getScheduledTestDetails(testId: string): Promise<ScheduledTestDetails> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/scheduled-group-test/${testId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Starts a scheduled test for the user, creating a test instance.
   * @param studyRoomId - The ID of the study group.
   * @param testId - The ID of the test to start.
   */
  async startScheduledTest(
    studyRoomId: string,
    testId: string
  ): Promise<StartedTestData> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/test/${testId}/start`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Submits the user's answers for a completed scheduled test.
   * @param studyRoomId - The ID of the study group.
   * @param testId - The ID of the test being submitted.
   * @param answers - An object containing question IDs and selected option IDs.
   */
  async submitScheduledTest(testId: string): Promise<TestSubmissionResult> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/scheduled-group-test/${testId}/submit`,
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

  async getGroupMockTestResults(
    scheduledTestId: string
  ): Promise<GroupTestResultsData> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/group-test-results/${scheduledTestId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },
  /**
   * Fetches the subjects and topics available for creating a challenge in a study group.
   * Corresponds to: GET /study-groups/challenge-options/:studyRoomId
   */
  async getChallengeOptions(
    studyRoomId: string
  ): Promise<SubjectWithOptions[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenge-options/${studyRoomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches all active and past challenges for a study group.
   * Corresponds to: GET /study-groups/challenges/:studyRoomId
   */
  async getChallenges(studyRoomId: string): Promise<Challenge[]> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenges/${studyRoomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Creates a new challenge within a study group.
   * Corresponds to: POST /study-groups/:studyRoomId/challenge
   */
  async createChallenge(
    studyRoomId: string,
    payload: CreateChallengePayload
  ): Promise<Challenge> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/challenge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  /**
   * Allows the current user to accept and join a challenge.
   * Corresponds to: POST /api/challenges/:challengeId/accept
   */
  async acceptChallenge(challengeId: string): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenges/${challengeId}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  async startChallenge(challengeId: string): Promise<StartChallengeResponse> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenges/${challengeId}/start`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * NEW: Fetches the questions and timing for a specific challenge test instance.
   * This is called by the test page after getting the instance ID.
   */
  async getChallengeTestDetails(
    testInstanceId: string
  ): Promise<ChallengeTestDetails> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenge-instance/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  submitPrediction: async (
    challengeId: string,
    payload: SubmitPredictionPayload
  ): Promise<void> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenges/${challengeId}/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  submitChallenge: async (
    challengeId: string
  ): Promise<ChallengeSubmissionResult> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/submit-challenge/${challengeId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to submit challenge.");
    }
    return result.data;
  },

  getChallengeResults: async (
    testInstanceId: string
  ): Promise<ChallengeResultsData> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/challenge-results/${testInstanceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },
  getThreads: async (studyRoomId: string): Promise<ThreadSummary[]> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/discussions`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  getThreadDetails: async (threadId: string): Promise<ThreadDetail> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/discussions/${threadId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  createThread: async (
    studyRoomId: string,
    payload: CreateThreadPayload
  ): Promise<any> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/discussions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  addReply: async (
    threadId: string,
    payload: AddReplyPayload
  ): Promise<any> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/discussions/${threadId}/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  toggleThreadLike: async (threadId: string): Promise<any> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/discussions/threads/${threadId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  toggleReplyLike: async (replyId: string): Promise<any> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/discussions/replies/${replyId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  pinReply: async (
    threadId: string,
    payload: PinReplyPayload
  ): Promise<any> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/discussions/${threadId}/pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  resolveThread: async (threadId: string): Promise<any> => {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/discussions/${threadId}/resolve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getAIDailyPlan(examId: number) {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/ai-pipelines/daily-plan/${examId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  generateAIQuiz: async (quizParams: {
    examId: number;
    topicIds: number[];
    difficultyLevel: "Easy" | "Medium" | "Hard";
    questionCount: number;
    timeLimitMinutes: number;
    questionTypes: string[];
    recommendedId: string;
  }): Promise<{ testInstanceId: string }> => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(`${API_BASE_URL}/drill/quiz/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quizParams),
    });
    return handleResponse(response);
  },

  generateDrill: async (quizParams: {
    examId: number;
    topicIds: number[];
    difficultyLevel: "Easy" | "Medium" | "Hard";
    questionCount: number;
    timeLimitMinutes: number;
    questionTypes: string[];
    recommendedId: string;
  }): Promise<{ testInstanceId: string }> => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(`${API_BASE_URL}/drill/drill/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quizParams),
    });
    return handleResponse(response);
  },

  async submitDrill(testInstanceId: string) {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/drill/submit/${testInstanceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },

  async getAiTest(testInstanceId: string) {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/drill/test/${testInstanceId}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async getDrillResults(testInstanceId: string): Promise<TestResultsData> {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/drill/results/${testInstanceId}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * Invites a user to a group by their email.
   * ROUTE: POST /api/study-group/:studyRoomId/invite
   */
  async inviteMember(
    studyRoomId: string,
    payload: InviteMemberPayload
  ): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches detailed information for the group dashboard page.
   * ROUTE: GET /api/study-group/:studyRoomId/details
   */
  async getGroupDetails(studyRoomId: string): Promise<GroupDetails> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/details`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Generates a new shareable invite link (admin only).
   * ROUTE: POST /api/study-group/:studyRoomId/generate-invite-link
   */
  async generateInviteLink(
    studyRoomId: string,
    payload: GenerateInviteLinkPayload = {}
  ): Promise<GeneratedInviteLink> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/generate-invite-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  /**
   * Joins a group using an invite code from a link.
   * ROUTE: POST /api/study-group/join-by-link/:inviteCode
   */
  async joinGroupByLink(inviteCode: string): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/join-by-link/${inviteCode}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Promotes a member to an admin role (admin only).
   * ROUTE: POST /api/study-group/:studyRoomId/promote-admin
   */
  async promoteToAdmin(
    studyRoomId: string,
    payload: PromoteAdminPayload
  ): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/promote-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },

  /**
   * Removes a member from a group (admin only).
   * ROUTE: DELETE /api/study-group/:studyRoomId/members/:memberId
   */
  async removeMember(
    studyRoomId: string,
    memberId: string
  ): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Updates the privacy settings of a group (admin only).
   * ROUTE: PATCH /api/study-group/:studyRoomId/privacy
   */
  async updateGroupPrivacy(
    studyRoomId: string,
    payload: UpdatePrivacyPayload
  ): Promise<{ newPrivacy: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/privacy`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },
  /**
   * Demotes an admin back to a member role (admin only).
   * ROUTE: DELETE /api/study-group/:studyRoomId/admins/:memberId
   */
  async demoteAdmin(
    studyRoomId: string,
    memberIdToDemote: string
  ): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/study-group/${studyRoomId}/admins/${memberIdToDemote}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  /**
   * Fetches all aggregated data for the analytics dashboard for a specific exam.
   * ROUTE: GET /api/analytics/overview/:examId
   */
  async getAnalyticsData(): Promise<AnalyticsData> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  async getTopicsForScheduling(examId: number): Promise<SubjectWithTopics[]> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/schedule/topics/${examId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * Fetches the user's saved scheduling preferences.
   */
  async getScheduleProfile(examId: number): Promise<ScheduleProfilePayload> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/schedule/profile/${examId}`, {
      // Assuming a GET endpoint exists
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  /**
   * Creates or updates the user's scheduling preferences.
   */
  async upsertScheduleProfile(payload: ScheduleProfilePayload): Promise<any> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/schedule/profile`, {
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
   * Generates a new AI-powered weekly schedule.
   */
  async generateWeeklySchedule(
    payload: GenerateSchedulePayload
  ): Promise<{ message: string }> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/schedule/generate-week`, {
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
   * Fetches all scheduled sessions for a given month and year.
   */
  async getMonthlySchedule(
    year: number,
    month: number
  ): Promise<MonthlyScheduleData> {
    const token = await getAuthToken();
    const queryParams = new URLSearchParams({
      year: String(year),
      month: String(month),
    });
    const response = await fetch(
      `${API_BASE_URL}/schedule/month?${queryParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse(response);
  },

  async startVideoGeneration(questionId: number): Promise<{ jobId: string }> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/video/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId }),
    });
    const result = await response.json();
    return result;
  },

  async getVideoGenerationStatus(jobId: string): Promise<VideoJobStatus> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/video/status/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result.jobRecord;
  },

  /**
   * Updates a specific session (e.g., marks as complete, reschedules).
   */
  async updateSession(
    sessionId: string,
    payload: UpdateSessionPayload
  ): Promise<any> {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/schedule/session/${sessionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse(response);
  },
};
