// Define tipos para la aplicación
export type User = {
  id: string;
  email: string;
  apiKey?: string;
  name?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  createdAt: Date;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
};
