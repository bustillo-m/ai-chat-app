import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-7xl font-bold text-primary-500">404</div>
      <h1 className="text-2xl font-bold mt-4">Página no encontrada</h1>
      <p className="text-muted-foreground text-center mt-2 max-w-md">
        La página que estás buscando no existe o ha sido movida.
      </p>
      <div className="mt-8 space-x-4">
        <Button onClick={() => navigate(-1)}>Volver atrás</Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          Ir al inicio
        </Button>
      </div>
    </div>
  );
}
