"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Asset, AssetClass, FloorState, Vision } from "@/lib/types/forge";
import type { ChatMessage } from "@/lib/ai/chat-provider";
import {
  executeForgeActions,
  parseForgeActions,
  stripForgeActionsBlock,
} from "@/lib/forge/mentor-actions";

interface UiMessage extends ChatMessage {
  id: string;
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface MentorShellProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  // Forge context (primary)
  assets: Asset[];
  visions: Vision[];
  floor: FloorState;
  selectedAssetId: string | null;
  // Forge action handlers
  onUpdateAsset: (id: string, patch: Partial<Asset>) => void | Promise<void>;
  onCreateAsset: (input: {
    name: string;
    assetClass?: AssetClass;
    mandateText?: string;
    visionIds?: string[];
  }) => Promise<Asset>;
  onSelectAsset: (asset: Asset) => void;
  onUpdateFloor: (floor: FloorState) => void;
  onUpdateVision: (id: string, patch: Partial<Vision>) => void | Promise<void>;
  // Optional: route awareness for context prioritization
  currentRoute?: string;
  focus?: "forge" | "chronicle" | "archive" | "brainbox" | "general";
}

const STORAGE_KEY = "unified-mentor-chat";

interface StoredChat {
  messages: ChatMessage[];
  updatedAt: string;
}

function loadChat(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as StoredChat;
    return data.messages ?? [];
  } catch {
    return [];
  }
}

function saveChat(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredChat = {
      messages: messages.slice(-40),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

function clearChat() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function MentorShell({
  isOpen,
  onClose,
  isMobile,
  assets,
  visions,
  floor,
  selectedAssetId,
  onUpdateAsset,
  onCreateAsset,
  onSelectAsset,
  onUpdateFloor,
  onUpdateVision,
  currentRoute = "forge",
  focus = "forge",
}: MentorShellProps) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMessages(loadChat().map((m) => ({ ...m, id: newId() })));
    fetch("/api/mentor/chat")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setProvider(data.provider ?? null);
      })
      .catch(() => setConfigured(false));
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const persist = (next: UiMessage[]) => {
    saveChat(next.map(({ role, content }) => ({ role, content })));
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");

    const userMsg: UiMessage = { id: newId(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    persist(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages
            .slice(0, -1)
            .map(({ role, content }) => ({ role, content })),
          forge: {
            assets,
            visions,
            floor,
            selectedAssetId,
          },
          includeLifeContext: true,
          currentRoute,
          focus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Mentor request failed.");
      }

      const actions = parseForgeActions(data.reply);
      const visible = stripForgeActionsBlock(data.reply);

      if (actions.length > 0) {
        await executeForgeActions(actions, {
          assets,
          onUpdateAsset,
          onCreateAsset,
          onSelectAsset,
          onUpdateFloor,
          onUpdateVision,
        });
      }

      const assistantMsg: UiMessage = {
        id: newId(),
        role: "assistant",
        content: visible || "Done.",
      };
      const withReply = [...nextMessages, assistantMsg];
      setMessages(withReply);
      persist(withReply);
      if (data.provider) setProvider(data.provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
    if (e.key === "Escape") onClose();
  };

  const panelWidth = isMobile ? "calc(100vw - 24px)" : 400;
  const panelHeight = isMobile ? "calc(100vh - 100px)" : 520;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mentor-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(3px)",
            }}
          />

          <motion.aside
            key="mentor-panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "fixed",
              right: isMobile ? 12 : 20,
              bottom: isMobile ? 12 : 20,
              width: panelWidth,
              height: panelHeight,
              zIndex: 95,
              display: "flex",
              flexDirection: "column",
              background: "#080810",
              border: "0.5px solid rgba(232,255,71,0.25)",
              boxShadow: "0 0 48px rgba(232,255,71,0.08)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              style={{
                padding: "12px 14px",
                borderBottom: "0.5px solid #1A1A24",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 9,
                    color: "#E8FF47",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  // mentor.ai
                </p>
                <h2
                  style={{
                    margin: "4px 0 0",
                    fontFamily: "var(--font-syne)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#F5F5F0",
                  }}
                >
                  Forge Mentor
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: 9, color: "#444440" }}>
                  {configured === false
                    ? "Add GROQ_API_KEY or GEMINI_API_KEY"
                    : provider
                      ? `via ${provider} · ${assets.length} assets`
                      : `${assets.length} assets · floor ${floor.peace}/${floor.sovereignty}`}
                </p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => {
                    clearChat();
                    setMessages([]);
                    setError(null);
                  }}
                  style={{
                    fontSize: 9,
                    color: "#444440",
                    background: "none",
                    border: "0.5px solid #222220",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close mentor"
                  style={{
                    width: 28,
                    height: 28,
                    background: "none",
                    border: "0.5px solid #222220",
                    color: "#888884",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ×
                </button>
              </div>
            </header>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {messages.length === 0 && (
                <div style={{ fontSize: 12, color: "#888884", lineHeight: 1.6 }}>
                  <p style={{ margin: "0 0 12px" }}>
                    Ask about mandates, allocation, floor stability, or vision
                    alignment. I can update assets, actions, and floor signals
                    when you ask.
                  </p>
                  {[
                    "Which Class A asset needs attention?",
                    "Mark AutoDrive mandate progress to 70%",
                    "Add action: ship onboarding v2 to AutoDrive",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        marginBottom: 6,
                        padding: "8px 10px",
                        fontSize: 10,
                        color: "#555550",
                        background: "#0A0A12",
                        border: "0.5px solid #1A1A24",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ textAlign: msg.role === "user" ? "right" : "left" }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      maxWidth: "92%",
                      padding: "8px 10px",
                      fontSize: 12,
                      lineHeight: 1.55,
                      whiteSpace: "pre-wrap",
                      textAlign: "left",
                      color: msg.role === "user" ? "#F5F5F0" : "#A8A8A4",
                      background:
                        msg.role === "user"
                          ? "rgba(232,255,71,0.08)"
                          : "#0D0D14",
                      border: `0.5px solid ${msg.role === "user" ? "rgba(232,255,71,0.2)" : "#1A1A24"}`,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <p style={{ fontSize: 10, color: "#444440", margin: 0 }}>
                  Thinking...
                </p>
              )}
              {error && (
                <p style={{ fontSize: 11, color: "#ef4444", margin: 0 }}>
                  {error}
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            <div
              style={{
                padding: 10,
                borderTop: "0.5px solid #1A1A24",
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                flexShrink: 0,
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Command the forge..."
                disabled={loading || configured === false}
                style={{
                  flex: 1,
                  resize: "none",
                  background: "#0D0D14",
                  border: "0.5px solid #1A1A24",
                  color: "#F5F5F0",
                  fontSize: 12,
                  padding: "8px 10px",
                  outline: "none",
                  fontFamily: "var(--font-jetbrains-mono)",
                  opacity: configured === false ? 0.5 : 1,
                }}
              />
              <button
                onClick={() => void send()}
                disabled={loading || !input.trim() || configured === false}
                style={{
                  padding: "10px 14px",
                  background: input.trim()
                    ? "rgba(232,255,71,0.12)"
                    : "#0A0A0A",
                  border: `0.5px solid ${input.trim() ? "rgba(232,255,71,0.35)" : "#111118"}`,
                  color: input.trim() ? "#E8FF47" : "#333330",
                  fontSize: 11,
                  cursor: input.trim() ? "pointer" : "default",
                  fontFamily: "var(--font-jetbrains-mono)",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Send
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Floating Action Button
export function MentorFab({
  isOpen,
  onToggle,
  isMobile,
}: {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) {
  if (isOpen) return null;

  return (
    <button
      onClick={onToggle}
      style={{
        position: "fixed",
        right: isMobile ? 14 : 20,
        bottom: isMobile ? 14 : 20,
        zIndex: 85,
        padding: "10px 16px",
        background: "rgba(232,255,71,0.1)",
        border: "0.5px solid rgba(232,255,71,0.35)",
        color: "#E8FF47",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: 10,
        letterSpacing: "0.08em",
        cursor: "pointer",
        boxShadow: "0 0 24px rgba(232,255,71,0.12)",
      }}
    >
      AI Mentor
    </button>
  );
}
