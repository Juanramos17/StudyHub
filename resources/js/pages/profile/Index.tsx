import AppearanceTabs from '@/components/appearance-tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuDesplegable from '@/layouts/app/inicio-header-layout';
import { useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { BookMarked, BookOpenCheck, CalendarDays, Mail, Phone, Settings, ShieldCheck, User2, UserCircle2, UserPlus } from 'lucide-react';

import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

interface Props {
    user: any;
    role: string;
    // Para estudiantes
    enrollments?: any[];
    stadistics?: any[];
    // Para profesores
    courses?: any[];
    courseStats?: any[];
}

export default function ProfileIndex({ user, role, enrollments = [], stadistics = [], courses = [], courseStats = [] }: Props) {
    const [idCursoSeleccionado, setIdCursoSeleccionado] = useState<number | null>(null);

    //CREAR TEST

    const [mostrarModalTest, setMostrarModalTest] = useState(false);

    // Funciones para abrir y cerrar el modal
    const abrirModalTest = () => setMostrarModalTest(true);
    const cerrarModalTest = () => setMostrarModalTest(false);

    const [numeroPreguntas, setNumeroPreguntas] = useState(1);

    const [formDataTest, setFormDataTest] = useState({
        preguntas: [],
        nombreTest: '',
        descripcionTest: '',
        duracionTest: '',
    });

    const handleNombreChange = (e) => {
        setFormDataTest({ ...formDataTest, nombreTest: e.target.value });
    };

    const handleDuracionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDataTest((prevData) => ({
            ...prevData,
            duracionTest: e.target.value,
        }));
    };

    const handlePreguntaChange = (i, enunciado) => {
        const nuevasPreguntas = [...formDataTest.preguntas];
        if (!nuevasPreguntas[i]) {
            nuevasPreguntas[i] = { enunciado: '', opciones: ['', '', '', ''], correcta: null };
        }
        nuevasPreguntas[i].enunciado = enunciado;
        setFormDataTest({ ...formDataTest, preguntas: nuevasPreguntas });
    };

    const handleRespuestaChange = (i, j, texto) => {
        const nuevasPreguntas = [...formDataTest.preguntas];
        if (!nuevasPreguntas[i]) {
            nuevasPreguntas[i] = { enunciado: '', opciones: ['', '', '', ''], correcta: null };
        }
        nuevasPreguntas[i].opciones[j] = texto;
        setFormDataTest({ ...formDataTest, preguntas: nuevasPreguntas });
    };

    const marcarCorrecta = (i, j) => {
        const nuevasPreguntas = [...formDataTest.preguntas];
        if (!nuevasPreguntas[i]) {
            nuevasPreguntas[i] = { enunciado: '', opciones: ['', '', '', ''], correcta: null };
        }
        nuevasPreguntas[i].correcta = j;
        setFormDataTest({ ...formDataTest, preguntas: nuevasPreguntas });
    };

    const handleCrearTest = (e: React.FormEvent) => {
        e.preventDefault();

        const preguntasFormateadas = formDataTest.preguntas.map((pregunta) => ({
            enunciado: pregunta.enunciado,
            opcionA: pregunta.opciones[0],
            opcionB: pregunta.opciones[1],
            opcionC: pregunta.opciones[2],
            opcionD: pregunta.opciones[3],
            correcta: ['A', 'B', 'C', 'D'][pregunta.correcta],
        }));

        const data = new FormData();
        data.append('nombre', formDataTest.nombreTest);
        data.append('duracion', formDataTest.duracionTest);
        data.append('id_curso', idCursoSeleccionado?.toString() || '');
        data.append('numeroPreguntas', numeroPreguntas.toString());
        data.append('preguntas', JSON.stringify(preguntasFormateadas));

        router.post('/profile/createTest', data, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setMostrarModalTest(false);
                location.reload();
            },
        });
    };

    // CREAR CURSO

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
    });

    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState('');
    const [filePdf, setFilePdf] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagen(file);
            setImagenPreview(URL.createObjectURL(file));
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFilePdf(selected);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        cerrarModal();

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('descripcion', formData.descripcion);
        if (imagen) data.append('imagen', imagen);
        if (filePdf) data.append('pdf', filePdf);

        router.post('/profile/createCourse', data, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const [mostrarModal, setMostrarModal] = useState(false);

    // Funciones para abrir y cerrar el modal
    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    const testsCursoSeleccionado = cursoSeleccionado?.tests ?? [];

    const statCurso = courseStats.find((c: any) => (c.course?.id || c.course_id) === cursoSeleccionado?.id);

    const CustomTooltipTests = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const test = payload[0].payload;

            const alumnosStats = (statCurso?.stats ?? [])
                .filter((stat: any) => stat.test_id === test.id)
                .map((stat: any) => ({
                    alumno: stat.student_name || stat.alumno_nombre || stat.student?.name || 'Alumno',
                    aciertos: stat.correct_answers,
                    errores: stat.incorrect_answers,
                    no_contestadas: stat.unanswered_questions,
                    total: stat.total_questions ?? stat.number_of_questions ?? 0,
                }));

            return (
                <div className="max-w-xs rounded-lg border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{test.name}</p>
                    <p className="mb-1 text-gray-700 dark:text-gray-300">
                        <strong>Total preguntas:</strong> {test.number_of_questions}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <strong>Alumnos:</strong>
                        <ul className="ml-3 list-disc">
                            {alumnosStats.length === 0 && <li>No hay estadísticas</li>}
                            {alumnosStats.map((al, i) => (
                                <li key={i}>
                                    {al.alumno}: {al.aciertos} aciertos / {al.errores} errores <br></br>
                                    {al.no_contestadas} no contestadas
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }
        return null;
    };

    const cursosEnProceso = enrollments.filter((e) => e.completion_date === null);
    const cursosCompletados = enrollments.filter((e) => e.completion_date !== null);

    const [animationActive, setAnimationActive] = useState(true);

    const [chartKey, setChartKey] = useState(0);

    const abrirDialogo = (curso: any) => {
        setCursoSeleccionado(curso);
        setDialogOpen(true);
        setAnimationActive(false);
        setTimeout(() => {
            setAnimationActive(true);
        }, 1);
    };

    const estadisticasCurso = (() => {
        if (!cursoSeleccionado) return;

        const inscripcion = enrollments.find((s) => s.course_id?.toString() === cursoSeleccionado.id?.toString());

        if (!inscripcion) return;

        const studentId = inscripcion.id?.toString();
        const tests = cursoSeleccionado.tests ?? [];

        const resultado = tests.map((test: any) => {
            const stat = stadistics.find((s: any) => s.test_id === test.id);

            return {
                test_name: test.name,
                total_questions: stat?.total_questions ?? 0,
                correct_answers: stat?.correct_answers ?? 0,
                status: stat?.status ?? 'No iniciado',
                completed_at: stat?.completed_at ?? null,
            };
        });

        const conDatos = resultado.filter((r) => r.total_questions > 0);

        return conDatos.length > 0 ? resultado : undefined;
    })();

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF6384', '#36A2EB'];
    const isTeacher = role === 'teacher';

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="max-w-xs rounded-lg border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{data.test_name}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                            <strong>Total preguntas:</strong> {data.total_questions}
                        </p>
                        <p>
                            <strong>Correctas:</strong> {data.correct_answers}
                        </p>
                        <p>
                            <strong>Estado:</strong> {data.status}
                        </p>
                        <p>
                            <strong>Completado:</strong> {data.completed_at ? new Date(data.completed_at).toLocaleString() : 'No'}
                        </p>
                        <p>
                            <strong>Precisión:</strong>{' '}
                            {data.total_questions > 0 ? `${((data.correct_answers / data.total_questions) * 100).toFixed(1)}%` : '0.0%'}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const editProfile = () => {
        router.get(`/profile/edit`, {
            preserveScroll: true,
        });
    };

    const { flash } = usePage().props;
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.message) {
            setMessage(flash.message);

            const timeout = setTimeout(() => {
                setMessage(null);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [flash?.message]);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 transition-colors duration-300 dark:bg-[#02040b] dark:text-gray-100">
            <MenuDesplegable user={user}></MenuDesplegable>

            {message && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="max-w-sm rounded-xl border border-green-400 bg-green-100 px-4 py-2 text-sm text-green-800 shadow-lg">
                        {message}
                    </div>
                </div>
            )}

            <section className="mx-auto max-w-7xl px-6 pt-8 pb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-nowrap items-center gap-4">
                        {user.image !== null ? (
                            <img
                                src={`/${user.image}`}
                                alt="Foto del instructor"
                                className="h-18 w-18 rounded-full border-4 border-purple-500 object-cover shadow-md"
                            />
                        ) : (
                            <User2 className="h-10 w-10 flex-shrink-0 text-blue-600 sm:h-12 sm:w-12 dark:text-blue-400" />
                        )}
                        <div className="min-w-0">
                            <h1 className="max-w-xs truncate text-base font-extrabold tracking-tight sm:max-w-none sm:text-3xl md:text-4xl">
                                {user.name}
                            </h1>
                            <p className="mt-1 flex max-w-xs items-center gap-2 truncate text-xs text-gray-700 sm:max-w-none sm:text-lg dark:text-gray-300">
                                <Mail className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5 dark:text-blue-400" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex max-w-full flex-col gap-5 text-xs text-gray-500 italic sm:flex-row sm:items-center sm:justify-between sm:text-sm dark:text-gray-400">
                        <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                            Última actualización: {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                        </div>

                        <Link
                            className="menu-item flex w-full items-center justify-center rounded bg-red-500 px-3 py-2 text-sm text-white transition-colors hover:bg-red-600 sm:w-auto"
                            method="post"
                            href={route('logout')}
                            as="button"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4 text-white" />
                            <span className="font-medium text-white">Cerrar sesión</span>
                        </Link>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-8 pb-16">
                <Tabs defaultValue="cursos" className="w-full">
                    <TabsList className="mb-6 flex w-full max-w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-[#0d1117]">
                        {[
                            { value: 'cursos', icon: BookMarked, label: 'Mis Cursos' },
                            { value: 'datos', icon: UserCircle2, label: 'Mis Datos' },
                            { value: 'configuracion', icon: Settings, label: 'Configuración' },
                        ].map(({ value, icon: Icon, label }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="group relative mx-0.5 flex min-w-[70px] flex-shrink-0 items-center justify-center gap-1 rounded-xl px-2 py-2 text-[clamp(0.65rem,1vw,0.85rem)] font-semibold whitespace-nowrap text-gray-600 transition-all duration-300 hover:bg-blue-100 hover:text-blue-600 data-[state=active]:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:data-[state=active]:text-blue-400"
                            >
                                <Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 md:h-5 md:w-5" />
                                <span className="max-w-[80px] truncate md:max-w-[120px]">{label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Cursos */}
                    <TabsContent value="cursos" className="space-y-12">
                        {role == 'student' ? (
                            <div>
                                <section className="px-4 sm:px-6 lg:px-8">
                                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-yellow-700 sm:gap-3 sm:text-xl md:text-2xl dark:text-yellow-400">
                                        <BookOpenCheck className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                                        Cursos en proceso
                                    </h2>
                                    {cursosEnProceso.length === 0 ? (
                                        <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">No tienes cursos en proceso.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                            {cursosEnProceso.map((inscripcion) => {
                                                const curso = inscripcion.course;
                                                if (!curso) return null;
                                                return (
                                                    <div
                                                        key={inscripcion.id}
                                                        onClick={() => abrirDialogo(curso)}
                                                        className="relative flex h-48 cursor-pointer items-end overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl sm:h-56 md:h-64"
                                                        style={{
                                                            backgroundImage: `url(${curso.image && curso.image !== 'null' ? '/' + curso.image : 'https://res.cloudinary.com/dbw3utkij/image/upload/v1747409076/LOGOSTUDYHUB_ra6mxz.png'})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-black/50" />
                                                        <div className="relative z-10 w-full p-4 text-white sm:p-6">
                                                            <h3 className="mb-1 line-clamp-2 text-base font-bold sm:text-lg md:text-xl">
                                                                {curso.name || curso.title}
                                                            </h3>
                                                            <p className="text-xs font-semibold text-yellow-300 sm:text-sm">En proceso</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>

                                <section className="mt-12 px-4 sm:px-6 lg:px-8">
                                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-green-700 sm:gap-3 sm:text-xl md:text-2xl dark:text-green-400">
                                        <ShieldCheck className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                                        Cursos completados
                                    </h2>
                                    {cursosCompletados.length === 0 ? (
                                        <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">No tienes cursos terminados.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                            {cursosCompletados.map((inscripcion) => {
                                                const curso = inscripcion.course;
                                                if (!curso) return null;
                                                return (
                                                    <div
                                                        key={inscripcion.id}
                                                        onClick={() => abrirDialogo(curso)}
                                                        className="relative flex h-48 cursor-pointer items-end overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl sm:h-56 md:h-64"
                                                        style={{
                                                            backgroundImage: `url(${curso.image && curso.image !== 'null' ? '/' + curso.image : 'https://res.cloudinary.com/dbw3utkij/image/upload/v1747409076/LOGOSTUDYHUB_ra6mxz.png'})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-black/50" />
                                                        <div className="relative z-10 w-full p-4 text-white sm:p-6">
                                                            <h3 className="mb-1 line-clamp-2 text-base font-bold sm:text-lg md:text-xl">
                                                                {curso.name || curso.title}
                                                            </h3>
                                                            <p className="text-xs font-semibold text-green-500 sm:text-sm">Completado</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>
                            </div>
                        ) : (
                            <div>
                                <section className="px-4 sm:px-6 lg:px-8">
                                    <div className="mb-6 flex flex-col justify-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Crear nuevo curso</h3>
                                        <button
                                            onClick={abrirModal} // ← Aquí conectas con la lógica para abrir el modal
                                            className="inline-flex w-full max-w-[200px] items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-white transition hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-400"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Crear curso
                                        </button>
                                    </div>

                                    {mostrarModalTest && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
                                            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Crear Test</h4>

                                                <form onSubmit={handleCrearTest} className="space-y-6">
                                                    {/* Nombre del Test */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                                                        <input
                                                            name="nombreTest"
                                                            value={formDataTest.nombreTest}
                                                            onChange={handleNombreChange}
                                                            type="text"
                                                            placeholder="Ej. Test de prueba"
                                                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                                            required
                                                            minLength={3}
                                                        />
                                                    </div>

                                                    {/* Duración */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Duración del test (minutos)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="duracionTest"
                                                            placeholder="Ej. 45"
                                                            value={formDataTest.duracionTest}
                                                            onChange={handleDuracionChange}
                                                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                                            required
                                                            min={1}
                                                            max={300}
                                                        />
                                                    </div>

                                                    {/* Número de preguntas */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Número de preguntas
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="numeroPreguntasTest"
                                                            min={1}
                                                            max={100}
                                                            value={numeroPreguntas}
                                                            onChange={(e) => {
                                                                const nuevoNumero = parseInt(e.target.value);
                                                                if (!isNaN(nuevoNumero) && nuevoNumero > 0 && nuevoNumero <= 100) {
                                                                    setNumeroPreguntas(nuevoNumero);
                                                                }
                                                            }}
                                                            placeholder="Ej. 3"
                                                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Preguntas */}
                                                    {Array.from({ length: numeroPreguntas }).map((_, i) => (
                                                        <div key={i} className="space-y-2 rounded-lg border p-4 dark:border-gray-600">
                                                            <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                Pregunta {i + 1}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={`Enunciado de la pregunta ${i + 1}`}
                                                                value={formDataTest.preguntas[i]?.enunciado || ''}
                                                                onChange={(e) => handlePreguntaChange(i, e.target.value)}
                                                                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                                                                required
                                                                minLength={5}
                                                            />

                                                            {[...Array(4)].map((_, j) => (
                                                                <div
                                                                    key={j}
                                                                    className="flex items-center gap-2 rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        placeholder={`Respuesta ${j + 1}`}
                                                                        value={formDataTest.preguntas[i]?.opciones[j] || ''}
                                                                        onChange={(e) => handleRespuestaChange(i, j, e.target.value)}
                                                                        className="w-full bg-transparent text-sm dark:text-white"
                                                                        required
                                                                        minLength={1}
                                                                    />
                                                                    <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                                                        <input
                                                                            type="radio"
                                                                            name={`pregunta-${i}-correcta`}
                                                                            checked={formDataTest.preguntas[i]?.correcta === j}
                                                                            onChange={() => marcarCorrecta(i, j)}
                                                                            className="h-4 w-4 accent-yellow-500"
                                                                            required
                                                                        />
                                                                        Correcta
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}

                                                    {/* Botones */}
                                                    <div className="flex justify-end gap-2 pt-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setMostrarModalTest(false)}
                                                            className="rounded-lg border px-4 py-2 text-sm dark:text-white dark:hover:bg-gray-700"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                                        >
                                                            Guardar test
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {mostrarModal && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
                                            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                                <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Nuevo curso</h4>

                                                <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
                                                        <input
                                                            name="nombre"
                                                            value={formData.nombre}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Ej. Curso de Vue"
                                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Descripción
                                                        </label>
                                                        <textarea
                                                            name="descripcion"
                                                            value={formData.descripcion}
                                                            onChange={handleChange}
                                                            rows={3}
                                                            placeholder="Breve descripción..."
                                                            className="mt-1 min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Imagen del curso
                                                        </label>
                                                        {imagenPreview && (
                                                            <img
                                                                src={imagenPreview}
                                                                alt="Vista previa"
                                                                className="mb-2 h-24 w-24 rounded object-cover shadow"
                                                            />
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImagenChange}
                                                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-yellow-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            PDF del curso *
                                                        </label>
                                                        <input
                                                            type="file"
                                                            required
                                                            accept=".pdf"
                                                            onChange={handlePdfChange}
                                                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-yellow-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                    </div>

                                                    <div className="mt-6 flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={cerrarModal}
                                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-400"
                                                        >
                                                            Crear curso
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-yellow-700 sm:gap-3 sm:text-xl md:text-2xl dark:text-yellow-400">
                                        <BookOpenCheck className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                                        Mis cursos creados
                                    </h2>
                                    {courses.length === 0 ? (
                                        <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">No tienes cursos creados.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                            {courses.map((curso) => (
                                                <div
                                                    key={curso.id}
                                                    onClick={() => abrirDialogo(curso)}
                                                    className="relative flex h-48 cursor-pointer items-end overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform duration-300 hover:scale-103 hover:shadow-2xl sm:h-56 md:h-64"
                                                    style={{
                                                        backgroundImage: `url(${curso.image && curso.image !== 'null' ? '/' + curso.image : 'https://res.cloudinary.com/dbw3utkij/image/upload/v1747409076/LOGOSTUDYHUB_ra6mxz.png'})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-black/50" />

                                                    {/* Botón verde en la esquina superior derecha */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // evitar que se abra el diálogo
                                                            abrirModalTest();
                                                            setIdCursoSeleccionado(curso.id);
                                                        }}
                                                        className="absolute top-4 right-4 z-20 cursor-pointer rounded bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600"
                                                    >
                                                        Agregar test
                                                    </button>

                                                    {/* Botón verde en la esquina superior derecha */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // evitar que se abra el diálogo
                                                            router.get(`/profile/${curso.id}/editCourse`);
                                                        }}
                                                        className="absolute top-4 left-4 z-20 cursor-pointer rounded bg-yellow-600 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-700"
                                                    >
                                                        Editar curso
                                                    </button>

                                                    <div className="relative z-10 w-full p-4 text-white sm:p-6">
                                                        <h3 className="mb-1 line-clamp-2 text-base font-bold sm:text-lg md:text-xl">
                                                            {curso.name || curso.title}
                                                        </h3>
                                                        {courseStats && courseStats.length > 0 && (
                                                            <p className="text-xs font-semibold text-blue-300 sm:text-sm">
                                                                {(() => {
                                                                    const stat = courseStats.find((s: any) => s.course.id === curso.id);
                                                                    return stat && stat.stats ? `Estadísticas de ${stat.stats.length} pruebas` : '';
                                                                })()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}
                    </TabsContent>

                    {/* Datos */}
                    <TabsContent value="datos">
                        <section className="grid grid-cols-1 gap-8 px-4 py-6 sm:px-6 md:grid-cols-2 md:gap-10 lg:px-8">
                            {/* Perfil Personal */}
                            <div className="space-y-6 rounded-2xl bg-gray-100 p-8 shadow-xl dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-3 text-2xl font-bold text-blue-700 sm:text-3xl dark:text-blue-400">
                                        <UserCircle2 className="h-7 w-7 flex-shrink-0 sm:h-9 sm:w-9" />
                                        <span>Perfil Personal</span>
                                    </h2>
                                </div>
                                <div className="space-y-4 text-sm sm:text-base">
                                    <div>
                                        <strong className="text-blue-600 dark:text-blue-400">Nombre completo:</strong> {user.name}
                                    </div>
                                    <div>
                                        <strong className="text-blue-600 dark:text-blue-400">Correo electrónico:</strong> {user.email}
                                    </div>
                                    {user.rol && (
                                        <div>
                                            <strong className="text-blue-600 dark:text-blue-400">Rol:</strong> {user.rol}
                                        </div>
                                    )}
                                    {user.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5 dark:text-blue-400" />
                                            <span>
                                                <strong className="text-blue-600 dark:text-blue-400">Teléfono:</strong> {user.phone}
                                            </span>
                                        </div>
                                    )}
                                    {user.created_at && (
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5 dark:text-blue-400" />
                                            <span>
                                                <strong className="text-blue-600 dark:text-blue-400">Miembro desde:</strong>{' '}
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {user.description && (
                                        <div>
                                            <strong className="text-blue-600 dark:text-blue-400">Descripción:</strong> {user.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="flex flex-col justify-between space-y-6 rounded-2xl bg-gray-100 p-8 shadow-xl dark:bg-gray-800">
                                <div>
                                    <h2 className="flex items-center gap-3 text-2xl font-bold text-indigo-700 sm:text-3xl dark:text-indigo-400">
                                        <UserPlus className="h-7 w-7 flex-shrink-0 sm:h-9 sm:w-9" />
                                        <span>Información adicional</span>
                                    </h2>
                                    <p className="mt-3 text-xs text-gray-700 sm:text-sm dark:text-gray-300">
                                        Puedes completar y personalizar tu perfil para mejorar tu experiencia en la plataforma.
                                    </p>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                        onClick={editProfile}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 00-4-4L5 17v4z"
                                            />
                                        </svg>
                                        Editar perfil
                                    </button>
                                </div>
                            </div>
                        </section>
                    </TabsContent>

                    {/* Configuración */}
                    <TabsContent value="configuracion">
                        <section className="mx-auto max-w-3xl space-y-8 py-6">
                            <h2 className="flex items-center gap-3 text-xl font-semibold text-indigo-700 sm:text-2xl md:text-3xl dark:text-indigo-400">
                                <Settings className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                                Configuración de la cuenta
                            </h2>

                            <div className="space-y-6 rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
                                <HeadingSmall title="Apariencia" description="Personaliza la apariencia de la aplicación" />
                                <AppearanceTabs />
                            </div>

                            <div className="space-y-4 rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
                                <div className="space-y-6">
                                    <HeadingSmall
                                        title="Update password"
                                        description="Ensure your account is using a long, random password to stay secure"
                                    />

                                    <form onSubmit={updatePassword} className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">Current password</Label>

                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                value={data.current_password}
                                                onChange={(e) => setData('current_password', e.target.value)}
                                                type="password"
                                                className="mt-1 block w-full"
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                            />

                                            <InputError message={errors.current_password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">New password</Label>

                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                type="password"
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                            />

                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">Confirm password</Label>

                                            <Input
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                type="password"
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                            />

                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing} className="">
                                                Save password
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600">Saved</p>
                                            </Transition>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                </Tabs>
            </main>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="flex max-h-[90vh] flex-col items-center overflow-y-auto rounded-xl bg-gradient-to-tr from-white/80 to-blue-50 p-6 shadow-2xl sm:mx-auto sm:max-w-4xl sm:p-8 dark:from-[#0a142a] dark:to-[#121b34]">
                    <DialogHeader className="mb-6 w-full text-center">
                        <DialogTitle className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
                            {cursoSeleccionado?.name || cursoSeleccionado?.title}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-gray-600 dark:text-gray-400">
                            {isTeacher ? 'Distribución de preguntas por test y desempeño de alumnos' : 'Distribución de preguntas por test'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Contenido dinámico del gráfico según rol */}
                    {isTeacher ? (
                        testsCursoSeleccionado && testsCursoSeleccionado.length > 0 ? (
                            <div className="w-full max-w-xl">
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={testsCursoSeleccionado}
                                            dataKey="number_of_questions"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={60}
                                            paddingAngle={4}
                                            isAnimationActive={true}
                                            animationDuration={800}
                                            animationEasing="ease-out"
                                            labelLine={false}
                                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {testsCursoSeleccionado.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltipTests />} />
                                        <Legend
                                            iconType="circle"
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            wrapperStyle={{
                                                paddingTop: 20,
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--text-color)',
                                                maxWidth: '100%',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                display: 'flex',
                                                gap: 12,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="mt-4 font-semibold text-red-500">No hay tests en este curso.</p>
                        )
                    ) : estadisticasCurso && estadisticasCurso.length >= 1 ? (
                        <div className="w-full max-w-xl">
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart key={chartKey}>
                                    <Pie
                                        data={estadisticasCurso}
                                        dataKey="total_questions"
                                        nameKey="test_name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={4}
                                        isAnimationActive={animationActive}
                                        animationDuration={800}
                                        animationEasing="ease-out"
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {estadisticasCurso.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend
                                        iconType="circle"
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{
                                            paddingTop: 20,
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: 'var(--text-color)',
                                            maxWidth: '100%',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            display: 'flex',
                                            gap: 12,
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="mt-4 font-semibold text-red-500">No hay estadísticas disponibles para este curso.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
