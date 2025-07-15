
'use server';
/**
 * @fileOverview Analyzes a user's test history to provide performance insights.
 */

import { ai } from '@/ai/genkit';
import {
  AnalyzePerformanceInputSchema,
  AnalyzePerformanceOutputSchema,
  AnalyzePerformanceInput,
  AnalyzePerformanceOutput,
} from "../flows/analyze-performance-types";

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

export async function analyzePerformance(
  input: AnalyzePerformanceInput
): Promise<AnalyzePerformanceOutput> {
  return analyzePerformanceFlow(input);
}
