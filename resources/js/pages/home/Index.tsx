interface Props {
    user: any;
    courses: any[];
}

import ShinyText from '@/components/reactBits/ShinyText/ShinyText';
import Footer from '@/layouts/app/footer-layout';
import MenuDesplegable from '@/layouts/app/inicio-header-layout';
import { Head, router } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useRef, useState } from 'react';

export default function Home({ user, courses }: Props) {
    const imagenes = '/img/carrousel1.jpg';

    const cursos = courses.slice(0, 3).map((curso, i) => ({
        id: curso.id,
        titulo: curso.name,
        descripcion: curso.description ?? curso.name,
        img: curso.image !== 'null' && curso.image !== null ? curso.image : imagenes,
    }));

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
        });

        const handleScroll = () => {
            AOS.refresh();
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [indice, setIndice] = useState(0);
    const [fade, setFade] = useState(true);
    const intervaloRef = useRef<NodeJS.Timeout | null>(null);

    const cambiarIndice = (nuevoIndice: number) => {
        setFade(false);
        setTimeout(() => {
            setIndice(nuevoIndice);
            setFade(true);
        }, 500);
    };

    // Reiniciar intervalo cada vez que cambie el índice
    useEffect(() => {
        if (intervaloRef.current) clearInterval(intervaloRef.current);

        intervaloRef.current = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndice((prev) => (prev === cursos.length - 1 ? 0 : prev + 1));
                setFade(true);
            }, 500);
        }, 5000);

        return () => {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        };
    }, [indice]);

    const faqs = [
        {
            question: '¿Qué es StudyHub?',
            answer: 'StudyHub es una plataforma educativa en línea donde puedes aprender mediante cursos interactivos y test.',
        },
        {
            question: '¿Cómo me registro como profesor?',
            answer: 'Al registrarte, puedes seleccionar el rol de profesor. Esto te permitirá crear y gestionar tus propios cursos.',
        },
        {
            question: '¿Los cursos son gratuitos?',
            answer: 'Si, todos los cursos son gratuitos por ahora hasta que se haga la actualización a cursos de pago.',
        },
        {
            question: '¿Cómo obtengo un diploma?',
            answer: 'Para obtener un diploma, debes completar todos los módulos del curso y aprobar los tests requeridos.',
        },
        {
            question: '¿Puedo acceder desde el móvil?',
            answer: 'Sí, StudyHub es completamente responsive y puedes usarlo desde cualquier dispositivo con conexión a internet.',
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCourse = (id: string) => {
            router.get(`/course/${id}`, {
                preserveScroll: true,
            });
        };

    return (
        <>
            <Head title="Home" />
            <header className="sticky top-0 z-50">
                <MenuDesplegable user={user} ></MenuDesplegable>
            </header>

            {/* CONTENIDO */}
            <div className="flex w-full flex-col items-center justify-center px-3 sm:px-6 md:px-10" data-aos="fade-up">
                {/* Bienvenida */}
                <div className="mt-8 flex w-full max-w-4xl flex-col">
                    <h3 className="text-base sm:text-xl md:text-3xl">
                        Hola, <span className="font-bold">{user.name}</span> ¡Elige tu siguiente reto!
                    </h3>
                    <p className="text-primary/60 mt-1 text-xs sm:text-sm md:text-base">
                        <ShinyText text="Muchisimos cursos te estan esperando." disabled={false} speed={5} className="custom-class" />
                    </p>
                </div>

                <div className="relative mt-8 flex w-full max-w-6xl items-center justify-center px-1 select-none sm:px-6">
                    {/* Botón anterior */}
                    <button
                        onClick={() => cambiarIndice(indice === 0 ? cursos.length - 1 : indice - 1)}
                        className="absolute left-0 z-10 ml-1 rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-400"
                        aria-label="Anterior curso"
                        style={{ color: 'white' }}
                    >
                        <div className="text-primary -mt-1 text-xl sm:text-3xl md:text-4xl">‹</div>
                    </button>

                    {/* Contenido carrusel */}
                    <div
                        style={{ backgroundImage: `url(${cursos[indice].img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        className={`mx-2 flex h-56 w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-white via-gray-100 to-gray-200 p-4 text-gray-800 shadow-lg transition-opacity duration-500 sm:mx-12 sm:h-72 sm:p-8 md:h-96 ${
                            fade ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <h3 className="mb-2 text-center text-lg leading-tight font-semibold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] sm:text-3xl md:text-4xl">
                            {cursos[indice].titulo}
                        </h3>
                        <p className="max-w-xl text-center text-xs leading-snug text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] sm:text-base md:text-lg">
                            {cursos[indice].descripcion}
                        </p>
                        <button className="mt-4 rounded-xl bg-yellow-500 px-5 py-1.5 text-sm font-semibold text-black shadow-md transition duration-300 ease-in-out hover:bg-yellow-600 sm:text-base"
                        onClick={() => handleCourse(cursos[indice].id)}
                        >
                            Comenzar curso
                        </button>
                    </div>

                    {/* Botón siguiente */}
                    <button
                        onClick={() => cambiarIndice(indice === cursos.length - 1 ? 0 : indice + 1)}
                        className="absolute right-0 z-10 mr-1 flex items-center rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-400"
                        aria-label="Siguiente curso"
                        style={{ color: 'white' }}
                    >
                        <div className="text-primary -mt-1 text-xl sm:text-3xl md:text-4xl">›</div>
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-1 flex w-full justify-center gap-2">
                        {cursos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => cambiarIndice(i)}
                                className={`h-2 w-2 rounded-full border border-gray-400 transition-colors sm:h-4 sm:w-4 ${
                                    i === indice ? 'bg-gray-100' : 'bg-gray-700'
                                }`}
                                aria-label={`Ir al curso ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <section className="mx-auto max-w-4xl px-6 py-12">
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                            <button
                                onClick={() => toggle(index)}
                                className="w-full bg-gray-100 px-4 py-3 text-left font-medium text-gray-900 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            >
                                {faq.question}
                            </button>
                            {openIndex === index && (
                                <div className="bg-gray-50 px-4 py-3 text-gray-700 dark:bg-gray-900 dark:text-gray-300">{faq.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <Footer></Footer>
        </>
    );
}
