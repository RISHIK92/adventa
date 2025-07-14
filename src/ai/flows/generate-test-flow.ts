
'use server';

/**
 * @fileOverview Generates a test based on a list of subjects, question counts, and difficulty.
 *
 * - generateTest - A function that creates a test.
 * - GenerateTestInput - The input type for the generateTest function.
 * - GenerateTestOutput - The return type for the generateTest function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TestQuestionSchema = z.object({
  question: z.string().describe('The test question. This can include LaTeX for mathematical formulas.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers. These can also include LaTeX.'),
  correctAnswer: z.number().int().min(0).max(3).describe('The index (0-3) of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation for why the correct answer is right.'),
  subject: z.string().describe('The subject this question belongs to.'),
});
export type TestQuestion = z.infer<typeof TestQuestionSchema>;

const GenerateTestInputSchema = z.object({
  subjects: z.array(z.object({
    subject: z.string().describe('The subject for the test questions.'),
    count: z.number().int().positive().describe('The number of questions for this subject.'),
  })).describe('A list of subjects and the number of questions for each.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Expert']).describe('The difficulty level for the test questions.'),
});
export type GenerateTestInput = z.infer<typeof GenerateTestInputSchema>;


const GenerateTestOutputSchema = z.object({
  questions: z.array(TestQuestionSchema).describe('An array of test questions.'),
});
export type GenerateTestOutput = z.infer<typeof GenerateTestOutputSchema>;


export async function generateTest(input: GenerateTestInput): Promise<GenerateTestOutput> {
  return generateTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestPrompt',
  input: { schema: GenerateTestInputSchema },
  output: { schema: GenerateTestOutputSchema },
  system: `You are an expert educator. Your primary task is to create accurate, multi-subject tests.
You MUST generate the exact number of questions for each subject as specified in the input. Do not generate more or fewer questions than requested.
For every single question you generate, you MUST include the 'subject' field that corresponds to the question's topic. Do not omit the 'subject' field from any question object.`,
  prompt: `You are an expert educator responsible for creating challenging and accurate multi-subject tests.

Generate a test with the specified number of questions for each subject and difficulty level.
For each question, provide a brief explanation for the correct answer.
The questions, answers, and explanations can contain complex mathematical formulas in LaTeX format. Ensure the LaTeX is correctly formatted.
Ensure each question object has the correct 'subject' field populated from the input.

Difficulty: {{{difficulty}}}

Subjects and Question Counts:
{{#each subjects}}
- Subject: {{{this.subject}}}, Count: {{{this.count}}}
{{/each}}

Provide the output in the specified JSON format.
`,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE'
        }
    ]
  }
});


const generateTestFlow = ai.defineFlow(
  {
    name: 'generateTestFlow',
    inputSchema: GenerateTestInputSchema,
    outputSchema: GenerateTestOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
