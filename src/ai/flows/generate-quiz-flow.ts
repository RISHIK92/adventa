'use server';

/**
 * @fileOverview Generates a quiz based on subject and difficulty.
 *
 * - generateQuiz - A function that creates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  subject: z.string().describe('The subject for the quiz questions.'),
  difficulty: z
    .enum(['Easy', 'Medium', 'Hard', 'Expert'])
    .describe('The difficulty level for the quiz questions.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z
    .string()
    .describe(
      'The quiz question. This can include LaTeX for mathematical formulas.'
    ),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      'An array of 4 possible answers. These can also include LaTeX.'
    ),
  correctAnswer: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe('The index (0-3) of the correct answer in the options array.'),
  explanation: z
    .string()
    .describe('A brief explanation for why the correct answer is right.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z
    .array(QuizQuestionSchema)
    .min(5)
    .max(10)
    .describe('An array of 5 to 10 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator responsible for creating challenging and accurate quizzes.

  - If the subject is Mathematics, Physics, or Chemistry, generate questions at the level and style of the JEE Main/Advanced exam (India). Focus on conceptual depth, multi-step reasoning, and problem-solving speed.
  - If the subject is Biology, generate questions at the level and style of the NEET exam (India). Focus on factual recall, accuracy, and high-yield NEET topics.

  Generate a quiz with 5-10 questions for the given subject and difficulty level.
  For each question, provide a brief explanation for the correct answer.
  The questions, answers, and explanations can contain complex mathematical formulas in LaTeX format. Ensure the LaTeX is correctly formatted.

  Subject: {{{subject}}}
  Difficulty: {{{difficulty}}}

  Provide the output in the specified JSON format.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
