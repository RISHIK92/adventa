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
} from "firebase/firestore";

export type QuizResult = {
  userId: string;
  subject: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  timestamp?: any;
};

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

export async function saveQuizResult(result: QuizResult) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated to save quiz result.");
    }

    if (result.userId !== user.uid) {
      throw new Error("User ID mismatch.");
    }

    const resultsCollectionRef = collection(db, "quizResults");
    console.log("Collection ref:", resultsCollectionRef);
    console.log("Saving result for userId:", result.userId);

    const res = await addDoc(resultsCollectionRef, {
      ...result,
      timestamp: serverTimestamp(),
    });
    console.log("Document saved with ID:", res.id);
    return { res, success: true };
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return { success: false, error: "Failed to save quiz result." };
  }
}

export async function saveTestResult(result: TestResult) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated to save test result.");
    }

    if (result.userId !== user.uid) {
      throw new Error("User ID mismatch.");
    }

    const resultsCollectionRef = collection(db, "testResults");

    await addDoc(resultsCollectionRef, {
      ...result,
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
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated to fetch quiz results.");
    }

    // Ensure the userId matches the authenticated user
    if (userId !== user.uid) {
      throw new Error("User ID mismatch.");
    }

    if (!userId) return { success: true, data: [] };
    console.log(userId);

    const resultsCollectionRef = collection(db, "quizResults");
    console.log(resultsCollectionRef, "refabc");

    const q = query(
      resultsCollectionRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    console.log(q, "qbcd");

    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    console.log(results, "results");

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
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated to fetch test results.");
    }

    // Ensure the userId matches the authenticated user
    if (userId !== user.uid) {
      throw new Error("User ID mismatch.");
    }

    if (!userId) return { success: true, data: [] };

    const resultsCollectionRef = collection(db, "testResults");

    const q = query(
      resultsCollectionRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

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
