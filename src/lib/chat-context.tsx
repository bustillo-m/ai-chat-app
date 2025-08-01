// Dentro de ChatProvider en chat-context.tsx

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

    // Preparar mensajes para la API de OpenAI
    const apiMessages = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Obtener la clave API
    const apiKey = getApiKey();
    
    try {
      // Llamada a la API de OpenAI
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
              content: 'Eres un asistente virtual útil, amigable y preciso. Responde de manera concisa y clara.'
            },
            ...apiMessages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extraer la respuesta
      const assistantResponse = data.choices[0].message.content;
      
      // Crear mensaje del asistente
      const assistantMessage: Message = {
