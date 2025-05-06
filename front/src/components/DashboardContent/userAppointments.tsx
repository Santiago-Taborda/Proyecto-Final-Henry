import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppointmentType, AppointmentStatus } from "@/helpers/typeMock";
import { useAuth } from "@/contexts/authContext";
import { useAppointments } from "@/contexts/appointmentContext";
import { FaTimes, FaCheck, FaStar } from "react-icons/fa";
import { createReview } from "@/services/reviewServices";
import StarRating from "../StartRating/StartRating";

export default function UserAppointments() {
    const { user, token } = useAuth();
    const { appointments, cancelAppointment, getAppointmentById, completeAppointment } = useAppointments();
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    const [appointmentsState, setAppointmentsState] = useState<AppointmentType[]>([]);
    const [enrichedLoaded, setEnrichedLoaded] = useState(false); // 🔁 Nuevo flag

    const isProvider = user?.serviceProfile?.status === "active";

    const getStatusPriority = (s: AppointmentStatus) =>
        s === AppointmentStatus.CONFIRMED ? 1 :
            s === AppointmentStatus.COMPLETED ? 2 :
                s === AppointmentStatus.CANCELLED ? 3 : 4;

    const orderArray = (arr: AppointmentType[]) =>
        [...arr].sort((a, b) => {
            const pa = getStatusPriority(a.appointmentStatus);
            const pb = getStatusPriority(b.appointmentStatus);
            return pa !== pb ? pa - pb : new Date(a.date).getTime() - new Date(b.date).getTime();
        });

    const translateStatus = (s: AppointmentStatus) =>
        s === AppointmentStatus.PENDING ? "Pendiente" :
            s === AppointmentStatus.CONFIRMED ? "Confirmado" :
                s === AppointmentStatus.RESCHEDULED ? "Reprogramado" :
                    s === AppointmentStatus.CANCELLED ? "Cancelado" :
                        s === AppointmentStatus.COMPLETED ? "Completado" : "Desconocido";

    useEffect(() => {
        if (!appointments || appointments.length === 0 || enrichedLoaded) return;

        const load = async () => {
            const enriched = await Promise.all(
                appointments.map(async (appt) => {
                    try {
                        const full = await getAppointmentById(appt.id);
                        return full ?? appt;
                    } catch {
                        return appt;
                    }
                })
            );
            setAppointmentsState(orderArray(enriched));
            setEnrichedLoaded(true); 
        };

        load();
    }, [appointments, getAppointmentById, enrichedLoaded]);

    useEffect(() => {
        setEnrichedLoaded(false); 
    }, [appointments]);

    const handleCancel = (id: string) =>
        toast.warning("¿Seguro que quieres cancelar este turno?", {
            action: {
                label: "Sí, cancelar",
                onClick: async () => {
                    try {
                        await cancelAppointment(id);
                        setAppointmentsState((prev) =>
                            orderArray(
                                prev.map((a) =>
                                    a.id === id ? { ...a, appointmentStatus: AppointmentStatus.CANCELLED } : a
                                )
                            )
                        );
                        toast.success("Turno cancelado correctamente");
                    } catch {
                        toast.error("Hubo un error al cancelar el turno");
                    }
                },
            },
        });

    const handleComplete = (id: string) =>
        toast.info("¿Marcar este turno como completado?", {
            action: {
                label: "Sí, completar",
                onClick: async () => {
                    try {
                        await completeAppointment(id);
                        setAppointmentsState((prev) =>
                            orderArray(
                                prev.map((a) =>
                                    a.id === id ? { ...a, appointmentStatus: AppointmentStatus.COMPLETED } : a
                                )
                            )
                        );
                        toast.success("Turno completado correctamente");
                    } catch {
                        toast.error("Hubo un error al completar el turno");
                    }
                },
            },
        });

    const handleOpenReviewModal = (appointment: AppointmentType) => {
        setSelectedAppointment(appointment);
        setRating(0);
        setComment("");
    };

    const handleCloseReviewModal = () => {
        setSelectedAppointment(null);
        setRating(0);
        setComment("");
    };

    const handleSubmitReview = async () => {
        if (rating < 1 || rating > 5) {
            toast.error("Por favor, selecciona un puntaje válido entre 1 y 5.");
            return;
        }

        if (!comment.trim()) {
            toast.error("Por favor, ingresa un comentario.");
            return;
        }

        if (!token) {
            console.error("Token no disponible.");
            return;
        }

        try {
            const updatedAppointment = await createReview(selectedAppointment?.id ?? "", { rating, comment }, token);

            setAppointmentsState((prev) =>
                orderArray(
                    prev.map((a) =>
                        a.id === selectedAppointment?.id
                            ? {
                                ...a,
                                review: {
                                    id: updatedAppointment.id,
                                    createdAt: new Date(),
                                    deletedAt: null,
                                    appointment: selectedAppointment,
                                    rating,
                                    comment,
                                    user: selectedAppointment?.user ?? null,
                                    serviceProfile: selectedAppointment?.provider ?? null,
                                },
                            }
                            : a
                    )
                )
            );

            toast.success("¡Reseña enviada correctamente!");
            handleCloseReviewModal();
        } catch (error) {
            toast.error("Hubo un error al enviar la reseña.");
        }
    };

    // Filtrando los turnos por tipo
    const customerAppointments = appointmentsState.filter(appt => appt.user?.id === user?.id);
    const providerAppointments = appointmentsState.filter(appt => appt.provider?.id === user?.serviceProfile?.id);



return (
    <div className="w-full bg-quaternary/40 dark:bg-quinary/40 p-4 rounded-2xl border borders shadow-md">
        {isProvider && (
            <>
                {/* Sección: Turnos que reservaste como cliente */}
                <h2 className="text-lg font-bold mb-3 border-b pb-1">Turnos que reservaste</h2>
                {customerAppointments.length ? (
                    <div className="space-y-2">
                        {customerAppointments.map((appointment) => (
                            <div key={appointment.id} className="p-2 oscuro bg-opacity-10 rounded shadow-sm">
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <p><strong>Fecha y Hora:</strong> {new Date(appointment.date).toLocaleDateString()} - {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                        <p><strong>Estado:</strong> {translateStatus(appointment.appointmentStatus)}</p>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        {appointment.appointmentStatus !== AppointmentStatus.CANCELLED && appointment.appointmentStatus !== AppointmentStatus.COMPLETED && (
                                            <button className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded" onClick={() => handleComplete(appointment.id)} title="Completar turno">
                                                <FaCheck />
                                            </button>
                                        )}
                                        {appointment.appointmentStatus === AppointmentStatus.CANCELLED ? (
                                            <span className="text-red-500 font-semibold">Turno cancelado</span>
                                        ) : appointment.appointmentStatus === AppointmentStatus.COMPLETED ? (
                                            <span className="text-green-600 font-semibold">Turno completado</span>
                                        ) : (
                                            <button className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded" onClick={() => handleCancel(appointment.id)} title="Cancelar turno">
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {appointment.appointmentStatus === AppointmentStatus.COMPLETED && !appointment.review && (
                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleOpenReviewModal(appointment)}
                                            className="w-full py-2 bg-yellow-500 text-white rounded-lg"
                                        >
                                            Deja tu reseña
                                        </button>
                                    </div>
                                )}
                                {appointment.appointmentStatus === AppointmentStatus.COMPLETED && appointment.review && (
                                    <div className="mt-2">
                                        <button
                                            disabled
                                            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                                        >
                                            Ya has dejado una reseña
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm italic">Aún no tienes turnos reservados como cliente.</p>
                )}

                {/* Sección: Turnos que te reservaron como proveedor */}
                <h2 className="text-lg font-bold mb-3 border-b pb-1">Turnos que te reservaron</h2>
                {providerAppointments.length ? (
                    <div className="space-y-2">
                        {providerAppointments.map((appointment) => (
                            <div key={appointment.id} className="p-2 oscuro bg-opacity-10 rounded shadow-sm">
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <p><strong>Fecha y Hora:</strong> {new Date(appointment.date).toLocaleDateString()} - {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                        <p><strong>Estado:</strong> {translateStatus(appointment.appointmentStatus)}</p>
                                        <p><strong>Cliente:</strong> {appointment.user?.name ?? "—"}</p>
                                        <p><strong>Dirección:</strong> {appointment.user?.address ?? "—"}</p>
                                        <p><strong>Teléfono:</strong> {appointment.user?.phone ?? "—"}</p>
                                        <p><strong>Notas adicionales:</strong> {appointment.additionalNotes || "—"}</p>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        {appointment.appointmentStatus !== AppointmentStatus.CANCELLED && appointment.appointmentStatus !== AppointmentStatus.COMPLETED && (
                                            <button className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded" onClick={() => handleComplete(appointment.id)} title="Completar turno">
                                                <FaCheck />
                                            </button>
                                        )}
                                        {appointment.appointmentStatus === AppointmentStatus.CANCELLED ? (
                                            <span className="text-red-500 font-semibold">Turno cancelado</span>
                                        ) : appointment.appointmentStatus === AppointmentStatus.COMPLETED ? (
                                            <span className="text-green-600 font-semibold">Turno completado</span>
                                        ) : (
                                            <button className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded" onClick={() => handleCancel(appointment.id)} title="Cancelar turno">
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm italic">Aún no te han reservado turnos.</p>
                )}
            </>
        )}

        {!isProvider && (
            <>
                {/* Sección: Mis turnos agendados como cliente */}
                <h2 className="text-lg font-bold mb-3 border-b pb-1">Mis turnos agendados</h2>
                {appointmentsState.length ? (
                    <div className="space-y-2">
                        {appointmentsState.map((appointment) => (
                            <div key={appointment.id} className="p-2 oscuro bg-opacity-10 rounded shadow-sm">
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <p><strong>Fecha y Hora:</strong> {new Date(appointment.date).toLocaleDateString()} - {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                        <p><strong>Estado:</strong> {translateStatus(appointment.appointmentStatus)}</p>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        {appointment.appointmentStatus !== AppointmentStatus.CANCELLED && appointment.appointmentStatus !== AppointmentStatus.COMPLETED && (
                                            <button className="px-4 py-1 bg-green-600 text-white rounded" onClick={() => handleComplete(appointment.id)} title="Completar turno">
                                                <FaCheck />
                                            </button>
                                        )}
                                        {appointment.appointmentStatus === AppointmentStatus.CANCELLED ? (
                                            <span className="text-red-500 font-semibold">Turno cancelado</span>
                                        ) : appointment.appointmentStatus === AppointmentStatus.COMPLETED ? (
                                            <span className="text-green-600 font-semibold">Turno completado</span>
                                        ) : (
                                            <button className="px-4 py-1 bg-red-600 text-white rounded" onClick={() => handleCancel(appointment.id)} title="Cancelar turno">
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {appointment.appointmentStatus === AppointmentStatus.COMPLETED && !appointment.review && (
                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleOpenReviewModal(appointment)}
                                            className="w-full py-2 bg-yellow-500 text-white rounded-lg"
                                        >
                                            Deja tu reseña
                                        </button>
                                    </div>
                                )}
                                {appointment.appointmentStatus === AppointmentStatus.COMPLETED && appointment.review && (
                                    <div className="mt-2">
                                        <button
                                            disabled
                                            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                                        >
                                            Ya has dejado una reseña
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm italic">Aún no tienes turnos agendados.</p>
                )}
            </>
        )}

        {selectedAppointment && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-10">
                <div className="w-full bg-quaternary/40 dark:bg-quinary/40 p-4 rounded-2xl border borders shadow-md text-secondary">
                    <h3 className="font-semibold text-xl mb-4">Deja una reseña</h3>

                    <div className="mb-3">
                        <label className="block text-sm font-medium">Calificación</label>
                        <StarRating rating={rating} onChange={(newRating) => setRating(newRating)} />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium">Comentario</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border p-2 rounded dark:bg-tertiary text-tertiary dark:text-secondary"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleCloseReviewModal}
                            className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmitReview}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Enviar Reseña
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div >
);
}
