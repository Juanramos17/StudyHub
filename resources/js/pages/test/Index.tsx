import { Dialog } from '@/components/ui/dialog';
import MenuDesplegable from '@/layouts/app/inicio-header-layout';
import { Head, router } from '@inertiajs/react';
import { DialogOverlay, DialogPortal } from '@radix-ui/react-dialog';
import 'aos/dist/aos.css';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    test: any;
    questions: any[];
    user: any;
}

export default function Test({ test, questions, user }: Props) {
    const [testEnviado, setTestEnviado] = useState(false);

    // Evitar recarga solo mientras el test no esté enviado
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!testEnviado) {
                event.preventDefault();
                event.returnValue = '¿Seguro que quieres salir? Se perderán los datos.';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [testEnviado]);

    const [notaFinal, setNotaFinal] = useState<number | null>(null);

    // ESTO EVITA QUE SE CAMBIEN LAS PREGUNTAS CADA VEZ QUE SE ACTUALIZA EL COMPONENTE
    const preguntas = useMemo(() => {
        return questions.map((question: any) => {
            const opcionesOriginales = [question.option_a, question.option_b, question.option_c, question.correct_option];

            const opcionesMezcladas = [...opcionesOriginales].sort(() => Math.random() - 0.5);

            return {
                enunciado: question.question_text,
                opciones: opcionesMezcladas,
                respuestaCorrecta: opcionesMezcladas.findIndex((opcion) => opcion === question.correct_option),
            };
        });
    }, [questions]);

    useEffect(() => {
        console.log(test.name); // Solo una vez al montar
    }, []);

    const [preguntaActual, setPreguntaActual] = useState(0);
    const [respuestas, setRespuestas] = useState<(number | null)[]>(Array(preguntas.length).fill(null));
    const [segundosRestantes, setSegundosRestantes] = useState(test.duration * 60);
    const [tiempoTerminado, setTiempoTerminado] = useState(false);
    const [mostrarDialogo2, setMostrarDialogo2] = useState(false);

    const totalPreguntas = preguntas.length;
    const preguntasRespondidas = respuestas.filter((r) => r !== null).length;

    const porcentajeAvance = useMemo(() => {
        return Math.round((preguntasRespondidas / totalPreguntas) * 100);
    }, [preguntasRespondidas, totalPreguntas]);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setSegundosRestantes((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalo);
                    setTiempoTerminado(true);
                    terminarTest();
                    
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    const formatearTiempo = (s: number) => {
        const horas = Math.floor(s / 3600)
            .toString()
            .padStart(2, '0');
        const minutos = Math.floor((s % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const segundos = (s % 60).toString().padStart(2, '0');

        return horas !== '00' ? `${horas}:${minutos}:${segundos}` : `${minutos}:${segundos}`;
    };

    const seleccionarRespuesta = (indiceRespuesta: number) => {
        if (tiempoTerminado) return;
        const nuevasRespuestas = [...respuestas];
        nuevasRespuestas[preguntaActual] = nuevasRespuestas[preguntaActual] === indiceRespuesta ? null : indiceRespuesta;
        setRespuestas(nuevasRespuestas);
    };

    const terminarTest = () => {
        let aciertos = 0;
        let fallos = 0;
        let noRespondidas = 0;

        respuestas.forEach((respuesta, i) => {
            if (respuesta === null) {
                noRespondidas++;
            } else if (respuesta === preguntas[i].respuestaCorrecta) {
                aciertos++;
            } else {
                fallos++;
            }
        });

        const penalización = Math.floor(fallos / 3);
        const aciertosFinales = Math.max(aciertos - penalización, 0);
        let is_passed = 0;

        const nota = (aciertosFinales / preguntas.length) * 10;
        setNotaFinal(nota);
        setMostrarDialogo2(true);

        setTimeout(() => {
            // 👇 Usar FormData
            const formData = new FormData();
            formData.append('usuario_id', user.id);
            formData.append('aciertos', aciertos.toString());
            formData.append('fallos', fallos.toString());
            formData.append('no_respondidas', noRespondidas.toString());
            formData.append('nota', nota.toFixed(2));
            formData.append('idCurso', test.course_id.toString());
            formData.append('idTest', test.id.toString());
            setTestEnviado(true);
            router.post('/test', formData);
        }, 5000);


    };

    return (
        <>
        <Head title="Test" />
            <header className="sticky top-0 z-50 shadow-md">
                <MenuDesplegable user={user}></MenuDesplegable>
            </header>

            <main className="mx-auto grid max-w-[90%] grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-3">
                {/* Pregunta actual */}
                <div className="shadow-neumorph bg-secondary text-primary rounded-3xl p-8 lg:col-span-2">
                    <h2 className="text-primary mb-6 leading-tight font-bold">
                        <span className="bg-primary/10 text-primary mr-4 mb-5 inline-block rounded-lg px-3 py-1 font-mono text-lg">
                            Pregunta {preguntaActual + 1}
                        </span>
                        <br />
                        <span className="font-light text-gray-700 dark:text-gray-300">{preguntas[preguntaActual].enunciado}</span>
                    </h2>

                    <div className="space-y-5">
                        {preguntas[preguntaActual].opciones.map((opcion, index) => {
                            const seleccionada = respuestas[preguntaActual] === index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => seleccionarRespuesta(index)}
                                    className={`flex max-h-12 w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-shadow dark:bg-gray-700 ${
                                        seleccionada
                                            ? 'border-2 border-indigo-400 bg-indigo-100 shadow-inner'
                                            : 'border border-transparent bg-gray-50 hover:bg-indigo-50 hover:shadow-md'
                                    }`}
                                >
                                    <div
                                        className={`h-5 w-5 flex-shrink-0 rounded-full border-2 ${seleccionada ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}
                                    ></div>
                                    <span className="text-primary/80 text-lg">{opcion}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => setPreguntaActual((p) => Math.max(p - 1, 0))}
                            disabled={tiempoTerminado}
                            className={`rounded-lg px-6 py-3 font-semibold transition ${tiempoTerminado ? 'cursor-not-allowed bg-gray-300 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Anterior
                        </button>
                        {preguntaActual === preguntas.length - 1 ? (
                            <button
                                onClick={terminarTest}
                                disabled={tiempoTerminado}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Terminar Test
                            </button>
                        ) : (
                            <button
                                onClick={() => setPreguntaActual((p) => Math.min(p + 1, preguntas.length - 1))}
                                disabled={tiempoTerminado}
                                className={`rounded-lg px-4 py-2 ${tiempoTerminado ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>

                {/* Panel derecho con contador y navegación */}
                <aside className="shadow-neumorph bg-secondary flex h-fit flex-col rounded-3xl border p-8 text-center">
                    <h3 className="t text-gradient mb-6 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 text-2xl font-extrabold tracking-widest">
                        {test.name}
                    </h3>

                    <div className="mb-7 text-center font-mono text-5xl font-black tracking-wide text-indigo-800 drop-shadow-lg select-none">
                        {formatearTiempo(segundosRestantes)}
                    </div>

                    {/* Barra de progreso */}
                    <div className="mx-auto mb-6 h-4 w-full max-w-md overflow-hidden rounded-full bg-gray-200 shadow-inner">
                        <div
                            className="h-4 bg-gradient-to-r from-indigo-700 to-purple-700 transition-all duration-500"
                            style={{ width: `${porcentajeAvance}%` }}
                        />
                    </div>

                    {/* Mensaje motivador */}
                    <p className="mb-8 text-center font-semibold text-indigo-700">
                        {porcentajeAvance === 100
                            ? '¡Genial! Has respondido todas las preguntas.'
                            : `Llevas ${preguntasRespondidas} de ${totalPreguntas} preguntas respondidas.`}
                    </p>

                    <div className="mb-10 flex flex-wrap justify-center gap-5">
                        {preguntas.map((_, i) => {
                            const respondida = respuestas[i] !== null;
                            return (
                                <button
                                    key={i}
                                    onClick={() => !tiempoTerminado && setPreguntaActual(i)}
                                    disabled={tiempoTerminado}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold transition-all duration-300 ${
                                        preguntaActual === i
                                            ? 'scale-110 transform bg-gradient-to-tr from-indigo-700 to-purple-700 text-white shadow-xl'
                                            : respondida
                                              ? 'bg-indigo-400 text-white shadow-md hover:bg-indigo-500'
                                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    } ${tiempoTerminado ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                    aria-label={`Pregunta ${i + 1}`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={terminarTest}
                        className="mx-auto block rounded-2xl bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition duration-300 hover:bg-red-700 active:scale-95"
                    >
                        Terminar Test
                    </button>
                </aside>
            </main>


            <Dialog open={mostrarDialogo2} onOpenChange={setMostrarDialogo2}>
                <DialogPortal>
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
                        <DialogOverlay className="fixed inset-0" />
                        <div className="z-50 w-full max-w-lg rounded-xl p-6 shadow-lg">
                            <div className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black">
                                <div className="bg-secondary mx-4 max-w-[%80] rounded-3xl p-10 text-center shadow-2xl">
                                    <h2 className="text-primary mb-5 text-3xl font-bold">Has terminado tu test</h2>
                                    <p className="text-primary/50 mb-8 text-lg">Podras ver tu nota en el pdf del test.</p>
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full border-4 border-white border-t-transparent p-4">
                                            {/* Logo SVG o ícono */}
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            ></svg>
                                        </div>
                                    </div>
                                    <p className="text-primary/40 text-s mt-5">Enviando tus respuestas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogPortal>
            </Dialog>
        </>
    );
}
