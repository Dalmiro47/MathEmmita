'use client';

import { Firestore, collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { generateProblem, type Problem } from './math-engine';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Saves a user's attempt at a problem to Firestore.
 * @param db - The Firestore database instance.
 * @param userId - The ID of the user.
 * @param problem - The problem that was attempted.
 * @param isCorrect - Whether the user's answer was correct.
 */
export function saveAttempt(db: Firestore, userId: string, problem: Problem, isCorrect: boolean) {
  if (!db) {
    console.error("Firestore is not initialized.");
    return;
  }
  const attemptsCollection = collection(db, 'users', userId, 'attempts');
  const attemptData = {
      userId: userId,
      problem,
      isCorrect,
      timestamp: serverTimestamp(),
  };

  addDoc(attemptsCollection, attemptData)
    .catch((error) => {
        // Instead of console.logging, create a rich, contextual error.
        const permissionError = new FirestorePermissionError({
          path: attemptsCollection.path,
          operation: 'create',
          requestResourceData: attemptData,
        });
        
        // Emit the error to be caught by our central listener.
        errorEmitter.emit('permission-error', permissionError);
        
        // Also log the original server error for additional context if needed.
        console.error("Original Firestore Error:", error);
    });
}

/**
 * "Kind Tutor" algorithm to get the next problem.
 * It has a 30% chance of repeating a recently failed problem.
 * @param db - The Firestore database instance.
 * @param userId - The ID of the user.
 * @param level - The difficulty level for new problems.
 * @returns A Problem object.
 */
export async function getSmartProblem(db: Firestore | null, userId: string, level: 1 | 2 = 1): Promise<Problem> {
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
        console.log("Repeating a tough one!", problemToRepeat);
        return problemToRepeat;
      }
    } catch (error) {
        // For read operations, we can just log to console and fall back.
        // The permission error system is most critical for writes.
        console.error("Error fetching smart problem, falling back to random:", error);
        return generateProblem(level);
    }
  }

  // Default: 70% chance or if Firestore fails/is not available
  return generateProblem(level);
}
