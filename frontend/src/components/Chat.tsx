// components/Chat.tsx
import { useState } from 'react';
import useChatStore from '@/_store/chatStore';
import { postMessage } from '@/_services/chatService';

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const { messages, addMessage, updateMessage } = useChatStore();

  const handleSendMessage = async () => {
    const tempId = Date.now(); // Temporary ID for optimistic update
    const newMessage = {
      id: tempId,
      conversation_id: '3cf3409a-6bfc-4d89-9f3b-f4fc75f55837',
      request: input,
      response: '',
      error: '',
      status: 'pending',
      updated_timestamp: new Date().toISOString(),
    };

    // Optimistic update
    addMessage(newMessage);

    try {
      const response = await postMessage(newMessage);
      updateMessage(tempId, { ...response });
    } catch (error) {
      updateMessage(tempId, { status: 'error', error: String(error) });
    }

    setInput(''); // Clear input
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>Request: {msg.request}</p>
            <p>Response: {msg.response || '...'}</p>
            <p>Status: {msg.status}</p>
            <p>Error: {msg.error}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
