import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import MenuDesplegable from '@/layouts/app/inicio-header-layout';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowDownToLine, Ban, CheckCircle, Eye, LogOut, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Favorite {
    course_id: string;
    total_favorites: number;
}

interface RatedCourse {
    course_id: string;
    avg_rating: number;
    total_ratings: number;
}

interface TopStudent {
    user_id: string;
    avg_score: number;
    tests_taken: number;
}

interface TestStats {
    test_id: string;
    total_evaluations?: number;
    avg_score?: number;
    pass_rate?: number;
}

interface Props {
    user: any;
    students: any[];
    teachers: any[];
    courses: any[];
    favoritos: Favorite[];
    mejoresValorados: RatedCourse[];
    mejoresEstudiantes: TopStudent[];
    testsMasRealizados: TestStats[];
    testsDificilesFaciles: TestStats[];
}

export default function AdminIndex({
    user,
    students,
    teachers,
    courses,
    favoritos,
    mejoresValorados,
    mejoresEstudiantes,
    testsDificilesFaciles,
    testsMasRealizados,
}: Props) {
    const [previewPdf, setPreviewPdf] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { filters = {} } = usePage().props;

    const [tab, setTab] = useState('students');
    const [studentSearch, setStudentSearch] = useState(filters.studentSearch || '');
    const [teacherSearch, setTeacherSearch] = useState(filters.teacherSearch || '');
    const [courseSearch, setCourseSearch] = useState(filters.courseSearch || '');

    const search = (type: string, value: string) => {
        const params: any = {
            studentSearch,
            teacherSearch,
            courseSearch,
            tab,
        };
        params[type] = value;

        router.get('/admin', params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (tab === 'students') {
                search('studentSearch', studentSearch);
            } else if (tab === 'teachers') {
                search('teacherSearch', teacherSearch);
            } else if (tab === 'courses') {
                search('courseSearch', courseSearch);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [studentSearch, teacherSearch, courseSearch, tab]);

    const handleBan = (id: string) => {
        if (confirm('¿Estás seguro de que deseas cambiar el estado de baneo de este usuario?')) {
            router.put(
                `/admin/${id}/ban`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleHide = (id: string) => {
        if (confirm('¿Estás seguro de que deseas cambiar el estado de visibilidad de este curso?')) {
            router.put(
                `/admin/${id}/hide`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            router.delete(`/admin/${id}/user`, {
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

    const handleProfile = (id: string) => {
        router.get(`/profile/${id}/profile`, {
            preserveScroll: true,
        });
    };

    const handleCourse = (id: string) => {
        router.get(`/course/${id}`, {
            preserveScroll: true,
        });
    };

    const createUser = (rol: string) => {
        router.get(`/admin/createUser`, {
            preserveScroll: true,
            rol,
        });
    };

    const createCourse = () => {
        router.get(`/admin/createCourse`, {
            preserveScroll: true,
        });
    };

    const { flash } = usePage().props;
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.message && !message) {
            setMessage(flash.message);

            const timeout = setTimeout(() => {
                setMessage(null);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [flash?.message, message]);

    const renderActions = (item: any, type: string) => (
        <div className="flex space-x-2">
            {(type === 'students' || type === 'teachers') && (
                <>
                    <Button variant="outline" size="icon" onClick={() => router.get(`/admin/${item.id}/editUser`)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant={item.isBanned ? 'secondary' : 'outline'} size="icon" onClick={() => handleBan(item.id)}>
                        {item.isBanned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" onClick={() => handleProfile(item.id)}>
                        <Eye></Eye>
                    </Button>
                </>
            )}

            {type === 'courses' && (
                <>
                    <Button variant="outline" size="icon" onClick={() => router.get(`/admin/${item.id}/editCourse`)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteCourse(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant={item.isHidden ? 'secondary' : 'outline'} size="icon" onClick={() => handleHide(item.id)}>
                        {item.isHidden ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" onClick={() => handleCourse(item.id)}>
                        <Eye></Eye>
                    </Button>
                </>
            )}
        </div>
    );

    const closeImageModal = () => setPreviewImage(null);
    const closeModal = () => setPreviewPdf(null);
    console.log(mejoresEstudiantes);

    const renderTable = (data: any[], type: string) => {
        const timeout = setTimeout(() => {
            setMessage(null);
        }, 3000);

        if (!data || data.length === 0) {
            return <p className="text-muted-foreground text-center">No hay datos disponibles.</p>;
        }

        const keys = Object.keys(data[0]).filter((k) => k !== 'isBanned' && k !== 'isHidden');

        return (
            <div className="mt-4 overflow-x-auto rounded-lg border">
                <table className="divide-muted bg-background min-w-full divide-y">
                    <thead className="bg-muted">
                        <tr>
                            {keys.map((key) => (
                                <th key={key} className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                                    {key}
                                </th>
                            ))}
                            <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-muted divide-y">
                        {data.map((item, idx) => (
                            <tr key={idx} className="hover:bg-accent">
                                {keys.map((key) => (
                                    <td key={key} className="text-foreground px-4 py-2 text-sm">
                                        {key === 'image' ? (
                                            item[key] && item[key].trim() !== 'null' && item[key].trim() !== '' ? (
                                                <img
                                                    src={item[key]}
                                                    alt={`${item.name} imagen`}
                                                    className="h-10 w-10 cursor-pointer rounded-full object-cover"
                                                    onClick={() => setPreviewImage(item[key])}
                                                    title="Ver imagen ampliada"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">No hay imagen</span>
                                            )
                                        ) : key === 'pdf' ? (
                                            item[key] && item[key].trim() !== 'null' && item[key].trim() !== '' ? (
                                                <div className="flex min-w-30 flex-row justify-center gap-3 space-y-1">
                                                    <button
                                                        onClick={() => setPreviewPdf(item[key])}
                                                        className="rounded transition-shadow hover:shadow-lg"
                                                        title="Ver PDF"
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePdf} className="text-[1.4rem]" />
                                                    </button>
                                                    <a
                                                        href={item[key]}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 underline"
                                                    >
                                                        <ArrowDownToLine />
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">No hay pdf</span>
                                            )
                                        ) : /created|updated|date/i.test(key) && item[key] ? (
                                            (() => {
                                                const parsedDate = new Date(item[key]);
                                                return isNaN(parsedDate)
                                                    ? String(item[key] ?? '')
                                                    : parsedDate.toLocaleDateString('es-ES', {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      });
                                            })()
                                        ) : (
                                            String(item[key] ?? '')
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-2">{renderActions(item, type)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {previewImage && (
                    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={closeImageModal}>
                        <div className="relative max-h-[90vh] w-full max-w-3xl rounded bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={closeImageModal}
                                className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
                                title="Cerrar"
                                type="button"
                            >
                                &times;
                            </button>
                            <img src={previewImage} alt="Imagen ampliada" className="max-h-[80vh] max-w-full rounded object-contain" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getCourseName = (id: string) => courses.find((c) => c.id === id)?.name || id;
    const getStudentName = (id: string) => students.find((s) => s.id === id)?.name || id;
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffbb28', '#d88884', '#83a6ed'];

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <>
            <header className="bg-secondary sticky top-0 z-50 shadow">
                <MenuDesplegable user={user} ></MenuDesplegable>
            </header>

            <main className="relative mx-auto max-w-[90%] p-6">
                {message && (
                    <div className="fixed top-4 right-4 z-50">
                        <div className="max-w-sm rounded-xl border border-green-400 bg-green-100 px-4 py-2 text-sm text-green-800 shadow-lg">
                            {message}
                        </div>
                    </div>
                )}

                <h1 className="mb-6 text-3xl font-bold">Panel de Administración</h1>
                <Link
                    className="menu-item flex items-center rounded bg-white px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-500 hover:text-red-800 mb-5"
                    method="post"
                    href={route('logout')}
                    as="button"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">Cerrar sesión</span>
                </Link>

                <Tabs defaultValue="students" className="w-full">
                    <TabsList className="scrollbar-hide mb-4 flex w-full space-x-4 overflow-x-auto md:grid md:grid-cols-4 md:space-x-0">
                        <TabsTrigger value="students" className="min-w-[80px] text-center whitespace-nowrap">
                            Estudiantes
                        </TabsTrigger>
                        <TabsTrigger value="teachers" className="min-w-[80px] text-center whitespace-nowrap">
                            Profesores
                        </TabsTrigger>
                        <TabsTrigger value="courses" className="min-w-[80px] text-center whitespace-nowrap">
                            Cursos
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="min-w-[80px] text-center whitespace-nowrap">
                            Estadísticas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="students">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold">Estudiantes</h2>
                            <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
                                <input
                                    type="text"
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    placeholder="Buscar estudiante..."
                                    className="w-full rounded border px-3 py-1 text-sm sm:w-auto"
                                />
                                <Button onClick={() => createUser('student')} className="whitespace-nowrap">
                                    Agregar Estudiante
                                </Button>
                            </div>
                        </div>
                        {renderTable(students, 'students')}
                    </TabsContent>

                    <TabsContent value="teachers">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold">Profesores</h2>
                            <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
                                <input
                                    type="text"
                                    value={teacherSearch}
                                    onChange={(e) => setTeacherSearch(e.target.value)}
                                    placeholder="Buscar profesor..."
                                    className="w-full rounded border px-3 py-1 text-sm sm:w-auto"
                                />
                                <Button onClick={() => createUser('teacher')} className="whitespace-nowrap">
                                    Agregar Profesor
                                </Button>
                            </div>
                        </div>
                        {renderTable(teachers, 'teachers')}
                    </TabsContent>

                    <TabsContent value="courses">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold">Cursos</h2>
                            <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
                                <input
                                    type="text"
                                    value={courseSearch}
                                    onChange={(e) => setCourseSearch(e.target.value)}
                                    placeholder="Buscar curso..."
                                    className="w-full rounded border px-3 py-1 text-sm sm:w-auto"
                                />
                                <Button onClick={() => createCourse()} className="whitespace-nowrap">
                                    Agregar Curso
                                </Button>
                            </div>
                        </div>
                        {renderTable(courses, 'courses')}
                    </TabsContent>
                    <TabsContent value="stats">
                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {/* 1. Cursos más queridos (favoritos) */}
                            <section className="bg-background rounded-xl border p-4 shadow">
                                <h2 className="mb-2 text-xl font-semibold">Cursos más queridos (Favoritos)</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={favoritos}
                                            dataKey="total_favorites"
                                            nameKey="course_id"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="80%"
                                            fill="#8884d8"
                                            label={({ index }) => getCourseName(favoritos[index].course_id)}
                                        >
                                            {favoritos.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ payload }) => {
                                                if (!payload || !payload.length) return null;
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-secondary rounded p-2 text-white shadow">
                                                        <strong>{getCourseName(data.course_id)}</strong>
                                                        <div>{data.total_favorites} favoritos</div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </section>

                            {/* 2. Cursos mejor valorados */}
                            <section className="bg-background rounded-xl border p-4 shadow">
                                <h2 className="mb-2 text-xl font-semibold">Cursos mejor valorados</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={mejoresValorados} margin={{ left: 0, right: 20 }}>
                                        {/* Eje X sin ticks ni etiquetas */}
                                        <XAxis dataKey="course_id" tick={false} />
                                        <YAxis domain={[0, 5]} />
                                        <Tooltip
                                            content={({ payload, label }) => {
                                                if (!payload || !payload.length) return null;
                                                let avgRating = '-';
                                                let totalRatings = '-';

                                                payload.forEach((item) => {
                                                    if (item.dataKey === 'avg_rating') {
                                                        const val = Number(item.value);
                                                        avgRating = isNaN(val) ? '-' : val.toFixed(1);
                                                    }
                                                    if (item.dataKey === 'total_ratings') {
                                                        const val = Number(item.value);
                                                        totalRatings = isNaN(val) ? '-' : val;
                                                    }
                                                });

                                                return (
                                                    <div className="bg-secondary rounded p-2 text-white shadow">
                                                        <strong>{getCourseName(label)}</strong>
                                                        <div>Media: {avgRating}</div>
                                                        <div>Valoraciones: {totalRatings}</div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="avg_rating" fill="#82ca9d" name="Media Rating" />
                                        <Bar dataKey="total_ratings" fill="#8884d8" name="Número de valoraciones" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </section>

                            {/* 3. Estudiantes con mejores estadísticas */}
                            <section className="bg-background rounded-xl border p-4 shadow">
                                <h2 className="mb-2 text-xl font-semibold">Estudiantes con mejores estadísticas</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={mejoresEstudiantes} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        {/* Eje X sin ticks ni etiquetas */}
                                        <XAxis dataKey="student.user.name" />
                                        <YAxis domain={[0, 10]} />
                                        <Tooltip
                                            content={({ payload }) => {
                                                if (!payload || !payload.length) return null;
                                                const data = payload[0].payload;
                                                const avgScoreNum = Number(data.avg_score);
                                                const avgScore = isNaN(avgScoreNum) ? '-' : avgScoreNum.toFixed(2);
                                                return (
                                                    <div className="bg-secondary rounded p-2 text-white shadow">
                                                        <strong>{data.student.user.name}</strong>
                                                        <div>Puntuación media: {avgScore}</div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Bar dataKey="avg_score" fill="#8884d8" name="Puntuación media" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </section>

                            {/* 4. Tests más realizados */}
                            <section className="bg-background rounded-xl border p-4 shadow">
                                <h2 className="mb-2 text-xl font-semibold">Tests más realizados</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={testsMasRealizados} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                        {/* Eje X sin ticks ni etiquetas */}
                                        <XAxis dataKey="test.name" tick={false} />
                                        <YAxis />
                                        <Tooltip
                                            content={({ payload }) => {
                                                if (!payload || !payload.length) return null;
                                                const data = payload[0].payload;
                                                const totalEvaluations = typeof data.total_evaluations === 'number' ? data.total_evaluations : '-';
                                                return (
                                                    <div className="bg-secondary rounded p-2 text-white shadow">
                                                        <strong>Test: {data.test.name}</strong>
                                                        <div>Evaluaciones: {totalEvaluations}</div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Area type="monotone" dataKey="total_evaluations" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </section>

                            {/* 5. Tests difíciles y fáciles */}
                            <section className="bg-background rounded-xl border p-4 shadow md:col-span-2">
                                <h2 className="mb-2 text-xl font-semibold">Tests más difíciles y fáciles</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={testsDificilesFaciles} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        {/* Eje X sin ticks ni etiquetas */}
                                        <XAxis dataKey="test.name" tick={false} />
                                        <YAxis />
                                        <Tooltip
                                            content={({ payload }) => {
                                                if (!payload || !payload.length) return null;
                                                const data = payload[0].payload;

                                                const avgScoreNum = Number(data.avg_score);
                                                const avgScore = isNaN(avgScoreNum) ? '-' : avgScoreNum.toFixed(2);

                                                const totalPassed = data.total_passed ?? '-';
                                                const totalFailed = data.total_failed ?? '-';

                                                return (
                                                    <div className="bg-secondary rounded p-2 text-white shadow">
                                                        <strong>Test: {data.test?.name || data.test_id}</strong>
                                                        <div>Puntuación media: {avgScore}</div>
                                                        <div>Aprobados: {totalPassed}</div>
                                                        <div>Suspensos: {totalFailed}</div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="avg_score" stroke="#FF8042" name="Puntuación media" />
                                        <Line type="monotone" dataKey="total_passed" stroke="#28a745" name="Total aprobados" />
                                        <Line type="monotone" dataKey="total_failed" stroke="#dc3545" name="Total suspensos" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </section>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {previewPdf && (
                <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={closeModal}>
                    <div className="relative max-h-[90vh] w-full max-w-4xl rounded bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-gray-900"
                            title="Cerrar"
                            type="button"
                        >
                            &times;
                        </button>
                        <iframe src={previewPdf} className="h-[90vh] w-full rounded-b" title="PDF ampliado" />
                        <div className="p-2 text-right">
                            <a
                                href={previewPdf}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                            >
                                Descargar PDF
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
