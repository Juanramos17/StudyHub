import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MenuDesplegable from '@/layouts/app/inicio-header-layout';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Footer from '@/layouts/app/footer-layout';
import { Star, Trash2, User2 } from 'lucide-react';

interface Props {
    course: any;
    profesor: any;
    tests: any[];
    user: any;
    isFavorite: boolean;
    matriculado: boolean;
    rating: any;
    courseRating: any;
    student: any;
}

const formatearDuración = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (horas === 0) {
        return `${mins} minutos`;
    } else if (horas == 1) {
        return `${horas} hora y ${mins} minutos`;
    }

    return `${horas} horas y ${mins} minutos`;
};

const linkTest = (id: number) => {
    router.get(`/test/${id}`);
};

const linkPdf = (student_id: String, test_id: String) => {
    router.get(`/test/${student_id}/${test_id}`);
};

const tituloPdf = (course_id: String) => {
    router.get(`/course/titulo/${course_id}`);
};

const handleFavorite = (userId: string, courseId: string) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('course_id', courseId);

    router.post('/favorite', formData, {
        preserveScroll: true,
    });
};

export default function Course({ course, profesor, tests, user, isFavorite, matriculado, rating, courseRating, student }: Props) {
    const { props } = usePage();
    const flashMessage = props.flash?.message ?? props.flash?.error ?? null;
    const flashType = props.flash?.error ? 'error' : 'success';
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(0);
    const [userRating, setUserRating] = useState(rating);

    const [message, setMessage] = useState<string | null>(flashMessage);
    const [type, setType] = useState<'success' | 'error'>(flashType);

    useEffect(() => {
        if (flashMessage) {
            setMessage(flashMessage);
            setType(flashType);

            const timeout = setTimeout(() => {
                setMessage(null);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [flashMessage, flashType]);

    const handleEnrollment = (id: string) => {
        router.post(`/course/${id}/enrollment`, {
            preserveScroll: true,
        });
        setTimeout(() => {
            window.location.href = window.location.href;
        }, 1);
    };

    const handleRating = (courseId: string) => {
        let rating = userRating;
        router.post(`/rating`, {
            preserveScroll: true,
            courseId,
            rating,
        });
    };

    const handleDeleteTest = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este test?')) {
            router.delete(`/admin/${id}/test`, {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteCourse = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            router.delete(`/admin/${id}/course`, {
                preserveScroll: true,
            });
        }
    };

    console.log(student);

    return (
        <>
            <Head title={course.name} />
            <header className="bg-secondary sticky top-0 z-50 shadow">
                <MenuDesplegable user={user}></MenuDesplegable>
            </header>
            {message && (
                <div className="fixed top-4 right-4 z-50">
                    <div
                        className={`max-w-sm rounded-xl border px-4 py-2 text-sm shadow-lg ${
                            type === 'success' ? 'border-green-400 bg-green-100 text-green-800' : 'border-red-400 bg-red-100 text-red-800'
                        }`}
                    >
                        {message}
                    </div>
                </div>
            )}

            <main className="dark:bg-secondary min-h-screen bg-white from-white to-gray-100 p-6">
                <div className="mx-auto grid max-w-[95%] items-start gap-6 md:grid-cols-3">
                    {/* Card del curso */}
                    <div className="relative flex h-full flex-col justify-center rounded-xl bg-gray-100 p-6 shadow-lg md:col-span-2 md:p-8 dark:bg-[#101828]">
                        {/* Top right badge + star favorite */}
                        <div className="mb-4 flex justify-end gap-3">
                            <div className="hidden rounded-lg bg-indigo-700 px-3 py-1 text-sm font-semibold text-white shadow lg:block">
                                🎓 Comienza tu aprendizaje
                            </div>
                            {isFavorite && (
                                <div className="flex items-center text-xl">
                                    <span>⭐️</span>
                                </div>
                            )}

                            {user.rol !== 'student' && user.id == profesor.id && (
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Course title */}
                        <h1 className="mb-3 text-3xl leading-tight font-bold sm:text-4xl">{course.name}</h1>

                        {/* Rating and buttons */}
                        <div className="mb-6 flex flex-wrap items-center gap-4 text-yellow-400">
                            <span className="text-xl font-semibold">{courseRating.media.toFixed(1)}</span>
                            <div className="flex space-x-1 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, index) => {
                                    const fullStars = Math.floor(courseRating.media);
                                    const hasHalfStar = courseRating.media - fullStars >= 0.5;
                                    if (index < fullStars) {
                                        return (
                                            <span key={index} aria-hidden="true">
                                                <i className="fas fa-star"></i>
                                            </span>
                                        );
                                    } else if (index === fullStars && hasHalfStar) {
                                        return (
                                            <span key={index} aria-hidden="true">
                                                <i className="fas fa-star-half-alt"></i>
                                            </span>
                                        );
                                    } else {
                                        return (
                                            <span key={index} aria-hidden="true">
                                                <i className="far fa-star"></i>
                                            </span>
                                        );
                                    }
                                })}
                            </div>
                            <span className="text-primary/80 notranslate mt-1 text-sm">({courseRating.total})</span>

                            {/* Valorar button only if matriculado */}
                            {matriculado && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <button className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-4 py-1.5 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl active:scale-95">
                                            <i className="fas fa-star text-yellow-400"></i> Valorar
                                        </button>
                                    </DialogTrigger>

                                    <DialogContent className="rounded-2xl border border-pink-200 bg-white shadow-2xl sm:max-w-md dark:bg-[#101828]">
                                        <DialogHeader>
                                            <DialogTitle className="text-center text-2xl font-bold text-pink-700">
                                                ¿Cómo valorarías este curso?
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="flex justify-center gap-3 py-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={36}
                                                    className={`cursor-pointer transition-all duration-150 ${
                                                        (hover || userRating) >= star ? 'scale-110 text-yellow-400 drop-shadow-md' : 'text-gray-300'
                                                    }`}
                                                    onClick={() => setUserRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                    fill={(hover || userRating) >= star ? '#facc15' : 'none'}
                                                />
                                            ))}
                                        </div>

                                        <DialogFooter className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleRating(course.id)}
                                                disabled={userRating === 0}
                                                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
                                                    userRating > 0 ? 'bg-pink-600 hover:bg-pink-700' : 'cursor-not-allowed bg-pink-300'
                                                }`}
                                            >
                                                Enviar
                                            </button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <p className="text-primary/80 mb-6">{course.description}</p>
                        <p className="text-primary/80 mb-6">⏱️ {formatearDuración(course.duration)}</p>

                        <div className="flex space-x-4">
                            {user.rol !== 'teacher' && user.rol !== 'admin' && (
                                <>
                                    {!student && (
                                        <button
                                            className="max-w-[200px] flex-1 cursor-pointer rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-purple-700 sm:flex-auto"
                                            onClick={() => handleEnrollment(course.id)}
                                        >
                                            Matricularse
                                        </button>
                                    )}

                                    {student &&
                                        student.completion_date == null &&
                                        (!matriculado ? (
                                            <button
                                                className="max-w-[200px] flex-1 cursor-pointer rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-purple-700 sm:flex-auto"
                                                onClick={() => handleEnrollment(course.id)}
                                            >
                                                Matricularse
                                            </button>
                                        ) : (
                                            <button
                                                className="max-w-[200px] flex-1 cursor-pointer rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-red-700 sm:flex-auto"
                                                onClick={() => handleEnrollment(course.id)}
                                            >
                                                Darse de baja
                                            </button>
                                        ))}

                                    {student && student.completion_date !== null && (
                                        <button
                                            className="max-w-[200px] flex-1 cursor-pointer rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-purple-700 sm:flex-auto"
                                            onClick={() => tituloPdf(course.id)}
                                        >
                                            Descargar Titulo
                                        </button>
                                    )}
                                </>
                            )}
                            {isFavorite ? (
                                <button
                                    className="max-w-[200px] flex-1 cursor-pointer rounded-lg border border-red-400 px-6 py-2 font-semibold text-red-400 transition duration-300 hover:bg-red-900 hover:text-white sm:flex-auto"
                                    onClick={() => handleFavorite(user.id, course.id)}
                                >
                                    Quitar de favoritos
                                </button>
                            ) : (
                                <button
                                    className="max-w-[200px] flex-1 cursor-pointer rounded-lg border border-purple-400 px-6 py-2 font-semibold text-purple-400 transition duration-300 hover:bg-purple-900 hover:text-white sm:flex-auto"
                                    onClick={() => handleFavorite(user.id, course.id)}
                                >
                                    Añadir a favoritos
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex h-full flex-col items-center justify-center rounded-xl bg-[#f3f4f6] p-6 text-center shadow-lg dark:bg-[#101828]">
                        <div className="relative">
                            {profesor.image !== null ? (
                                <img
                                    src={`/${profesor.image}`}
                                    alt="Foto del instructor"
                                    className="h-32 w-32 rounded-full border-4 border-purple-500 object-cover shadow-md"
                                />
                            ) : (
                                <User2 className="h-32 w-32 rounded-full border-4 border-purple-500 object-cover shadow-md" />
                            )}
                            <span className="absolute right-0 bottom-0 h-5 w-5 animate-pulse rounded-full border-2 border-white bg-green-500 dark:border-[#101828]" />
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{profesor.name}</h2>
                        <p className="mt-1 text-sm font-semibold tracking-wide text-purple-600 uppercase">Experto en Desarrollo</p>

                        <p className="mt-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {profesor.description ? profesor.description : 'El profesor aún no ha proporcionado una descripción.'}
                        </p>
                    </div>
                </div>

                {matriculado || user.rol == 'teacher' || user.rol == 'admin' ? (
                    <section className="mx-auto mt-10 max-w-[95%] rounded-xl bg-gray-100 p-8 shadow-lg transition-all dark:bg-[#101828]">
                        <h3 className="mb-6 flex justify-between text-3xl font-bold text-gray-900 dark:text-white">
                            📚 Temario
                            {course.pdf !== 'null' && (
                                <a
                                    href={`/${course.pdf}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    <FontAwesomeIcon icon={faFilePdf} className="text-[1.4rem]" />
                                </a>
                            )}
                        </h3>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                            Aquí podrás <span className="font-semibold text-purple-600">descargarte los PDF</span> de los temas y{' '}
                            <span className="font-semibold text-purple-600">empezar un tipo test</span> para practicar lo aprendido.
                        </p>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {tests.length > 0 ? (
                                tests.map((test, index) => (
                                    <li key={test.id || index} className="flex flex-col py-6 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{test.name || 'Test sin nombre'}</p>
                                            <p className="text-primary/60 mt-1 text-sm dark:text-gray-400">
                                                ⏱️ {formatearDuración(test.duration) || 'Descripción no disponible'}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex gap-4 md:mt-0">
                                            {test.hecho && (
                                                <a
                                                    onClick={() => linkPdf(student.id, test.id)}
                                                    className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition hover:bg-purple-700"
                                                >
                                                    📄 Descargar PDF
                                                </a>
                                            )}
                                            {user.rol !== 'teacher' && user.rol !== 'admin' && (
                                                <a
                                                    onClick={() => linkTest(test.id)}
                                                    className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition hover:bg-green-700"
                                                >
                                                    🧠 Empezar Test
                                                </a>
                                            )}

                                            {user.rol !== 'student' && user.id == profesor.id && (
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteTest(test.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="py-6 text-center text-gray-500 dark:text-gray-400">Aun no hay tests disponibles en este curso.</li>
                            )}
                        </ul>
                    </section>
                ) : (
                    <section className="mx-auto mt-10 max-w-[95%] rounded-xl bg-gray-100 p-8 shadow-lg transition-all dark:bg-[#101828]">
                        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Acceso restringido</h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Debes matricularte en este curso para poder ver el temario y realizar los tests disponibles.
                        </p>
                    </section>
                )}
            </main>

            <Footer></Footer>
        </>
    );
}
