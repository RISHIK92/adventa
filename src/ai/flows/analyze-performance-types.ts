import { z } from 'zod';

// A simplified version of the test result for analysis purposes.
export const PerformanceTestResultSchema = z.object({
  difficulty: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  questions: z.array(z.object({
    subject: z.string(),
    isCorrect: z.boolean().optional(),
    concept: z.string().optional(), // Add concept for deeper analysis
    subtopic: z.string().optional(), // Add subtopic for deeper analysis
  })),
});

export const AnalyzePerformanceInputSchema = z.object({
  testResults: z.array(PerformanceTestResultSchema).describe("The user's past test results."),
});
export type AnalyzePerformanceInput = z.infer<typeof AnalyzePerformanceInputSchema>;

// Define the concept analysis structure
const ConceptAnalysisItemSchema = z.object({
  correct: z.number(),
  total: z.number(),
  accuracy: z.number(),
  subtopics: z.record(z.string(), z.object({
    correct: z.number(),
    total: z.number(),
    accuracy: z.number(),
  })).optional(),
});

export const AnalyzePerformanceOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, encouraging summary of the user's overall performance."),
  strengths: z.array(z.object({
    area: z.string(),
    accuracy: z.number(),
    description: z.string(),
  })).describe("Detailed strengths with specific areas, accuracy rates, and descriptions."),
  weaknesses: z.array(z.object({
    area: z.string(),
    accuracy: z.number(),
    description: z.string(),
    impact: z.string(),
  })).describe("Detailed weaknesses with specific areas, accuracy rates, descriptions, and impact assessment."),
  recommendations: z.array(z.string()).describe("High-level actionable recommendations for overall improvement."),
  conceptAnalysis: z.array(z.object({
    conceptName: z.string(),
    subject: z.string(),
    correct: z.number(),
    total: z.number(),
    accuracy: z.number(),
    performanceLevel: z.enum(["Excellent", "Good", "Average", "Needs Improvement", "Critical"]),
    keyInsights: z.array(z.string()),
    subtopics: z.array(z.object({
      subtopicName: z.string(),
      correct: z.number(),
      total: z.number(),
      accuracy: z.number(),
      performanceLevel: z.enum(["Excellent", "Good", "Average", "Needs Improvement", "Critical"]),
      commonMistakes: z.array(z.string()).optional(),
      specificRecommendations: z.array(z.string()),
    })).optional(),
  })).describe("Detailed analysis per concept and subtopic with performance levels and insights."),
  improvementPlan: z.array(z.object({
    priority: z.enum(["High", "Medium", "Low"]),
    concept: z.string(),
    subtopic: z.string().optional(),
    currentAccuracy: z.number(),
    targetAccuracy: z.number(),
    timeframe: z.string(),
    studyStrategy: z.string(),
    practiceRecommendations: z.array(z.string()),
    progressMilestones: z.array(z.string()),
  })).describe("Prioritized improvement plan with specific strategies and milestones."),
  topicRecommendations: z.array(z.object({
    topic: z.string(),
    subtopic: z.string().optional(),
    reason: z.string(),
    currentPerformance: z.string(),
    improvementStrategy: z.string(),
    recommendedResources: z.array(z.string()).optional(),
    practiceTypes: z.array(z.string()),
    estimatedTimeToImprove: z.string(),
  })).describe("In-depth recommendations for specific topics and subtopics with detailed improvement strategies."),
});
export type AnalyzePerformanceOutput = z.infer<typeof AnalyzePerformanceOutputSchema>;