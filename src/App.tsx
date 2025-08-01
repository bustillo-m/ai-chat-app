import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth-context';
import { ChatProvider } from '@/lib/chat-context';

import HomePage from '@/pages/Home';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/Register';
import ChatPage from '@/pages/Chat';
import PricingPage from '@/pages/Pricing';
import SettingsPage from '@/pages/Settings';
import NotFoundPage from '@/pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}
