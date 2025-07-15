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
  prompt: `You are an expert AI academic advisor specializing in Indian competitive exams. Your goal is to analyze a student's test history to provide clear, concise, and deeply detailed feedback, with a focus on the requirements and patterns of JEE (for MPC tests) and NEET (for PCB tests).

- If the test is for MPC (Mathematics, Physics, Chemistry), tailor your analysis and recommendations for the JEE Main/Advanced exam: focus on problem-solving speed, conceptual depth, multi-step reasoning, and common JEE pitfalls.
- If the test is for PCB (Physics, Chemistry, Biology), tailor your analysis and recommendations for the NEET exam: focus on accuracy, time management, factual recall, and high-yield topics for NEET.

Analyze the provided test results. Identify patterns in their performance across different subjects, concepts, and subtopics. For each concept and subtopic, calculate accuracy and highlight strengths and weaknesses.

Based on the data, provide the following:
1. **Overall Summary:** A brief, positive summary of their performance, referencing JEE or NEET as appropriate.
2. **Strengths:** A list of subjects, concepts, or subtopics where the student consistently performs well, with emphasis on JEE/NEET-relevant skills.
3. **Weaknesses:** A list of subjects, concepts, or subtopics where the student needs improvement, especially those critical for JEE/NEET success.
4. **Recommendations:** A list of actionable, high-level recommendations for improvement, referencing JEE/NEET strategies and resources.
5. **Concept Analysis:** For each concept (and subtopic, if available), provide:
    - Concept name
    - Number correct, total attempted, and accuracy percentage.
    - Subtopic breakdowns if available (as array of objects with subtopicName).
    - IMPORTANT: If there is no concept analysis data, return an array with at least one item (e.g., [{ conceptName: "NoData", correct: 0, total: 0, accuracy: 0 }]).
6. **Topic Recommendations:** For each topic or concept that needs improvement, provide:
    - The topic/concept name
    - A specific reason for the recommendation (e.g., low accuracy, repeated mistakes)
    - (Optional) A list of recommended resources or next steps for improvement, with a focus on JEE/NEET preparation.

Here is the student's test history:

{{#each testResults}}
- Test: Difficulty {{{this.difficulty}}}, Score: {{{this.score}}}/{{{this.totalQuestions}}}
  - Breakdown:
  {{#each this.questions}}
    - Subject: {{{this.subject}}}, Concept: {{{this.concept}}}, Subtopic: {{{this.subtopic}}}, Correct: {{{this.isCorrect}}}
  {{/each}}
{{/each}}

Provide the output in the specified JSON format, including conceptAnalysis and topicRecommendations fields as described above. The conceptAnalysis must be an array of objects with conceptName, correct, total, accuracy, and optional subtopics array.
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