// src/services/reviewService.ts

import { ReviewType } from "@/helpers/typeMock";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;

export const createReview = async (
    appointmentId: string,
    reviewData: { rating: number; comment: string },
    token: string
): Promise<ReviewType> => {
    const res = await fetch(`${BASE_URL}/${appointmentId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData)
    });

    if (!res.ok) {
        throw new Error("Error al crear la review");
    }

    return res.json();
};

export const getReviewsByServiceProfile = async (
    serviceProfileId: string
): Promise<ReviewType[]> => {
    try {
        const res = await fetch(`${BASE_URL}/service-profile/${serviceProfileId}`);

        if (!res.ok) {
            throw new Error("Error al obtener las reviews");
        }

        const data = await res.json();

        // Asegura que siempre devuelva un array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        return []; // Devuelve array vacío si hay error
    }
};

