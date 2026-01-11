/**
 * SuperMemo-2 (SM-2) Algorithm Implementation
 * 
 * This algorithm calculates optimal review intervals for spaced repetition
 * based on the user's performance quality rating.
 * 
 * Quality scale:
 * - 3: Hard (Difficile) - Correct response with serious difficulty
 * - 4: Medium (Moyen) - Correct response after hesitation
 * - 5: Easy (Facile) - Perfect response
 */

export interface SM2Result {
  newInterval: number
  newRepetitions: number
  newEaseFactor: number
  nextReviewAt: Date
}

/**
 * Calculates the next review parameters using the SM-2 algorithm
 * 
 * @param quality - Quality of recall: 3 (Hard), 4 (Medium), or 5 (Easy)
 * @param currentInterval - Current interval in days (lastInterval from subject)
 * @param currentRepetitions - Current number of successful repetitions (reviewCount)
 * @param currentEaseFactor - Current ease factor (difficultyFactor)
 * @returns SM2Result with calculated next review parameters
 */
export function calculateNextReview(
  quality: 3 | 4 | 5,
  currentInterval: number,
  currentRepetitions: number,
  currentEaseFactor: number
): SM2Result {
  let newInterval: number
  let newRepetitions: number
  let newEaseFactor: number

  // If quality is below 3, reset the repetitions and set interval to 1 day
  // In our implementation, we only accept quality 3, 4, or 5, so this is a safety check
  if (quality < 3) {
    newInterval = 1
    newRepetitions = 0
    newEaseFactor = currentEaseFactor // Keep current EF
  } else {
    // Calculate new ease factor
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const qualityDiff = 5 - quality
    newEaseFactor = currentEaseFactor + (0.1 - qualityDiff * (0.08 + qualityDiff * 0.02))
    
    // Ensure minimum ease factor of 1.3
    newEaseFactor = Math.max(1.3, newEaseFactor)

    // Calculate new interval based on repetition number
    if (currentRepetitions === 0) {
      // First repetition: 1 day
      newInterval = 1
    } else if (currentRepetitions === 1) {
      // Second repetition: 6 days
      newInterval = 6
    } else {
      // Subsequent repetitions: I(n) = I(n-1) * EF
      newInterval = Math.round(currentInterval * newEaseFactor)
    }

    // Increment repetition count
    newRepetitions = currentRepetitions + 1
  }

  // Calculate next review date
  const now = new Date()
  const nextReviewAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000)

  return {
    newInterval,
    newRepetitions,
    newEaseFactor: Math.round(newEaseFactor * 100) / 100, // Round to 2 decimal places
    nextReviewAt,
  }
}

/**
 * Gets initial SM-2 values for a new subject
 */
export function getInitialSM2Values(): {
  difficultyFactor: number
  reviewCount: number
  lastInterval: number
  nextReviewAt: Date
} {
  const now = new Date()
  const nextReviewAt = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000) // 1 day from now

  return {
    difficultyFactor: 2.5,
    reviewCount: 0,
    lastInterval: 1,
    nextReviewAt,
  }
}
