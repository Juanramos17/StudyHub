import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import ShinyText from '@/components/reactBits/ShinyText/ShinyText';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // O la ruta correcta a tu archivo con los componentes personalizados

type RegisterForm = {
  rol: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    rol: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="flex h-screen">
      {/* Imagen lado izquierdo, solo visible en lg y arriba */}
      <div className="hidden h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#1E1E2F] to-[#1E1E2F] lg:flex">
        <img
          src="https://res.cloudinary.com/dbw3utkij/image/upload/v1747407262/fondo-login_i1jif1.jpg"
          alt="Logo"
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Contenedor formulario lado derecho */}
      <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden dark:bg-[#02040b] lg:w-1/2">
        {/* Contenedor scroll interno */}
        <div className="flex max-h-full w-full max-w-md flex-col overflow-auto p-6">
          <AuthLayout title="Registrate en StudyHub" description="Ingrese sus datos para crear su cuenta">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
              <div className="grid gap-6">
                <div className="text-primary/60 grid gap-2">
                  <Label htmlFor="rol">
                    <ShinyText text="¿Que eres?" disabled={false} speed={3} className="custom-class" />
                  </Label>
                  <Select value={data.rol} onValueChange={(valor) => setData('rol', valor)} disabled={processing}>
                    <SelectTrigger tabIndex={1}>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante</SelectItem>
                      <SelectItem value="teacher">Profesor</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.rol} className="mt-2" />
                </div>

                <div className="text-primary/60 grid gap-2">
                  <Label htmlFor="name">
                    <ShinyText text="Nombre" disabled={false} speed={3} className="custom-class" />
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    placeholder="Nombre completo"
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="text-primary/60 grid gap-2">
                  <Label htmlFor="email">
                    <ShinyText text="Correo electronico" disabled={false} speed={3} className="custom-class" />
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="email@example.com"
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="text-primary/60 grid gap-2">
                  <Label htmlFor="password">
                    <ShinyText text="Contraseña" disabled={false} speed={3} className="custom-class" />
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    disabled={processing}
                    placeholder="Contraseña"
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="text-primary/60 grid gap-2">
                  <Label htmlFor="password_confirmation">
                    <ShinyText text="Confirmar contraseña" disabled={false} speed={3} className="custom-class" />
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    disabled={processing}
                    placeholder="Confirmar contraseña"
                  />
                  <InputError message={errors.password_confirmation} />
                </div>

                <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Crear cuenta
                </Button>
              </div>

              <div className="text-muted-foreground text-center text-sm">
                ¿Ya tienes una cuenta?{' '}
                <TextLink href={route('login')} tabIndex={6}>
                  Iniciar sesión
                </TextLink>
              </div>
            </form>
          </AuthLayout>
        </div>
      </div>
    </div>
  );
}
