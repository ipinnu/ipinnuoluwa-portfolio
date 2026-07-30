import type { ChatMessage } from "@/lib/ai/chat-provider";

const STORAGE_KEY = "forge-mentor-chat";

interface StoredChat {
  messages: ChatMessage[];
  updatedAt: string;
}

export function loadForgeMentorChat(): ChatMessage[] {
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

export function saveForgeMentorChat(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredChat = {
      messages: messages.slice(-40),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function clearForgeMentorChat() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
