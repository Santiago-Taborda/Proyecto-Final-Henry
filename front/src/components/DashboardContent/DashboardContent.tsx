/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/contexts/authContext";
import { useAppointments } from "@/contexts/appointmentContext";
import UserImage from "./UserImage";
import UserInfo from "./UserInfo";
import UserInterests from "./UserInterests";
import UserAppointments from "./userAppointments";
import ServiceButton from "./ServiceButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getServiceProfileById } from "@/services/profileService";
import { ServiceProfileStatus, ServiceProfileType, SubscriptionStatus } from "@/helpers/typeMock";
import DarkMode from "../DarkMode/DarkMode";

export default function DashboardContent() {
    const { user, token } = useAuth();
    const { refreshAppointments } = useAppointments();
    const [isLoading, setIsLoading] = useState(true);
    const [serviceProfile, setServiceProfile] = useState<ServiceProfileType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isLoggedIn = !!user;

    // Función para cargar el perfil de servicio
    const loadServiceProfile = async () => {
        if (!user?.serviceProfile?.id) {
            setIsLoading(false);
            return;
        }

        try {
            const profile = await getServiceProfileById(user.serviceProfile.id);
            setServiceProfile(profile);
            setError(null);
        } catch (err) {
            setError("Error al cargar el perfil de servicio");
            console.error("Error loading service profile:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            loadServiceProfile();
            refreshAppointments();
        } else {
            setIsLoading(false);
        }
    }, [user, token]);

    // Verificación robusta del estado premium con datos del serviceProfile
    const isPremium = serviceProfile?.subscription.status == SubscriptionStatus.ACTIVE &&
        serviceProfile?.subscription?.expirationDate &&
        new Date(serviceProfile.subscription.expirationDate) > new Date();

    let params: [string, string] = ["/login", "Inicie sesión primero"];

    if (!serviceProfile) {
        params = ["/provider-edit", "Ofrecer un servicio"];
    } else if (serviceProfile.status == ServiceProfileStatus.PENDING) {
        params = ["/dashboard", "Su solicitud está en revisión"];
    } else if (serviceProfile.status == ServiceProfileStatus.REJECTED) {
        params = ["/provider-edit", "Solicitud rechazada, enviar otra modificada"];
    } else if (serviceProfile.status == ServiceProfileStatus.ACTIVE) {
        if (!isPremium) {
            params = ["/provider-premium", "Hazte Premium"];
        } else {
            const expiration = serviceProfile.subscription.expirationDate 
                ? new Date(serviceProfile.subscription.expirationDate) 
                : new Date();
            const formatted = expiration.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
            params = ["/dashboard", `Perfil Premium ✅ - Vence el ${formatted}`];
        }
    }

    if (isLoading) {
        return (
            <section className="w-full min-h-screen bg-background px-6 py-10 md:px-[10%] dark:text-white flex justify-center items-center">
                <div className="text-center">Cargando...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full min-h-screen bg-background px-6 py-10 md:px-[10%] dark:text-white flex justify-center items-center">
                <div className="text-center text-red-500">{error}</div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-screen bg-background px-6 py-10 md:px-[10%] dark:text-white">
            {isLoggedIn ? (
                <div className="max-w-6xl mx-auto flex flex-col gap-8 items-center">
                    <div className="flex flex-col items-center gap-4">
                        <UserImage
                            imgUrl={serviceProfile?.profilePicture ?? user?.serviceProfile?.profilePicture ?? undefined}
                            name={user?.name ?? "Usuario"}
                        />
                        <h1 className="text-2xl font-semibold text-center">
                            ¡Bienvenido/a {user?.name}!
                        </h1>
                    </div>

                    {user && (
                        <>
                            <ServiceButton params={params} />

                            {/* Mostrar botón solo si tenemos un serviceProfile activo */}
                            {serviceProfile?.status === "active" && (
                                <Link
                                    href={{
                                        pathname: "/update-provider",
                                        query: { serviceProfileId: serviceProfile.id }
                                    }}
                                    className="px-6 py-2 rounded-lg bg-quaternary dark:bg-quinary text-white font-semibold hover:scale-105 transition-all text-center"
                                >
                                    {isPremium ? "Editar perfil premium" : "Editar perfil de servicio"}
                                </Link>
                            )}
                        </>
                    )}

                    <div className="flex justify-center items-center py-3 md:hidden">
                        <h3 className="pr-1">Cambiar apariencia:</h3>
                        <DarkMode/>
                    </div>

                    <div className="flex flex-wrap gap-6 w-full justify-center">
                        <div className="flex-1">
                            <UserInfo
                                email={user?.email ?? ""}
                                phone={user?.phone !== "0" ? user?.phone : "No especificado"}
                                address={user?.address !== "Dirección no especificada" ? user?.address : "No especificado"}
                            />
                        </div>

                        {Array.isArray(user?.interests) && user?.interests.length > 0 && (
                            <div className="flex-1">
                                <UserInterests interests={user.interests} />
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        <UserAppointments />
                    </div>
                </div>
            ) : (
                <h1 className="text-center text-xl mt-20">
                    Por favor, registrese e inicie sesión
                </h1>
            )}
        </section>
    );
}