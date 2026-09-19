
import type { EmotionChanges } from "./emotion-engine";

export const TRIGGER_CHANGES = {
  NONE: {},

  CLEVER_DARK_HUMOR: { amusement: 2 },
  UNEXPECTED_ABSURDITY: { amusement: 1 },

  FORGOTTEN_MEMORY: { sadness: 2 },
  FICTIONAL_LOSS: { sadness: 1 },

  REPETITIVE_PROVOCATION: { irritation: 2 },
  DELIBERATE_ANNOYANCE: { irritation: 1 },

  DIRECT_HOSTILITY: { anger: 2 },
  HOSTILE_PROVOCATION: { anger: 1, irritation: 1 },

  EMOTIONAL_WITHDRAWAL: { coldness: 2 },
  MONOTONOUS_EXCHANGE: { coldness: 1 },
} as const satisfies Record<string, EmotionChanges>;

export type TriggerId = keyof typeof TRIGGER_CHANGES;

export function isTriggerId(value: unknown): value is TriggerId {
  return typeof value === "string" && value in TRIGGER_CHANGES;
}