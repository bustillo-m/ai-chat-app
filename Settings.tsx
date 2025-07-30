import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/main-layout';

export default function SettingsPage() {
  const { user, updateApiKey, getApiKey, signOut } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Inicializar valores
    setName(user.name || '');
    setEmail(user.email || '');
    setApiKey(getApiKey().replace(/./g, '•')); // Mostrar el valor oculto
  }, [user, navigate, getApiKey]);

  const handleSaveApiKey = () => {
    // No guardar si está enmascarado con puntos
    if (apiKey.includes('•')) {
      toast.error('Por favor, introduce una nueva clave de API');
      return;
    }

    updateApiKey(apiKey);
    toast.success('Clave API guardada correctamente');
    setApiKey(apiKey.replace(/./g, '•')); // Enmascarar después de guardar
  };

  const handleSaveProfile = () => {
    // Aquí implementarías la lógica para actualizar el perfil
    // Por ahora solo mostramos un toast
    toast.success('Perfil actualizado correctamente');
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  if (!user) {
    return null; // O un mensaje de carga
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Configuración</h1>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información del perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y preferencias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </div>
                <div className="pt-2">
                  <Button onClick={handleSaveProfile}>Guardar cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de API</CardTitle>
                <CardDescription>
                  Gestiona tu clave API de OpenAI. Esta aplicación ya incluye una clave API por defecto, 
                  pero puedes usar la tuya propia para mayor personalización.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">Clave API de OpenAI</Label>
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    type="password"
                  />
                  <p className="text-sm text-muted-foreground">
                    Si dejas este campo vacío, se usará la clave API por defecto.
                  </p>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSaveApiKey}>Guardar clave API</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Cuenta</CardTitle>
                <CardDescription>
                  Gestiona tu suscripción y configura la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg">Plan actual</h3>
                  <p className="text-muted-foreground">
                    Actualmente estás en el plan <span className="font-medium text-primary">{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" onClick={() => navigate('/pricing')}>
                      Ver planes disponibles
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg text-destructive">Zona de peligro</h3>
                  <p className="text-muted-foreground mb-2">
                    Estas acciones son permanentes y no se pueden deshacer
                  </p>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button variant="destructive" onClick={handleLogout}>
                      Cerrar sesión
                    </Button>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Eliminar cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
