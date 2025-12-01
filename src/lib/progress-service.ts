'use client';

import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { generateProblem, type Problem } from './math-engine';

/**
 * Saves a user's attempt at a problem to Firestore.
 * @param userId - The ID of the user.
 * @param problem - The problem that was attempted.
 * @param isCorrect - Whether the user's answer was correct.
 */
export async function saveAttempt(userId: string, problem: Problem, isCorrect: boolean) {
  if (!db) {
    console.error("Firestore is not initialized.");
    return;
  }
  try {
    const attemptsCollection = collection(db, 'users', userId, 'attempts');
    await addDoc(attemptsCollection, {
      problem,
      isCorrect,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving attempt to Firestore:", error);
    // Fail silently so the app can continue in offline mode.
  }
}

/**
 * "Kind Tutor" algorithm to get the next problem.
 * It has a 30% chance of repeating a recently failed problem.
 * @param userId - The ID of the user.
 * @param level - The difficulty level for new problems.
 * @returns A Problem object.
 */
export async function getSmartProblem(userId: string, level: 1 | 2 = 1): Promise<Problem> {
  const shouldRepeatFailedProblem = Math.random() < 0.3;

  if (shouldRepeatFailedProblem && db) {
    try {
      const attemptsCollection = collection(db, 'users', userId, 'attempts');
      const q = query(
        attemptsCollection,
        where('isCorrect', '==', false),
        orderBy('timestamp', 'desc'),
        limit(5) // Look at the last 5 incorrect problems
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const incorrectProblems: Problem[] = querySnapshot.docs.map(doc => doc.data().problem as Problem);
        // Pick a random one from the recent incorrect list
        const problemToRepeat = incorrectProblems[Math.floor(Math.random() * incorrectProblems.length)];
        return problemToRepeat;
      }
    } catch (error) {
      console.error("Error fetching smart problem, falling back to random:", error);
      // Fallback to random problem if Firestore fails
      return generateProblem(level);
    }
  }

  // Default: 70% chance or if Firestore fails/is not available
  return generateProblem(level);
}
