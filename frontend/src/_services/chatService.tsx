// _services/chatService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/chat/messages';

interface MessagePayload {
  conversation_id: string;
  request: string;
  response: string;
  error: string;
  status: string;
  updated_timestamp: string;
}

interface MessageResponse extends MessagePayload {
  id: number;
}

export const postMessage = async (data: MessagePayload): Promise<MessageResponse> => {
  try {
    const response = await axios.post<MessageResponse>(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting message:', error);
    throw error;
  }
};
