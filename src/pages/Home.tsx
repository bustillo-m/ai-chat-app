import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';
import { MessageSquare, Zap, ShieldCheck, Users } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'Conversaciones inteligentes',
      description: 'Chatea con una IA avanzada que aprende y recuerda tus conversaciones anteriores.'
    },
    {
      icon: Zap,
      title: 'Respuestas rápidas',
      description: 'Obtén respuestas instantáneas a tus preguntas, sin importar su complejidad.'
    },
    {
      icon: ShieldCheck,
      title: 'Privacidad garantizada',
      description: 'Tus conversaciones están seguras y protegidas. Nunca compartimos tus datos.'
    },
    {
      icon: Users,
      title: 'Colaboración',
      description: 'Comparte conversaciones y colabora con tu equipo en tiempo real.'
    }
  ];

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Conversaciones inteligentes con <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-transparent bg-clip-text">IA avanzada</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Experimenta el poder de la inteligencia artificial en tus conversaciones diarias con nuestra plataforma de chat avanzada
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate('/chat')}>
              Comenzar a chatear
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              Ver planes
            </Button>
          </div>
          
          <div className="mt-16 relative">
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <img 
                src="https://placehold.co/1200x700/e6e7ff/6366f1?text=Vista+previa+del+chat&font=roboto"
                alt="Vista previa de la aplicación"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Características principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg">
                  <div className="p-3 rounded-full bg-primary-50 mb-4">
                    <Icon className="h-6 w-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-500 py-16 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están experimentando el futuro de las conversaciones inteligentes.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            Regístrate ahora
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
