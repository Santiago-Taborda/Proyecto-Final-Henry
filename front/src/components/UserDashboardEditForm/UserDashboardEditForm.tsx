"use client";
import { useAuth } from "@/contexts/authContext";
import { UpdateUserDto } from "@/helpers/typeMock";
import { updateUserDashboard } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UserDashboardEditForm() {
    const router = useRouter();
    const { user, token, setUser } = useAuth();

    const [email, setEmail] = useState(user?.email || "");  // Inicializamos el email con el valor actual
    const [phone, setPhone] = useState(user?.phone || "");
    const [address, setAddress] = useState(user?.address || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.id) {
            toast.error("Usuario no autenticado.");
            return;
        }

        // Solo enviar el email si el usuario ha cambiado su correo
        const updatedData: UpdateUserDto = {
            email: email !== user.email ? email : undefined,  // Solo incluir email si ha cambiado
            phone: phone !== user.phone ? Number(phone) : undefined,  // Solo incluir phone si ha cambiado
            address: address !== user.address ? address : undefined,  // Solo incluir address si ha cambiado
        };

        try {
            const response = await updateUserDashboard(user.id, updatedData, token!);
            if (response) {
                setUser({ ...user, ...response, phone: String(response.phone) });
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
        <div className="max-w-[64rem] mx-auto mt-[15vh] p-4">
            <h2 className="text-2xl font-semibold w-full text-center">Actualizar datos de usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4 oscuro shadow-2xl p-4 rounded-md">
                <div>
                    <label className="block text-sm font-medium">Correo electrónico</label>
                    <input
                        type="email"
                        className="w-full impunts impunts-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Teléfono</label>
                    <input
                        type="text"
                        className="w-full max-w-[64rem] impunts impunts-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Dirección</label>
                    <input
                        type="text"
                        className="w-full max-w-[64rem] impunts impunts-2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <button type="submit" className="buttons px-4 py-2 rounded">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}
