import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';

const pricingPlans = [
  {
    id: 'free',
    name: 'Freemium',
    price: 0,
    description: 'Ideal para probar nuestra aplicación',
    features: [
      'Acceso básico al chat con IA',
      '5 conversaciones guardadas',
      'Uso limitado a 50 mensajes/día',
      'Soporte por email'
    ],
    recommended: false
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    description: 'Para uso regular individual',
    features: [
      'Conversaciones ilimitadas',
      'Uso diario ilimitado',
      'Acceso a todas las características básicas',
      'Sin marcas de agua',
      'Soporte prioritario'
    ],
    recommended: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    description: 'Para profesionales y equipos pequeños',
    features: [
      'Todo lo incluido en Starter',
      'Integración con otras plataformas',
      'Análisis avanzado de datos',
      'Herramientas de colaboración',
      'Soporte 24/7'
    ],
    recommended: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    description: 'Soluciones personalizadas para grandes equipos',
    features: [
      'Todo lo incluido en Pro',
      'Configuración personalizada',
      'API dedicada',
      'Formación y onboarding',
      'Gestor de cuenta dedicado'
    ],
    recommended: false
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    if (!user) {
      navigate('/login', { state: { redirect: '/pricing', plan: planId } });
      return;
    }
    
    // Aquí implementarías la lógica de suscripción
    console.log(`Suscripción al plan: ${planId}`);
  };

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Planes y Precios</h1>
        <p className="text-muted-foreground">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPlans.map(plan => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${
              plan.recommended ? 'border-primary-500 border-2' : ''
            }`}
          >
            {plan.recommended && (
              <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                Recomendado
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${
                  plan.recommended ? 'bg-primary-500 hover:bg-primary-600' : ''
                }`}
                onClick={() => handleSubscribe(plan.id)}
              >
                {user ? 'Suscribirse' : 'Empezar'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">¿Necesitas una solución personalizada?</h2>
        <Button variant="outline" size="lg">
          Contactar con ventas
        </Button>
      </div>
    </div>
  );
}
