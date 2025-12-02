'use client';

import { Firestore, collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, doc, getDoc, runTransaction, setDoc } from 'firebase/firestore';
import { generateProblem, type Problem } from './math-engine';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// --- Types ---

export interface RewardsConfig {
  level1: string;
  level2: string;
  level3: string;
}

export interface DailyStats {
  currentPoints: number;
  lastPlayedDate: string; // YYYY-MM-DD
}

export interface UserProfile {
  dailyStats?: DailyStats;
  rewardsConfig?: RewardsConfig;
}


// --- Functions ---

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
  // Omit isRetry before saving to Firestore
  const { isRetry, ...problemToSave } = problem;
  const attemptData = {
      userId: userId,
      problem: problemToSave,
      isCorrect,
      timestamp: serverTimestamp(),
  };

  addDoc(attemptsCollection, attemptData)
    .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: attemptsCollection.path,
          operation: 'create',
          requestResourceData: attemptData,
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Original Firestore Error:", error);
    });
}

/**
 * "Kind Tutor" algorithm to get the next problem.
 * It has a 30% chance of repeating a recently failed problem that has not been subsequently answered correctly.
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
      const failedAttemptsQuery = query(
        attemptsCollection,
        where('isCorrect', '==', false),
        orderBy('timestamp', 'desc'),
        limit(10) // Look at the last 10 incorrect problems
      );
      
      const failedAttemptsSnapshot = await getDocs(failedAttemptsQuery);
      
      if (!failedAttemptsSnapshot.empty) {
        const pendingProblems: Problem[] = [];

        for (const failedDoc of failedAttemptsSnapshot.docs) {
            const failedAttemptData = failedDoc.data();
            const problemCandidate = failedAttemptData.problem as Problem;
            const failedTimestamp = failedAttemptData.timestamp;

            // Now, check if this problem was answered correctly *after* this specific failure.
            const subsequentCorrectQuery = query(
                attemptsCollection,
                where('isCorrect', '==', true),
                where('problem.question', '==', problemCandidate.question),
                where('timestamp', '>', failedTimestamp),
                limit(1)
            );

            const subsequentCorrectSnapshot = await getDocs(subsequentCorrectQuery);

            // If there are NO subsequent correct answers, it's a pending problem.
            if (subsequentCorrectSnapshot.empty) {
                pendingProblems.push(problemCandidate);
            }
        }
        
        const uniquePendingProblems = Array.from(new Set(pendingProblems.map(p => p.question)))
            .map(q => pendingProblems.find(p => p.question === q)!);

        if (uniquePendingProblems.length > 0) {
            const problemToRepeat = uniquePendingProblems[Math.floor(Math.random() * uniquePendingProblems.length)];
            console.log("Repeating a tough one!", problemToRepeat);
            return { ...problemToRepeat, isRetry: true };
        }
      }
    } catch (error) {
        console.error("Error fetching smart problem, falling back to random:", error);
        // Fall through to generate a new problem
    }
  }

  return generateProblem(level);
}


/**
 * Retrieves a user's full profile, including stats and rewards config.
 * @param db Firestore instance
 * @param userId User's ID
 * @returns UserProfile object or null if not found.
 */
export async function getUserProfile(db: Firestore, userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, 'users', userId);
    try {
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() as UserProfile : null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}


/**
 * Updates a user's points. Handles daily reset logic.
 * @param db Firestore instance
 * @param userId User's ID
 * @param pointsToAdd Points to add for the correct answer.
 * @returns The new total points for the day.
 */
export async function updateUserPoints(db: Firestore, userId: string, pointsToAdd: number): Promise<number> {
    const userDocRef = doc(db, 'users', userId);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        const newTotalPoints = await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            
            let currentPoints = 0;
            let lastPlayed = '';

            if (userDoc.exists()) {
                const data = userDoc.data() as UserProfile;
                currentPoints = data.dailyStats?.currentPoints ?? 0;
                lastPlayed = data.dailyStats?.lastPlayedDate ?? '';
            }

            // Daily Reset Logic
            if (lastPlayed !== today) {
                currentPoints = 0;
            }

            const newPoints = currentPoints + pointsToAdd;

            transaction.set(userDocRef, {
                dailyStats: {
                    currentPoints: newPoints,
                    lastPlayedDate: today,
                }
            }, { merge: true });
            
            return newPoints;
        });

        console.log(`Points updated. New total: ${newTotalPoints}`);
        return newTotalPoints;

    } catch (error) {
         const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: { pointsToAdd }, // Include relevant data
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Original Firestore Error during point update:", error);
        return 0; // Return 0 on failure
    }
}

/**
 * Saves the rewards configuration for a user.
 * @param db Firestore instance
 * @param userId User's ID
 * @param rewards The rewards configuration object.
 */
export function saveRewards(db: Firestore, userId: string, rewards: RewardsConfig) {
    const userDocRef = doc(db, 'users', userId);
    const dataToSave = { rewardsConfig: rewards };

    // setDoc with merge: true will create or update the document.
    // We use a .catch block for centralized error handling.
    setDoc(userDocRef, dataToSave, { merge: true })
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
            console.error("Original Firestore error on saveRewards:", error);
        });
}
