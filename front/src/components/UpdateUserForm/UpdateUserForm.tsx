"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { updateUser } from "@/services/userService";
import { toast } from "sonner";

const UpdateUserForm = () => {
    const router = useRouter();
    const { user, token, setUser } = useAuth();

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.id) {
            toast.error("Usuario no autenticado.");
            return;
        }

        try {
            const response = await updateUser(user.id, Number(phone), address, token!);
            if (response) {
                setUser(response);
                localStorage.setItem("user", JSON.stringify(response));
                toast.success("Datos actualizados correctamente.");
                router.back();
            }
        } catch (err) {
            toast.error("Hubo un error al actualizar los datos.");
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-[15vh] p-4">
            <h2 className="text-2xl font-semibold">Actualizar datos de usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md shadow-md">
                <div>
                    <label className="block text-sm font-medium">Teléfono</label>
                    <input
                        type="text"
                        className="w-full dark:text-tertiary border rounded-md"
                        placeholder="Ej: 1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Dirección</label>
                    <input
                        type="text"
                        className="w-full dark:text-tertiary border rounded-md"
                        placeholder="Ej: Calle Falsa 123"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="buttons px-4 py-2 rounded">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
};

export default UpdateUserForm;
