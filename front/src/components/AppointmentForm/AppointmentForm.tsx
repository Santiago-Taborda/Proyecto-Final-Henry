'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { toast } from "sonner";
import { newAppointment } from "@/services/appointmentService";

const AppointmentForm = () => {
    const router = useRouter();
    const { user, token } = useAuth();
    const searchParams = useSearchParams();
    const providerId = searchParams.get("id");

    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!providerId) {
            toast.error("Proveedor no encontrado.");
            router.push("/");
        }

        if (user && (
            !user.phone || user.phone === "0" ||
            !user.address || user.address === "Dirección no especificada"
        )) {
            toast.error("Faltan datos importantes en tu perfil. Por favor, actualiza tu información.");
            router.push(`/update-user?id=${user.id}`);
        }
    }, [providerId, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.id) {
            toast.error("Usuario no autenticado.");
            return;
        }

        if (!providerId) {
            toast.error("Proveedor no encontrado.");
            return;
        }

        const selectedDate = new Date(date);
        const now = new Date();

        if (selectedDate < now) {
            toast.error("No se puede reservar un turno en el pasado.");
            return;
        }

        const diffInMs = selectedDate.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 2) {
            toast.error("El turno debe reservarse con al menos 2 horas de anticipación.");
            return;
        }

        const payload = {
            date: selectedDate.toISOString(),
            providerId,
            additionalNotes: notes,
        };

        try {
            const response = await newAppointment(payload, token!);
            if (response) {
                toast.success("Turno creado con éxito. Te llegará un correo con los detalles.");
                router.refresh()
                router.push("/dashboard");
            } else {
                toast.error("Hubo un error al crear el turno.");
            }
        } catch (err) {
            toast.error("Hubo un error al crear el turno.");
            console.error(err);
        }
    };

    if (!providerId) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="max-w-[64rem] mx-auto mt-[15vh] p-4 oscuro shadow-2xl rounded-md space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold">Reservar Turno</h2>

                <div>
                    <label className="block text-sm font-medium">Fecha y hora</label>
                    <input
                        type="datetime-local"
                        className="w-full impunts impunts-2 dark:bg-gradient-to-r dark:from-40% dark:from-primary dark:via-50% dark:via-blue-950 dark:to-100% dark:to-senary "
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Indica tu problema o consulta</label>
                    <textarea
                        className="w-full impunts impunts-2"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Volver atrás
                    </button>

                    <button type="submit" className="buttons px-4 py-2 rounded">
                        Confirmar turno
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;
