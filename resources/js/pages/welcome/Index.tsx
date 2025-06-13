import BlurText from '@/components/reactBits/BlurText/BlurText';
import GlitchText from '@/components/reactBits/GlitchText/GlitchText';
import GridDistortion from '@/components/reactBits/GridDistortion/GridDistortion';
import Particles from '@/components/reactBits/Particles/Particles';
import RotatingText from '@/components/reactBits/RotatingText/RotatingText';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import './css/welcome.css';
import Footer from '@/layouts/app/footer-layout';

export default function Index() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <main className="bg-[#02040b] w-full min-h-screen overflow-x-hidden">
                <Head title="Página de bienvenida" />

                {loading ? (
                    <div className="animate-color-change flex h-screen w-full flex-col items-center justify-center">
                        <img
                            src="https://res.cloudinary.com/dbw3utkij/image/upload/v1747409087/logocontorno_lbmlyz.png"
                            className="animate-hue-rotate h-30 w-40 opacity-70"
                            alt="Logo"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-start w-full">
                        {/* Botones superiores */}
                        <div className="fixed top-4 right-4 z-50 flex gap-4">
                            <a
                                href="/login"
                                className="rounded-lg border border-white px-4 py-2 text-white backdrop-blur-md transition duration-300 hover:bg-white/10 hover:shadow-[0_0_15px_white]"
                            >
                                Inicia sesión
                            </a>
                            <a
                                href="/register"
                                className="rounded-lg border border-white px-4 py-2 text-white backdrop-blur-md transition duration-300 hover:bg-white/10 hover:shadow-[0_0_15px_white]"
                            >
                                Regístrate
                            </a>
                        </div>

                        {/* Sección de bienvenida */}
                        <div className="relative flex h-screen w-full flex-col items-center justify-center text-center">
                            <div className="absolute inset-0 z-0">
                                <Particles
                                    particleColors={['#ffffff', '#ffffff']}
                                    particleCount={200}
                                    particleSpread={10}
                                    speed={0.2}
                                    particleBaseSize={60}
                                    moveParticlesOnHover={false}
                                    alphaParticles={false}
                                    disableRotation={true}
                                />
                            </div>
                            <div className="z-10">
                                <GlitchText speed={1} enableShadows={true}>
                                    <BlurText
                                        text="      StudyHub      "
                                        delay={250}
                                        animateBy="letters"
                                        direction="top"
                                        className="mb-8"
                                    />
                                </GlitchText>
                            </div>
                        </div>

                        {/* Sección con imagen distorsionada y texto giratorio */}
                        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
                            <GridDistortion
                                imageSrc="https://picsum.photos/1920/1080?grayscale"
                                grid={10}
                                mouse={0.1}
                                strength={0.15}
                                relaxation={0.9}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute z-10 flex flex-wrap items-center justify-center px-4 text-3xl font-bold text-white md:text-5xl text-center">
                                <p>Una forma creativa de </p>&nbsp;
                                <RotatingText
                                    texts={['Aprender', 'Divertirse']}
                                    mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                                    staggerFrom={'last'}
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '-120%' }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                    rotationInterval={2000}
                                />
                            </div>
                        </div>

                        {/* Sección informativa */}
                        <div className="relative w-full overflow-hidden px-4 md:px-10 py-20 text-white">
                            {/* Partículas fondo */}
                            <div className="absolute inset-0 z-0">
                                <Particles
                                    particleColors={['#ffffff', '#ffffff']}
                                    particleCount={200}
                                    particleSpread={10}
                                    speed={0.2}
                                    particleBaseSize={60}
                                    moveParticlesOnHover={false}
                                    alphaParticles={false}
                                    disableRotation={true}
                                />
                            </div>

                            {/* Contenido */}
                            <div className="relative z-10 w-full">
                                <h2 className="mb-12 text-center text-4xl font-bold">¿Qué es StudyHub?</h2>
                                <div className="grid w-full gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Card 1 */}
                                    <div className="rounded-2xl bg-[#111827] p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-cyan-500/30">
                                        <h3 className="mb-3 text-2xl font-semibold text-cyan-400">Aprendizaje Activo</h3>
                                        <p className="text-gray-300">
                                            Apúntate a cursos y realiza los test que quieras para obtener tu diploma de forma más fácil y divertida.
                                        </p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="rounded-2xl bg-[#111827] p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-cyan-500/30">
                                        <h3 className="mb-3 text-2xl font-semibold text-cyan-400">Crea tu cuenta</h3>
                                        <p className="text-gray-300">
                                            Regístrate como <span className="font-medium text-white">estudiante</span> para acceder a cursos,
                                            o como <span className="font-medium text-white">profesor</span> para crear y gestionar tus contenidos.
                                        </p>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="rounded-2xl bg-[#111827] p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-cyan-500/30">
                                        <h3 className="mb-3 text-2xl font-semibold text-cyan-400">Recursos Personalizados</h3>
                                        <p className="text-gray-300">
                                            Accede a recursos adaptados a tu nivel, ritmo y estilo de aprendizaje. StudyHub te acompaña paso a paso.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer></Footer>
                    </div>
                )}
            </main>

        </>
    );
}
