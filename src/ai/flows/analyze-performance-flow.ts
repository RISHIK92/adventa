
'use server';
/**
 * @fileOverview Analyzes a user's test history to provide performance insights.
 *
 * - analyzePerformance - A function that generates strengths, weaknesses, and recommendations.
 * - AnalyzePerformanceInput - The input type for the analyzePerformance function.
 * - AnalyzePerformanceOutput - The return type for the analyzePerformance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// A simplified version of the test result for analysis purposes.
const PerformanceTestResultSchema = z.object({
  difficulty: z.string(),
  score: z.number(),
  totalQuestions: z.number(),
  questions: z.array(z.object({
      subject: z.string(),
      isCorrect: z.boolean().optional(),
    })
  ),
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

export async function analyzePerformance(
  input: AnalyzePerformanceInput
): Promise<AnalyzePerformanceOutput> {
  return analyzePerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePerformancePrompt',
  input: { schema: AnalyzePerformanceInputSchema },
  output: { schema: AnalyzePerformanceOutputSchema },
  prompt: `You are an expert AI academic advisor. Your goal is to analyze a student's test history to provide clear, concise, and encouraging feedback.

Analyze the provided test results. Identify patterns in their performance across different subjects and difficulties.

Based on the data, provide the following:
1.  **Overall Summary:** A brief, positive summary of their performance.
2.  **Strengths:** A list of 2-3 subjects or specific topics where the student excels.
3.  **Weaknesses:** A list of 2-3 subjects or topics where the student needs improvement.
4.  **Recommendations:** A list of 2-3 concrete topics or concepts to focus on. Frame these as positive next steps.

Here is the student's test history:

{{#each testResults}}
- Test: Difficulty {{{this.difficulty}}}, Score: {{{this.score}}}/{{{this.totalQuestions}}}
  - Breakdown:
  {{#each this.questions}}
    - Subject: {{{this.subject}}}, Correct: {{{this.isCorrect}}}
  {{/each}}
{{/each}}

Provide the output in the specified JSON format.
`,
});

const analyzePerformanceFlow = ai.defineFlow(
  {
    name: 'analyzePerformanceFlow',
    inputSchema: AnalyzePerformanceInputSchema,
    outputSchema: AnalyzePerformanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
