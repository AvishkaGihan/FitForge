import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { ChatMessage } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await api.getChatMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(content: string) {
    setSending(true);

    // Optimistic update
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      user_id: 'current',
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await api.sendChatMessage(content);

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        user_id: 'current',
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      const error = err as { message?: string };
      throw new Error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  return { messages, loading, sending, sendMessage, refresh: loadMessages };
}
