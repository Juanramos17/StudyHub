import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import ShinyText from '@/components/reactBits/ShinyText/ShinyText';


type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (

        <div className='flex h-screen'>
            
            <div className="hidden lg:flex h-screen bg-gradient-to-b from-[#1E1E2F] to-[#1E1E2F] w-full flex-col justify-center items-center">
                <img
                    src="https://res.cloudinary.com/dbw3utkij/image/upload/v1747407262/fondo-login_i1jif1.jpg"
                    alt="Logo"
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
            </div>


            <div className=" dark:bg-[#02040b] w-full h-screen flex flex-col justify-center items-center lg:w-1/2">

                <div className='height-screen w-full flex flex-col justify-center items-center'>

                    <AuthLayout title="Iniciar sesion en StudyHub" description="Ingrese su correo electrónico y contraseña a continuación para iniciar sesión" >
                
                    <Head  title="Log in" />

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2 text-primary/60">
                                <Label htmlFor="email"><ShinyText text="Correo electronico" disabled={false} speed={3} className='custom-class' /></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center text-primary/60">
                                    <Label htmlFor="password"><ShinyText text="Contraseña" disabled={false} speed={3} className='custom-class' /></Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                            ¿Has olvidado tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember"><ShinyText text="Recordar contraseña" disabled={false} speed={3} className='custom-class' /></Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Iniciar sesión
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            ¿No tienes una cuenta?{' '}
                            <TextLink href={route('register')} tabIndex={5}>
                                Registrarse
                            </TextLink>
                        </div>
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </AuthLayout>

                </div>
            
            </div>

        </div>
    );
}
