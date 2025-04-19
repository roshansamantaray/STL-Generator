// _store/chatStore.tsx
import { create } from 'zustand';

interface Message {
  id: number;
  conversation_id: string;
  request: string;
  response: string;
  error: string;
  status: string;
  updated_timestamp: string;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: number, updatedMessage: Partial<Message>) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateMessage: (id, updatedMessage) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updatedMessage } : msg
      ),
    })),
}));

export default useChatStore;
