import React, { createContext, useState, useContext, useEffect } from 'react';
import { ChatSession, Message } from './types';
import { useAuth } from './auth-context';

type ChatContextType = {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  createSession: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, getApiKey } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Cargar sesiones desde localStorage
      const storedSessions = localStorage.getItem(`chat_sessions_${user.id}`);
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        
        // Restaurar la sesión actual si existe
        const lastSessionId = localStorage.getItem(`current_session_${user.id}`);
        if (lastSessionId) {
          const lastSession = parsedSessions.find((s: ChatSession) => s.id === lastSessionId);
          if (lastSession) {
            setCurrentSession(lastSession);
          } else if (parsedSessions.length > 0) {
            setCurrentSession(parsedSessions[0]);
          }
        } else if (parsedSessions.length > 0) {
          setCurrentSession(parsedSessions[0]);
        }
      } else if (sessions.length === 0) {
        // Crear una sesión inicial si no hay ninguna
        createNewSession();
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && sessions.length > 0) {
      // Guardar sesiones cuando cambien
      localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(sessions));
    }
  }, [sessions, user]);

  useEffect(() => {
    if (user && currentSession) {
      // Guardar el ID de la sesión actual
      localStorage.setItem(`current_session_${user.id}`, currentSession.id);
    }
  }, [currentSession, user]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Math.random().toString(36).substring(2, 9)}`,
      title: `Nueva conversación ${new Date().toLocaleTimeString()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    return newSession;
  };

  const createSession = () => {
    createNewSession();
  };

  const selectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSession(session);
    }
  };

  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);

    if (currentSession?.id === id) {
      setCurrentSession(updatedSessions.length > 0 ? updatedSessions[0] : null);
    }
  };

  const updateSessionTitle = (sessionId: string, messages: Message[]) => {
    // Actualizar el título basado en el contenido de los mensajes
    if (messages.length >= 2) {
      const userMessage = messages.find(m => m.role === 'user')?.content || '';
      const title = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
      
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          return { ...s, title };
        }
        return s;
      }));
    }
  };

  const sendMessage = async (content: string) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Crear una nueva sesión si no hay ninguna activa
      let session = currentSession;
      if (!session) {
        session = createNewSession();
      }

      // Agregar mensaje del usuario
      const userMessage: Message = {
        id: `msg_${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Actualizar sesión con el nuevo mensaje
      const updatedMessages = [...(session.messages || []), userMessage];
      const updatedSession = {
        ...session,
        messages: updatedMessages,
        updatedAt: new Date(),
      };

      // Actualizar estado
      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s => (s.id === session?.id ? updatedSession : s)));

      // En una app real, aquí llamaríamos a la API de OpenAI
      const apiKey = getApiKey(); // Usa la clave API del usuario o la predeterminada
      
      // Simulación de llamada a la API de OpenAI
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Respuesta simulada (en una app real sería la respuesta de la API)
      const assistantMessage: Message = {
        id: `msg_${Math.random().toString(36).substring(2, 9)}`,
        role: 'assistant',
        content: `Esta es una respuesta simulada a: "${content}".\n\nEn una implementación real, usaría la API de OpenAI con la clave: ${apiKey.substring(0, 5)}...`,
        timestamp: new Date(),
      };

      // Actualizar con la respuesta
      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
        updatedAt: new Date(),
      };

      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => (s.id === session?.id ? finalSession : s)));

      // Actualizar título si es necesario
      updateSessionTitle(session.id, finalMessages);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        sessions, 
        currentSession, 
        createSession, 
        selectSession, 
        deleteSession, 
        sendMessage, 
        isLoading 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};
