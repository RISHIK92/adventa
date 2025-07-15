
'use server';

import { suggestAdjacentSubjects } from '@/ai/flows/suggest-adjacent-subjects';
import type { SuggestAdjacentSubjectsInput } from '@/ai/flows/suggest-adjacent-subjects';
import type { QuizQuestion } from '@/ai/flows/generate-quiz-flow';
import type { TestQuestion } from '@/ai/flows/generate-test-flow';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc } from 'firebase/firestore';

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

export type QuizResult = {
  userId: string;
  subject: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  timestamp?: any;
};

export async function saveQuizResult(result: QuizResult) {
  try {
    if (!result.userId) throw new Error("User ID is required to save quiz result.");
    const resultsCollectionRef = collection(db, 'users', result.userId, 'quizResults');
    await addDoc(resultsCollectionRef, {
      ...result,
      timestamp: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return { success: false, error: 'Failed to save quiz result.' };
  }
}

export type TestResult = {
  userId: string;
  difficulty: string;
  totalQuestions: number;
  timeLimit: number;
  subjects: { subject: string; count: number }[];
  score: number;
  subjectWiseScores: Record<string, { correct: number; total: number }>;
  timestamp?: any;
};

export async function saveTestResult(result: TestResult) {
  try {
    if (!result.userId) throw new Error("User ID is required to save test result.");
    const resultsCollectionRef = collection(db, 'users', result.userId, 'testResults');
    await addDoc(resultsCollectionRef, {
      ...result,
      timestamp: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving test result:', error);
    return { success: false, error: 'Failed to save test result.' };
  }
}

export async function getQuizResults(userId: string) {
  try {
    if (!userId) return { success: true, data: [] };
    const resultsCollectionRef = collection(db, 'users', userId, 'quizResults');
    const q = query(resultsCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate().toISOString(),
      });
    });
    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return { success: false, error: 'Failed to fetch quiz results.' };
  }
}

export async function getTestResults(userId: string) {
  try {
    if (!userId) return { success: true, data: [] };
    const resultsCollectionRef = collection(db, 'users', userId, 'testResults');
    const q = query(resultsCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
       const data = doc.data();
       results.push({
         id: doc.id,
         ...data,
         timestamp: data.timestamp?.toDate().toISOString(),
       });
    });
    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching test results:', error);
    return { success: false, error: 'Failed to fetch test results.' };
  }
}
