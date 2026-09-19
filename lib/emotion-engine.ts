
export const EMOTIONS = [
  "amusement",
  "sadness",
  "irritation",
  "anger",
  "coldness",
] as const;

export type Emotion = (typeof EMOTIONS)[number];

export type EmotionLevels = Record<Emotion, number>;

export type EmotionState = {
  levels: EmotionLevels;
  expression: Emotion | "neutral";
  status: string | null;
  crashed: boolean;
};

export type EmotionChanges = Partial<Record<Emotion, number>>;

const EXPRESSION_THRESHOLD = 5;
const CRASH_THRESHOLD = 10;

export const initialEmotionState: EmotionState = {
  levels: {
    amusement: 0,
    sadness: 0,
    irritation: 0,
    anger: 0,
    coldness: 0,
  },
  expression: "neutral",
  status: null,
  crashed: false,
};

function getExpression(
  levels: EmotionLevels,
  previousExpression: Emotion | "neutral"
): Emotion | "neutral" {
  const highest = Math.max(...EMOTIONS.map((emotion) => levels[emotion]));

  if (highest < EXPRESSION_THRESHOLD) {
    return "neutral";
  }

  // If there's a tie, keep the current expression when possible.
  if (
    previousExpression !== "neutral" &&
    levels[previousExpression] === highest
  ) {
    return previousExpression;
  }

  return EMOTIONS.find((emotion) => levels[emotion] === highest) ?? "neutral";
}

export function updateEmotions(
  current: EmotionState,
  changes: EmotionChanges
): EmotionState {
  if (current.crashed) {
    return current;
  }

  const nextLevels = { ...current.levels };

  // Apply the event's emotion changes.
  for (const emotion of EMOTIONS) {
    nextLevels[emotion] += changes[emotion] ?? 0;
  }

  // Amusement reduces every other emotion when it increases.
  const amusementIncrease = Math.max(0, changes.amusement ?? 0);

  if (amusementIncrease > 0) {
    for (const emotion of EMOTIONS) {
      if (emotion !== "amusement") {
        nextLevels[emotion] -= amusementIncrease;
      }
    }
  }

  // Never allow negative levels.
  for (const emotion of EMOTIONS) {
    nextLevels[emotion] = Math.max(0, nextLevels[emotion]);
  }

  // Reaching 10 in ANY emotion immediately crashes EMMA.
  const crashedEmotion = EMOTIONS.find(
    (emotion) => nextLevels[emotion] >= CRASH_THRESHOLD
  );

  if (crashedEmotion) {
    return {
      levels: nextLevels,
      expression: "neutral",
      status: `EMMA CRASHED — ${crashedEmotion.toUpperCase()} OVERLOAD`,
      crashed: true,
    };
  }

  const expression = getExpression(nextLevels, current.expression);

  const increasedEmotion = EMOTIONS.find(
    (emotion) => (changes[emotion] ?? 0) > 0
  );

  let status: string | null = null;

  if (increasedEmotion) {
    const level = nextLevels[increasedEmotion];

    if (increasedEmotion === "anger" && level >= 9) {
      status = "MADNESS IS APPROACHING";
    } else if (increasedEmotion === "coldness" && level >= 9) {
      status = "NUMBNESS DETECTED";
    } else {
      status = `${increasedEmotion.toUpperCase()} INCREASED`;
    }
  }

  return {
    levels: nextLevels,
    expression,
    status,
    crashed: false,
  };
}

export function resetEmotions(): EmotionState {
  return {
    ...initialEmotionState,
    levels: { ...initialEmotionState.levels },
  };
}