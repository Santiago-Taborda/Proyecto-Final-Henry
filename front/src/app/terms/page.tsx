import Image from "next/image";
import logoContraste from "../../../public/logoContraste.png";
import logo from "../../../public/logo.png";

export const metadata = {
    title: "Términos y Condiciones | TecniClick",
};


export default function Terms() {
    return (
        <section className="max-w-4xl mx-auto p-6 md:p-10 text-gray-800">
            <h1 className="text-3xl font-bold mb-2 text-center text-primary dark:text-secondary">
                Términos y Condiciones
            </h1>

            <p className="text-sm text-gray-500 text-center mb-6">
                Última actualización: 01/04/2025
            </p>

            <div className="bg-primary text-secondary shadow-md rounded-xl p-6 max-h-[600px] overflow-y-scroll space-y-8 border border-gray-200">
                <div>
                    <h2 className="text-xl font-semibold mb-2">1. Objeto</h2>
                    <p>
                        Esta página tiene como finalidad conectar a usuarios con profesionales especializados en servicios para el hogar, tales como plomería, electricidad, gas, jardinería, albañilería, pintura, entre otros.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">2. Registro de Usuario</h2>
                    <p>
                        Para contratar un servicio, es necesario registrarse en el sitio, proporcionando información veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">3. Contratación de Servicios</h2>
                    <p>
                        Los usuarios pueden solicitar un servicio especificando la tarea requerida, la ubicación y la fecha preferida. Los profesionales registrados en la plataforma podrán aceptar o rechazar las solicitudes según su disponibilidad.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">4. Obligaciones de los Profesionales</h2>
                    <p>
                        Los profesionales se comprometen a brindar un servicio seguro, profesional y de calidad, respetando las normas de seguridad y los horarios pactados con los usuarios.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">5. Responsabilidades del Usuario</h2>
                    <p>
                        El usuario debe brindar información precisa sobre el trabajo a realizar, permitir el acceso al domicilio en el horario acordado y abonar el costo del servicio según lo estipulado con el profesional.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">6. Pagos</h2>
                    <p>
                        Los pagos pueden realizarse de forma directa entre el usuario y el profesional, o a través de los medios habilitados en la plataforma, según se especifique en cada caso.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">7. Cancelaciones</h2>
                    <p>
                        Los usuarios podrán cancelar una solicitud con un mínimo de 24 horas de antelación sin cargo. En caso de cancelación fuera de ese plazo, podrá aplicarse un recargo. Los profesionales también deberán notificar cancelaciones con anticipación razonable.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">8. Calificaciones y Opiniones</h2>
                    <p>
                        Después de cada servicio, los usuarios podrán calificar y dejar comentarios sobre el profesional. Las calificaciones deben ser respetuosas y basarse en la experiencia real.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">9. Limitación de Responsabilidad</h2>
                    <p>
                        La plataforma actúa como intermediaria entre usuarios y profesionales. No somos responsables por daños, perjuicios o incumplimientos derivados de los servicios prestados por terceros. Sin embargo, nos comprometemos a colaborar en la resolución de conflictos.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">10. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia a partir de su publicación en el sitio.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">11. Legislación Aplicable</h2>
                    <p>
                        Estos Términos se rigen por las leyes vigentes en Latinoamérica. En caso de conflicto, las partes se someten a los tribunales competentes de dicha jurisdicción.
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center relative mt-[5vh] w-full h-24 md:h-32 2xl:h-48">
                <Image
                    src={logoContraste}
                    alt="logo claro"
                    fill
                    className="!relative object-contain pb-4 block dark:hidden"
                    priority
                />
                <Image
                    src={logo}
                    alt="logo oscuro"
                    fill
                    className="!relative object-contain pb-4 hidden dark:block"
                    priority
                />
            </div>
        </section>
    )
}