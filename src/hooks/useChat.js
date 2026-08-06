/**
 * Chat Hook
 * Manages chat state and message operations
 */

import { useState, useCallback, useEffect } from 'react';
import { askQuestion } from '../services/api';
import { getChatHistory, saveChatHistory, clearChatHistory, incrementQuestionsAsked, addTokensUsed } from '../utils/storage';
import toast from 'react-hot-toast';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load chat history on mount
  useEffect(() => {
    const history = getChatHistory();
    setMessages(history);
  }, []);

  const sendMessage = useCallback(async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await askQuestion(question);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toISOString(),
        model: response.model,
        tokensUsed: response.tokensUsed,
      };

      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        saveChatHistory(updated);
        return updated;
      });
      
      // Update stats
      incrementQuestionsAsked();
      if (response.tokensUsed) {
        addTokensUsed(response.tokensUsed);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      
      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    clearChatHistory();
    toast.success('Chat cleared');
  }, []);

  const deleteMessage = useCallback((messageId) => {
    setMessages(prev => {
      const updated = prev.filter(msg => msg.id !== messageId);
      saveChatHistory(updated);
      return updated;
    });
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    deleteMessage,
  };
};
