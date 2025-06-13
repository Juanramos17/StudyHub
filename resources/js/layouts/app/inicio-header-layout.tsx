interface Props {
    user: any;
}

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import Dock from '@/components/reactBits/Dock/Dock';
import GooeyNav from '@/components/reactBits/GooeyNav/GooeyNav';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GoogleTranslate from '@/layouts/translate/traductor';
import { faArrowRight, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { VscAccount, VscHome, VscLibrary, VscOrganization, VscSettingsGear } from 'react-icons/vsc';

export default function MenuDesplegable({ user }: Props) {
    const [activo, setActivo] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('inicio');

    const items = [
        { label: 'Inicio', href: '#', onClick: () => setCategoriaSeleccionada('inicio') },
        { label: 'Mi academia', href: '#', onClick: () => setCategoriaSeleccionada('mi academia') },
    ];

    if (user.rol === 'admin') {
        items.push({ label: 'Admin', href: '#', onClick: () => setCategoriaSeleccionada('admin') });
    }

    const linkPerfil = () => {
        window.location.href = '/profile';
    };

    const items2 = [
        { icon: <VscHome size={18} />, label: 'Inicio', onClick: () => setCategoriaSeleccionada('inicio') },
        { icon: <VscLibrary size={18} />, label: 'Mi academia', onClick: () => setCategoriaSeleccionada('mi academia') },
        { icon: <VscSettingsGear size={18} />, label: 'Ajustes', onClick: () => setDialogOpen(true) },
    ];

    if (user.rol === 'admin') {
        items2.push({ icon: <VscOrganization size={18} />, label: 'Administrador', onClick: () => setCategoriaSeleccionada('admin') });
    }

    if (user.rol != 'admin') {
        items2.push({ icon: <VscAccount size={18} />, label: 'Perfil', onClick: () => linkPerfil() });
    }

    useEffect(() => {
        document.body.style.overflow = menuAbierto ? 'hidden' : 'auto';
    }, [menuAbierto]);

    const toggleMenu = () => setMenuAbierto(!menuAbierto);

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <header className="relative text-white shadow-md bg-white dark:bg-[#02040b]">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <nav className="mx-auto flex w-full max-w-[90%] items-center justify-between p-4">
                {/* Izquierda: Logo */}
                <div className="flex items-center gap-2">
                    <a href="/home">
                        <img
                            src="https://res.cloudinary.com/dbw3utkij/image/upload/v1747409076/LOGOSTUDYHUB_ra6mxz.png"
                            alt="Logo"
                            className="h-15 w-auto"
                        />
                    </a>
                </div>

                {/* Botón hamburguesa */}
                <button
                    onClick={toggleMenu}
                    className={`text-primary z-50 text-2xl transition-all duration-900 ${menuAbierto ? 'absolute top-12 right-20' : 'relative'}`}
                >
                    <FontAwesomeIcon icon={menuAbierto ? faTimes : faBars} />
                </button>
            </nav>

            {/* Overlay menú */}
            <div
                className={`fixed inset-0 z-40 flex overflow-y-auto transition-transform duration-900 ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Mitad izquierda: Logo */}
                <div className="bg-secondary hidden w-1/2 items-center justify-center md:flex dark:bg-[#02040b]">
                    <img
                        src="https://res.cloudinary.com/dbw3utkij/image/upload/v1747409076/LOGOSTUDYHUB_ra6mxz.png"
                        alt="Logo"
                        className="h-50 w-auto"
                    />
                </div>

                {/* Mitad derecha: Menu */}
                <div className="flex w-full flex-col justify-between bg-white px-6 py-10 md:w-1/2 dark:bg-[#0d111a]">
                    {/* Botones superiores */}
                    <div className="mb-10 hidden flex-row items-start gap-4 lg:flex">
                        <div style={{ height: '50px', position: 'relative', textAlign: 'center' }}>
                            <GooeyNav
                                items={items}
                                particleCount={15}
                                particleDistances={[90, 10]}
                                particleR={100}
                                initialActiveIndex={0}
                                animationTime={600}
                                timeVariance={300}
                                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                            />
                        </div>
                    </div>

                    {categoriaSeleccionada === 'inicio' && (
                        <div className="text-primary h-[660px] space-y-6 overflow-y-auto pr-2">
                            <h1 className="flex items-center gap-3 text-3xl font-bold">
                                <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                                <a className="border-primary border-b-2 pb-1" href="/home">
                                    Inicio
                                </a>
                            </h1>

                            {/* Información general de la plataforma */}
                            <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">📘 ¿Qué es StudyHub?</h2>
                                <p className="text-sm text-gray-800 dark:text-gray-300">
                                    StudyHub es una plataforma de formación online diseñada para ayudarte a aprender de forma eficiente y
                                    estructurada. Accede a cursos completos, realiza tests automáticos y lleva un seguimiento personalizado de tu
                                    progreso.
                                </p>
                            </div>

                            {/* Características destacadas */}
                            <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">🚀 Características destacadas</h2>
                                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800 dark:text-gray-300">
                                    <li>Tests automáticos con corrección inmediata</li>
                                    <li>Temas marcados como aprendidos</li>
                                    <li>PDFs y material de apoyo descargables</li>
                                    <li>Acceso a cursos gratuitos y de pago</li>
                                    <li>Seguimiento personalizado del alumno</li>
                                </ul>
                            </div>

                            {/* ¿Cómo funciona? */}
                            <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">🛠️ ¿Cómo funciona?</h2>
                                <p className="text-sm text-gray-800 dark:text-gray-300">
                                    Explora los cursos disponibles, elige el que te interese, y empieza a aprender a tu ritmo. Puedes realizar tests
                                    al final de cada tema, guardar los errores para repasarlos y avanzar paso a paso en tu formación.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Contenido según categoría */}
                    {categoriaSeleccionada === 'mi academia' && (
                        <div className="text-primary h-[660px] space-y-6 overflow-y-auto pr-2">
                            <h1 className="flex items-center gap-3 text-3xl font-bold">
                                <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                                <a className="border-primary border-b-2 pb-1" href="/courses">
                                    Mi Academia
                                </a>
                            </h1>

                            {/* Información sobre los cursos */}
                            <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">🎓 Tus Cursos en StudyHub</h2>
                                <p className="text-sm text-gray-800 dark:text-gray-300">
                                    Dentro de la sección de cursos podrás acceder a todos los contenidos disponibles organizados por tema y nivel.
                                    Algunas de las funcionalidades que encontrarás:
                                </p>
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-800 dark:text-gray-300">
                                    <li>Ver todos los cursos disponibles según tu rol</li>
                                    <li>Realizar tests para poner a prueba tus conocimientos</li>
                                    <li>Marcar tests como favoritos para repasarlos más tarde</li>
                                    <li>Descargar las notas de tus tests en formato PDF</li>
                                    <li>Seguir tu progreso y mejorar con cada intento</li>
                                </ul>
                            </div>
                            {/* Cómo empezar */}
                            <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">🚀 Empieza tu aprendizaje</h2>
                                <p className="text-sm text-gray-800 dark:text-gray-300">
                                    Explora los cursos activos, completa lecciones y pon a prueba tus conocimientos con nuestros tests. Tu progreso se
                                    guarda automáticamente, y puedes retomar cuando quieras.
                                </p>
                            </div>
                        </div>
                    )}

                    {categoriaSeleccionada === 'admin' && (
                        <div className="text-primary h-[660px] space-y-6 overflow-y-auto pr-2">
                            <h1 className="flex items-center gap-3 text-3xl font-bold">
                                <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                                <a className="border-primary border-b-2 pb-1" href="/admin">
                                    Administrador
                                </a>
                            </h1>

                            {/* Panel de administración */}
                            <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">🔐 Zona del Administrador</h2>
                                <p className="text-sm text-gray-800 dark:text-gray-300">
                                    Desde este panel, el administrador tiene acceso completo para gestionar todos los recursos y usuarios de la
                                    plataforma. Las funciones principales incluyen:
                                </p>
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-800 dark:text-gray-300">
                                    <li>Gestionar y validar nuevos registros de profesores y alumnos</li>
                                    <li>Subir y administrar documentos PDF y materiales didácticos</li>
                                    <li>Editar o eliminar cursos disponibles en la plataforma</li>
                                    <li>Revisar estadísticas generales de uso y rendimiento de los alumnos</li>
                                    <li>Supervisar y aprobar preguntas y tests añadidos por los profesores</li>
                                    <li>Controlar el acceso a los cursos</li>
                                </ul>
                            </div>

                            {/* Recursos del Administrador */}
                            <div className="mt-6 rounded-lg bg-gray-100 p-4 shadow dark:bg-[#1a1f2b]">
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">📁 Recursos del Administrador</h2>
                                <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                                    El panel de administrador cuenta con una zona exclusiva para la gestión avanzada de todos los recursos de la
                                    plataforma. Esta sección está diseñada para asegurar una administración eficiente, organizada y segura del
                                    contenido educativo.
                                </p>
                                <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                                    Desde aquí, los administradores pueden subir nuevos archivos PDF, editar documentos ya existentes y asignarlos a
                                    cursos específicos o temas concretos. También pueden gestionar preguntas y tests creados por los profesores,
                                    revisarlos, editarlos o eliminarlos en caso necesario.
                                </p>
                                <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                                    Todos los recursos están almacenados en un entorno protegido, con control de accesos basado en roles. Solo los
                                    administradores autorizados pueden acceder, visualizar o modificar estos documentos.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-7 mb-0 flex hidden items-center justify-between pt-2 pb-10 text-sm text-white md:pb-0 lg:flex">
                        <div className="flex items-center gap-1">
                            <button onClick={() => setDialogOpen(true)} className="text-primary rounded px-4 py-2">
                                <i className="fas fa-cog transform text-3xl transition-transform duration-300 hover:scale-110"></i>
                            </button>
                        </div>
                        <div className="text-primary flex flex-col items-center gap-2 font-bold">
                            <a href="/profile">
                                <i className="fas fa-user transform text-3xl transition-transform duration-300 hover:scale-110"></i>
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center md:absolute md:bottom-0 md:w-[44%] lg:hidden">
                        <Dock items={items2} panelHeight={68} baseItemSize={50} magnification={70} />
                    </div>

                    <div className="align-center mt-4 mb-18 flex items-center justify-center gap-2 rounded-lg bg-gray-100 p-2 text-white transition-colors duration-300 hover:bg-gray-200 lg:mb-0 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <GoogleTranslate />
                        <p className="text-primary">Ajustar idioma y desactivar para quitar barra de traducción</p>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input type="checkbox" checked={activo} onChange={() => setActivo(!activo)} className="sr-only" />
                            <div
                                className={`h-6 w-12 rounded-full bg-gray-300 transition-colors duration-300 ${
                                    activo ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            ></div>
                            <div
                                className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                    activo ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            ></div>
                        </label>
                    </div>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:mx-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Preferencias de configuración</DialogTitle>
                        <DialogDescription>Elige idioma y modo de visualización</DialogDescription>
                    </DialogHeader>

                    <hr />

                    <div className="space-y-6">
                        <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                        <AppearanceTabs />
                    </div>

                    <hr />
                </DialogContent>
            </Dialog>

            {/* OCULTAR TRADUCCION */}
            {!activo && (
                <style>
                    {`
                    #google_translate_element {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    }

                    .goog-te-gadget {
                    font-family: "Roboto", sans-serif !important;
                    font-size: 12px !important;
                    text-transform: none;
                    }

                    .goog-te-gadget-simple {
                    background-color: #ffffffcc !important;
                    border: 1px solid #ccc !important;
                    padding: 4px 8px !important;
                    border-radius: 6px !important;
                    font-size: 12px !important;
                    line-height: 1.4 !important;
                    color: #333 !important;
                    cursor: pointer;
                    }

                    .goog-te-menu-value {
                    color: #333 !important;
                    }

                    .goog-te-menu-value span:nth-child(5) {
                    display: none;
                    }

                    .goog-te-menu-value span:nth-child(3) {
                    border: none !important;
                    }

                    .goog-te-gadget-icon {
                    display: none !important;
                    }

                    .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                    }


                    .skiptranslate {display: none;}

                    body {
                    top: 0 !important;
                    position: relative !important;
                    }

                    .skiptranslate {display: none;}

                    @media (max-width: 667px) {
                    #google_translate_element {
                        left: 16px !important;
                        right: auto;
                        bottom: 16px;
                    }

                    .goog-te-gadget-simple {
                        width: auto !important;
                        text-align: center;
                    }
                    }

                    /* Oculta el banner que aparece arriba o abajo con las valoraciones y controles */
                    .goog-te-banner-frame.skiptranslate,
                    .goog-te-balloon-frame {
                    display: none !important;
                    }

                    /* Oculta el texto "Powered by Google Translate" que aparece abajo */
                    #goog-gt-tt, /* tooltip */
                    .goog-tooltip,
                    .goog-tooltip:hover,
                    .goog-tooltip div {
                    display: none !important;
                    background: none !important;
                    }

                    .VIpgJd-ZVi9od-aZ2wEe-wOHMyf{
                    display: none !important;
                    }

                `}
                </style>
            )}
        </header>
    );
}
