
"use client";

import { useState } from "react";
import {
  EMOTIONS,
  initialEmotionState,
  resetEmotions,
  updateEmotions,
  type Emotion,
  type EmotionState,
} from "../../lib/emotion-engine";

const emotionLabels: Record<Emotion, string> = {
  amusement: "Amusement",
  sadness: "Sadness",
  irritation: "Irritation",
  anger: "Anger",
  coldness: "Coldness",
};

export default function EmotionTestPage() {
  const [emma, setEmma] = useState<EmotionState>(() => resetEmotions());

  function changeEmotion(emotion: Emotion, amount: number) {
    setEmma((current) => updateEmotions(current, { [emotion]: amount }));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080d0b",
        color: "#a8f0d0",
        fontFamily: "monospace",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: 650, margin: "0 auto" }}>
        <h1>EMMA // EMOTION DEBUGGER</h1>

        <div
          style={{
            border: "1px solid #426b58",
            padding: 24,
            margin: "24px 0",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {emma.crashed ? "×_×" : "◉_◉"}
          </div>

          <h2>
            {emma.crashed
              ? "EMMA CRASHED"
              : `EXPRESSION: ${emma.expression.toUpperCase()}`}
          </h2>

          <p>{emma.status ?? "SYSTEM STABLE"}</p>
        </div>

        {EMOTIONS.map((emotion) => (
          <div
            key={emotion}
            style={{
              borderBottom: "1px solid #294437",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong>{emotionLabels[emotion]}</strong>
              <span>{emma.levels[emotion]} / 10</span>
            </div>

            <div
              style={{
                height: 8,
                background: "#1b3026",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(emma.levels[emotion], 10) * 10}%`,
                  background: "#a8f0d0",
                }}
              />
            </div>

            <button
              disabled={emma.crashed}
              onClick={() => changeEmotion(emotion, -1)}
            >
              −1
            </button>

            <button
              disabled={emma.crashed}
              onClick={() => changeEmotion(emotion, 1)}
              style={{ marginLeft: 12 }}
            >
              +1
            </button>
          </div>
        ))}

        <button
          onClick={() => setEmma(resetEmotions())}
          style={{
            marginTop: 28,
            padding: "12px 20px",
            border: "1px solid #a8f0d0",
          }}
        >
          REBOOT EMMA
        </button>
      </div>
    </main>
  );
}