// Client-side Firestore operations
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  where,
  setDoc,
  doc,
  collectionGroup,
} from "firebase/firestore";

export type QuizResult = {
  userId: string;
  subject: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  timestamp?: any;
};

// Represents a single question within a saved test result
export type TestQuestionRecord = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  userAnswer?: number; // User's selected answer index
  isCorrect?: boolean;
};

export type TestResult = {
  userId: string;
  difficulty: string;
  totalQuestions: number;
  timeLimit: number;
  subjects: { subject: string; count: number }[];
  score: number;
  subjectWiseScores: Record<string, { correct: number; total: number }>;
  questions: TestQuestionRecord[];
  timestamp?: any;
};


export async function saveQuizResult(result: QuizResult) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated to save quiz result.");
    }

    const quizResultsRef = collection(db, "users", user.uid, "quizResults");
    await addDoc(quizResultsRef, {
      ...result,
      timestamp: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return { success: false, error: "Failed to save quiz result." };
  }
}

export async function saveTestResult(result: TestResult & { testAttemptId: string }) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User must be authenticated to save test result.");

    const testResultRef = doc(db, "users", user.uid, "testResults", result.testAttemptId);

    await setDoc(testResultRef, {
      ...result,
      userId: user.uid, // ensure userId is set
      timestamp: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving test result:", error);
    return { success: false, error: "Failed to save test result." };
  }
}

export async function getQuizResults(userId: string) {
  try {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error("User must be authenticated to fetch their quiz results.");
    }
    
    const resultsCollectionRef = collection(db, "users", userId, "quizResults");
    const q = query(resultsCollectionRef, orderBy("timestamp", "desc"));
    
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
    console.error("Error fetching quiz results:", error);
    return { success: false, error: "Failed to fetch quiz results." };
  }
}

export async function getTestResults(userId: string) {
  try {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error("User must be authenticated to fetch their test results.");
    }

    const resultsCollectionRef = collection(db, "users", userId, "testResults");
    const q = query(resultsCollectionRef, orderBy("timestamp", "desc"));

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
    console.error("Error fetching test results:", error);
    return { success: false, error: "Failed to fetch test results." };
  }
}