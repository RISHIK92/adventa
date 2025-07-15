import { z } from 'zod';

// A simplified version of the test result for analysis purposes.
export const PerformanceTestResultSchema = z.object({
  difficulty: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  questions: z.array(z.object({
    subject: z.string(),
    isCorrect: z.boolean().optional(),
  })),
});

export const AnalyzePerformanceInputSchema = z.object({
  testResults: z.array(PerformanceTestResultSchema).describe("The user's past test results."),
});
export type AnalyzePerformanceInput = z.infer<typeof AnalyzePerformanceInputSchema>;

export const AnalyzePerformanceOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, encouraging summary of the user's overall performance."),
  strengths: z.array(z.string()).describe("A list of subjects or topics where the user consistently performs well."),
  weaknesses: z.array(z.string()).describe("A list of subjects or topics where the user struggles."),
  recommendations: z.array(z.string()).describe("Actionable recommendations for topics or concepts the user should focus on to improve."),
});
export type AnalyzePerformanceOutput = z.infer<typeof AnalyzePerformanceOutputSchema>; 