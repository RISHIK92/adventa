
'use server';

import { suggestAdjacentSubjects } from '@/ai/flows/suggest-adjacent-subjects';
import type { SuggestAdjacentSubjectsInput } from '@/ai/flows/suggest-adjacent-subjects';

export async function getSuggestions(input: SuggestAdjacentSubjectsInput) {
  const validatedInput = { ...input, depth: 1 };

  try {
    const result = await suggestAdjacentSubjects(validatedInput);
    if (result && result.suggestedSubjects) {
      return { success: true, suggestions: result.suggestedSubjects };
    }
    return { success: false, error: 'Could not generate suggestions.' };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return { success: false, error: 'An unexpected error occurred while fetching suggestions.' };
  }
}
