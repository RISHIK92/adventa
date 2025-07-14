'use server';

/**
 * @fileOverview Suggests related subjects to broaden the user's knowledge.
 *
 * - suggestAdjacentSubjects - A function that suggests related subjects.
 * - SuggestAdjacentSubjectsInput - The input type for the suggestAdjacentSubjects function.
 * - SuggestAdjacentSubjectsOutput - The return type for the suggestAdjacentSubjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAdjacentSubjectsInputSchema = z.object({
  currentSubject: z
    .string()
    .describe('The subject the user is currently studying.'),
  currentLesson: z
    .string()
    .describe('The specific lesson the user is currently viewing.'),
  depth: z
    .number()
    .int()
    .min(1)
    .max(2)
    .default(1)
    .describe(
      'The maximum depth of suggestions relative to the current lesson. Must be 1 or 2.'
    ),
});
export type SuggestAdjacentSubjectsInput = z.infer<
  typeof SuggestAdjacentSubjectsInputSchema
>;

const SuggestAdjacentSubjectsOutputSchema = z.object({
  suggestedSubjects: z
    .array(z.string())
    .describe('A list of subjects related to the current subject.'),
});
export type SuggestAdjacentSubjectsOutput = z.infer<
  typeof SuggestAdjacentSubjectsOutputSchema
>;

export async function suggestAdjacentSubjects(
  input: SuggestAdjacentSubjectsInput
): Promise<SuggestAdjacentSubjectsOutput> {
  return suggestAdjacentSubjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAdjacentSubjectsPrompt',
  input: {schema: SuggestAdjacentSubjectsInputSchema},
  output: {schema: SuggestAdjacentSubjectsOutputSchema},
  prompt: `You are an AI assistant helping students broaden their knowledge.

You are given the subject and current lesson the student is studying, and the maximum depth of suggestions allowed.

Suggest subjects that the student might find interesting, related to the current subject, but not more than {{depth}} levels deeper in the subject tree.

Subject: {{{currentSubject}}}
Current Lesson: {{{currentLesson}}}
Depth: {{{depth}}}

Suggested Subjects:`,
});

const suggestAdjacentSubjectsFlow = ai.defineFlow(
  {
    name: 'suggestAdjacentSubjectsFlow',
    inputSchema: SuggestAdjacentSubjectsInputSchema,
    outputSchema: SuggestAdjacentSubjectsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
