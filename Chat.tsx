import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useChat } from '@/lib/chat-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Send, Trash } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const { 
    sessions, 
    currentSession, 
    createSession, 
    selectSession, 
    deleteSession, 
    sendMessage, 
    isLoading 
  } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();
    
    if (message) {
      sendMessage(message);
      input.value = '';
    }
  };

  if (!user) {
    return null; // O un mensaje de carga
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={createSession}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva conversación
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {sessions.map(session => (
            <div 
              key={session.id} 
              className={`p-2 m-2 rounded cursor-pointer flex justify-between items-center ${
                currentSession?.id === session.id ? 'bg-primary-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => selectSession(session.id)}
            >
              <span className="truncate">{session.title}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            <ScrollArea className="flex-1 p-4">
              {currentSession.messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Comienza una nueva conversación</h3>
                    <p className="text-muted-foreground">
                      Escribe tu primer mensaje para iniciar la conversación
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentSession.messages.map(message => (
                    <div 
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary-100 ml-12' 
                          : 'bg-gray-100 mr-12'
                      }`}
                    >
                      <div className="font-medium mb-1">
                        {message.role === 'user' ? 'Tú' : 'Asistente'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="p-4 rounded-lg bg-gray-100 mr-12 animate-pulse">
                      <div className="font-medium mb-1">Asistente</div>
                      <div>Pensando...</div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            <Separator />
            <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
              <Input 
                name="message"
                placeholder="Escribe un mensaje..."
                disabled={isLoading}
                className="flex-1"
                autoComplete="off"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Button onClick={createSession}>Iniciar una conversación</Button>
          </div>
        )}
      </div>
    </div>
  );
}
