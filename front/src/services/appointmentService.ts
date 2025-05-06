import { AppointmentType } from "@/helpers/typeMock";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NewAppointmentPayload {
    date: string;
    providerId: string;
    additionalNotes?: string;
}

export const newAppointment = async (
    payload: NewAppointmentPayload,
    token: string
): Promise<AppointmentType> => {
    if (!token) throw new Error("Token requerido");

    const response = await fetch(`${API_URL}/appointments/createAppointment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (!response.ok) {
        throw new Error(data.message || "Error al crear el turno");
    }

    return {
        id: data.id,
        user: data.user,  // o `users`, depende de tu backend
        provider: data.provider,
        date: new Date(data.date),
        appointmentStatus: data.appointmentStatus,
        additionalNotes: data.additionalNotes,
        review: data.review,
    };
};



export const getMyAppointments = async (): Promise<AppointmentType[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró token en localStorage");

    const res = await fetch(`${API_URL}/appointments/myAppointments`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data: AppointmentType[] = await res.json();
    return data;
};

export const getMyProvidedAppointments = async (): Promise<AppointmentType[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró token en localStorage");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/providerappt`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }
    );

    if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
};

export const cancelAppointment = async (id: string, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al cancelar el turno');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al cancelar el turno:', error);
        throw error;
    }
};


export const getAppointmentById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
            method: 'GET',

        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener el turno`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getAppointmentById:', error);
        return undefined;
    }
};

export const completeAppointment = async (id: string, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/complete/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('No se pudo completar el turno.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al completar el turno:', error);
        throw error;
    }
};