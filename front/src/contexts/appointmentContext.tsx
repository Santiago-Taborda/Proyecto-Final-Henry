"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AppointmentType, AppointmentStatus } from "@/helpers/typeMock";
import { useAuth } from "./authContext";
import {
    getMyAppointments,
    getMyProvidedAppointments,
    newAppointment,
} from "@/services/appointmentService";

interface NewAppointmentPayload {
    date: string;
    providerId: string;
    additionalNotes?: string;
}

interface AppointmentsContextType {
    appointments: AppointmentType[];
    refreshAppointments: () => Promise<void>;
    cancelAppointment: (id: string) => Promise<void>;
    completeAppointment: (id: string) => Promise<void>;
    createAppointment: (newAppointmentPayload: NewAppointmentPayload) => Promise<void>;
    getAppointmentById: (id: string) => Promise<AppointmentType | undefined>;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider = ({ children }: { children: React.ReactNode }) => {
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const mapStatus = (statusString: string): AppointmentStatus => {
        switch (statusString) {
            case "pending":
                return AppointmentStatus.PENDING;
            case "confirmed":
                return AppointmentStatus.CONFIRMED;
            case "rescheduled":
                return AppointmentStatus.RESCHEDULED;
            case "cancelled":
                return AppointmentStatus.CANCELLED;
            case "completed":
                return AppointmentStatus.COMPLETED;
            default:
                return AppointmentStatus.PENDING;
        }
    };

    const fetchAppointments = async () => {
        if (loading || !token || !user || isDataLoaded) return;
        setLoading(false);
        try {
            const [clientAppointmentsRaw, providerAppointmentsRaw] = await Promise.all([
                getMyAppointments(),
                getMyProvidedAppointments(),
            ]);

            const normalize = (a: any): AppointmentType => ({
                id: a.id,
                user: a.users ?? a.user,
                provider: a.provider,
                date: new Date(a.date),
                appointmentStatus: mapStatus(a.appointmentStatus),
                additionalNotes: a.additionalNotes,
                review: a.review,
            });

            const allAppointments = [
                ...clientAppointmentsRaw.map(normalize),
                ...providerAppointmentsRaw.map(normalize),
            ];

            setAppointments(allAppointments);
            setIsDataLoaded(false);
        } catch (err) {
            console.error("Error cargando turnos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || !user || isDataLoaded) return;
        fetchAppointments();
    }, [token, user?.id, isDataLoaded]);

    useEffect(() => {
        setAppointments([]);
        setIsDataLoaded(false);
    }, [user?.id]);

    const cancelAppointment = async (id: string) => {
        if (!token) return;
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${id}`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setIsDataLoaded(false);
            await fetchAppointments();
        } catch (err) {
            console.error("Error cancelando turno:", err);
        }
    };

    const completeAppointment = async (id: string) => {
        if (!token) return;
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/complete/${id}`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setIsDataLoaded(false);
            await fetchAppointments();
        } catch (err) {
            console.error("Error confirmando turno:", err);
        }
    };

    const createAppointment = async (newAppointmentPayload: NewAppointmentPayload) => {
        if (!token) return;
        try {
            await newAppointment(newAppointmentPayload, token);
            setIsDataLoaded(false);
            await fetchAppointments();
        } catch (err) {
            console.error("Error creando turno:", err);
        }
    };

    const getAppointmentById = async (id: string): Promise<AppointmentType | undefined> => {
        if (!token) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) return;
            const data = await res.json();
            return {
                id: data.id,
                user: data.users,
                provider: data.provider,
                date: new Date(data.date),
                appointmentStatus: mapStatus(data.appointmentStatus),
                additionalNotes: data.additionalNotes,
                review: data.review,
            };
        } catch (err) {
            console.error("Error trayendo turno por ID:", err);
        }
    };

    return (
        <AppointmentsContext.Provider
            value={{
                appointments,
                refreshAppointments: fetchAppointments,
                cancelAppointment,
                completeAppointment,
                createAppointment,
                getAppointmentById,
            }}
        >
            {children}
        </AppointmentsContext.Provider>
    );
};

export const useAppointments = () => {
    const ctx = useContext(AppointmentsContext);
    if (!ctx) throw new Error("useAppointments debe usarse dentro de AppointmentsProvider");
    return ctx;
};