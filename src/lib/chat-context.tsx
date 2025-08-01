import React, { createContext, useState, ReactNode } from 'react';
import { Message, ChatSession } from './types';
import { useAuth } from './use-auth';

export type ChatContextType = {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  createSession: () => ChatSession;
  selectSession: (sessionId: string | null) => void;
  deleteSession: (sessionId: string) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, getApiKey } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSession = () => {
    const newSession: ChatSession = {
      id: `session_${Math.random().toString(36).substring(2, 9)}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    return newSession;
  };

  const selectSession = (sessionId: string | null) => {
    if (!sessionId) {
      setCurrentSession(null);
      return;
    }
    const session = sessions.find(s => s.id === sessionId);
    setCurrentSession(session || null);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      let session = currentSession;
      if (!session) {
        session = createSession();
      }

      const userMessage: Message = {
        id: `msg_${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      const updatedMessages = [...(session.messages || []), userMessage];
      const updatedSession = {
        ...session,
        messages: updatedMessages,
        updatedAt: new Date(),
      };

      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s => (s.id === session?.id ? updatedSession : s)));

      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const apiKey = getApiKey();

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful, friendly, and accurate virtual assistant. Respond concisely and clearly.'
              },
              ...apiMessages
            ],
            temperature: 0.7,
            max_tokens: 1000,
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        const assistantResponse = data.choices[0].message.content;

        const assistantMessage: Message = {
          id: `msg_${Math.random().toString(36).substring(2, 9)}`,
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date(),
        };

        const finalUpdatedMessages = [...updatedMessages, assistantMessage];
        const finalUpdatedSession = {
          ...updatedSession,
          messages: finalUpdatedMessages,
        };

        setCurrentSession(finalUpdatedSession);
        setSessions(prev => prev.map(s => (s.id === session?.id ? finalUpdatedSession : s)));

      } catch (error) {
        console.error('Error calling OpenAI:', error);
        const errorMessage: Message = {
            id: `msg_${Math.random().toString(36).substring(2, 9)}`,
            role: 'assistant',
            content: "Sorry, I couldn't process your request at the moment.",
            timestamp: new Date(),
            isError: true,
        };
        const finalUpdatedMessages = [...updatedMessages, errorMessage];
        const finalUpdatedSession = {
          ...updatedSession,
          messages: finalUpdatedMessages,
        };
        setCurrentSession(finalUpdatedSession);
        setSessions(prev => prev.map(s => (s.id === session?.id ? finalUpdatedSession : s)));
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ sessions, currentSession, isLoading, sendMessage, createSession, selectSession, deleteSession }}>
      {children}
    </ChatContext.Provider>
  );
};
