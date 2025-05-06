import { CategoryType } from "@/helpers/typeMock";
import { categoriesMock } from "@/helpers/dataMock";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MODE = process.env.NEXT_PUBLIC_MODE;

export const getCategories = async (): Promise<CategoryType[]> => {
    // TODO: Implementar la lógica para obtener todas las categorías
    try {
        // if (MODE === "developer") {
        //     // ! Mock
        //     return categoriesMock;
        // } else if (MODE === "production") {
            const response = await fetch(`${API_URL}/categories`, { cache: "no-cache" });
            return await response.json() || [];
        // }
    } catch (error) {
        console.error(error);
        return [];
    }

    return [];
}

export const getCategoryById = async (id: string): Promise<CategoryType | null> => {
    // TODO: Implementar la lógica para obtener la categoría por id
    try {
        if (MODE === "developer") {
            // ! Mock
            return categoriesMock.find((category) => category.id === id) || null;
        } else if (MODE === "production") {
            const response = await fetch(`${API_URL}/categories/${id}`, { cache: "no-cache" });
            return await response.json() || null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

