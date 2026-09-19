
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  EMOTIONS,
  resetEmotions,
  updateEmotions,
  type Emotion,
  type EmotionChanges,
  type EmotionState,
} from "../../lib/emotion-engine";

type Message = {
  id: number;
  role: "user" | "emma";
  content: string;
};

type ChatResponse = {
  reply?: string;
  trigger?: string;
  changes?: EmotionChanges;
  error?: string;
};

export default function ChatPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "emma",
      content: "Connection established....",
    },
  ]);

  const [input, setInput] = useState("");
  const [emma, setEmma] = useState<EmotionState>(() => resetEmotions());
  const [crashMessage, setCrashMessage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [lastTrigger, setLastTrigger] = useState("NONE");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);

  // Scroll only the chat container, not the entire page.
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, isThinking]);

  function changeEmotion(emotion: Emotion, amount: number) {
    if (emma.crashed || requestInProgress.current) return;

    const next = updateEmotions(emma, { [emotion]: amount });
    setEmma(next);

    if (next.crashed) {
      setCrashMessage(next.status ?? "EMMA CRASHED");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content || emma.crashed || requestInProgress.current) return;

    requestInProgress.current = true;
    setIsThinking(true);
    setInput("");

    const previousMessages = messages;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
    };

    setMessages((previous) => [...previous, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          levels: emma.levels,
          history: previousMessages.slice(-8).map((message) => ({
            role: message.role === "emma" ? "assistant" : "user",
            content: message.content,
          })),
        }),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok || typeof data.reply !== "string") {
        throw new Error(data.error ?? "Mistral returned an invalid reply.");
      }

      const next = updateEmotions(emma, data.changes ?? {});

      setEmma(next);
      setLastTrigger(data.trigger ?? "NONE");

      if (next.crashed) {
        setCrashMessage(next.status ?? "EMMA CRASHED");
        return;
      }

      const emmaMessage: Message = {
        id: userMessage.id + 1,
        role: "emma",
        content: data.reply,
      };

      setMessages((previous) => [...previous, emmaMessage]);
    } catch (error) {
      console.error("EMMA request failed:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: userMessage.id + 1,
          role: "emma",
          content: "[ CONNECTION ERROR ] Unable to generate a response.",
        },
      ]);
    } finally {
      requestInProgress.current = false;
      setIsThinking(false);
    }
  }

  function disconnect() {
    router.push("/");
  }

  return (
    <main className="site">
      <header className="topbar">
        <span>EMMA (TM) &nbsp; COPYRIGHT 2026 &nbsp; BUILT BY ZEE</span>

        <nav>
          <Link href="/">[ HOME ]</Link>
        </nav>
      </header>

      <div className="panels">
        {/* LEFT PANEL: CHAT */}
        <section className="panel intro chat-panel">
          <div className="boot">
            &gt; BOOTING EMMA.EXE<br />
            &gt; LOADING INTERFACE...<br />
            &gt; INITIALIZING CONVERSATION MODULE...<br />
            &gt; READY.<br />
            <br />
            &gt; CONNECTION ESTABLISHED.
          </div>

          {emma.crashed ? (
            <div className="chat-crash">
              <h2>EMMA CRASHED.</h2>
              <p>{crashMessage}</p>
              <p>&gt; CONNECTION TERMINATED.</p>

              <button className="connect" onClick={disconnect}>
                &gt; RETURN TO DISCONNECTED STATE
              </button>
            </div>
          ) : (
            <>
              <div className="chat-messages" aria-label="Conversation">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${
                      message.role === "user"
                        ? "chat-message-user"
                        : "chat-message-emma"
                    }`}
                  >
                    <span className="chat-message-label">
                      {message.role === "user" ? "YOU" : "EMMA"}
                    </span>

                    <p>{message.content}</p>
                  </div>
                ))}

                {isThinking && (
                  <div className="chat-message chat-message-emma">
                    <span className="chat-message-label">EMMA</span>
                    <p>[ she is typing... ]</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form className="chat-form" onSubmit={handleSubmit}>
                <span aria-hidden="true">&gt;</span>

                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    isThinking ? "EMMA IS THINKING..." : "ENTER MESSAGE..."
                  }
                  aria-label="Message EMMA"
                  disabled={isThinking}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                >
                  [ SEND ]
                </button>
              </form>
            </>
          )}

          <div className="status chat-footer">
            STATUS: {emma.crashed ? "DISCONNECTED" : "CONNECTED"}
            <br />
            USER: properly momo
            <br />
            SYSTEM: EMMA v1.0.0
          </div>
        </section>

        {/* RIGHT PANEL: EMMA */}
        <section className="panel portrait">
          <div className="portrait-caption">
            // Here
            <br />
            // Is
            <br />
            // YOUR EMO
            <br />
            // GF or ex-GF?
          </div>

          {!emma.crashed && (
            <div
              className={`pixel-face emotion-${emma.expression}`}
              role="img"
              aria-label={`EMMA's expression: ${emma.expression}`}
            >
              <div className="eye left-eye" />
              <div className="eye right-eye" />
              <div className="mouth" />
            </div>
          )}

          {emma.crashed && (
            <div className="portrait-crash">
              [ SIGNAL LOST ]
              <br />
              EMMA.EXE STOPPED
            </div>
          )}

          <div className="portrait-footer chat-portrait-footer">
            <div>
              {emma.crashed
                ? "CONNECTION LOST"
                : `EXPRESSION: ${emma.expression.toUpperCase()}`}
            </div>

            {!emma.crashed && (
              <>
                <div className="emotion-status">
                  {emma.status ?? "NO EMOTIONAL CHANGE"}
                </div>

                {/* Temporary controls for testing */}
                <div className="emotion-debug">
                  <div className="debug-heading">[ EMOTION PANEL ]</div>

                  <div className="debug-row">
                    {/* <span>LAST TRIGGER:</span>
                    <span>{lastTrigger}</span> */}
                  </div>

                  {EMOTIONS.map((emotion) => (
                    <div className="debug-row" key={emotion}>
                      <span>
                        {emotion.toUpperCase()}: {emma.levels[emotion]}
                      </span>

                      {/* <div className="debug-buttons">
                        <button
                          onClick={() => changeEmotion(emotion, -1)}
                          disabled={isThinking}
                          aria-label={`Decrease ${emotion}`}
                        >
                          −
                        </button>

                        <button
                          onClick={() => changeEmotion(emotion, 1)}
                          disabled={isThinking}
                          aria-label={`Increase ${emotion}`}
                        >
                          +
                        </button>
                      </div> */}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}