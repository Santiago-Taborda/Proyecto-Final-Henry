import { UserType } from "@/helpers/typeMock";
import { usersMock } from "@/helpers/dataMock";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MODE = process.env.NEXT_PUBLIC_MODE;

export const getUsers = async (): Promise<UserType[]> => {
    // TODO: Implementar la lógica para obtener todos los usuarios
    try {
        if (MODE === "developer") {
            // ! Mock
            return usersMock;
        } else if (MODE === "production") {
            const response = await fetch(`${API_URL}/users`, { cache: "no-cache" });
            return await response.json() || [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }

    return [];
}

export const getUserById = async (id: string): Promise<UserType> => {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, { cache: "no-cache" }); {/* service-profile/{id} */ }
        if (!response.ok) throw new Error("No se pudo obtener el usuario");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error
    }
};


export const getUserByEmail = async (email: string): Promise<UserType | null> => {
    // TODO: Implementar la lógica para obtener el perfil del usuario por email
    try {
        if (MODE === "developer") {
            // ! Mock
            return usersMock.find((user) => user.email === email) || null;
        } else if (MODE === "production") {
            const response = await fetch(`${API_URL}/users/${email}`, { cache: "no-cache" });
            return await response.json() || null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return null;
}

export const updateUser = async (
    id: string,
    phone: number,
    address: string,
    token: string
) => {
    try {
        const updatedData: { phone?: number; address: string } = { address };

        if (phone && phone !== 0) {
            updatedData.phone = phone;
        }

        const response = await fetch(`${API_URL}/users/update/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('No se pudo actualizar la información del usuario');
        }

        const result = await response.json();

        toast.success("Datos actualizados correctamente.");
        return result;
    } catch (err) {
        toast.error("Hubo un error al actualizar los datos.");
        console.error(err);
    }
};

export const deleteUser = async (id: string): Promise<boolean> => {
    // TODO: Implementar la lógica para eliminar el perfil del usuario por id
    try {
        if (MODE === "developer") {
            // ! Mock
            return true;
        } else if (MODE === "production") {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: "DELETE",
            });
            return await response.json() || false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }

    return false;
}

interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: number;
    address?: string;
}

export const updateUserDashboard = async (id: string, userData: UpdateUserDto, token: string): Promise<UpdateUserDto> => {
    try {
        const response = await fetch(`${API_URL}/users/update/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            // Capturamos el mensaje de error en caso de que la respuesta no sea ok (ej. 409)
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error(errorData.message || 'Error al actualizar el perfil');
        }

        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        console.error('Fallo la actualización del perfil:', error);
        throw error;
    }
};
