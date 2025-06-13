export default function Footer() {
    return (
         <footer className="text-gray-800 bg-white dark:bg-[#02040b] dark:text-gray-300 px-6 py-8 text-sm text-center ">
            <div className="max-w-5xl mx-auto space-y-3">
                <p>© {new Date().getFullYear()} Study Hub. Todos los derechos reservados.</p>
                <p>
                    Contacto:{" "}
                    <a
                        href="mailto:soporte@studyhub.com"
                        className="text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                        soporte@studyhub.com
                    </a>
                </p>
                <p>Teléfono: +34 600 000 000</p>
                <p>Dirección: Calle del Conocimiento 123, Madrid, España</p>
            </div>
        </footer>
    );
}
