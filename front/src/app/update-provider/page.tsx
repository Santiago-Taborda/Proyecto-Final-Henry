import ServiceProtect from "@/components/RouteProtect/ServiceProtect";
import UpdateProviderForm from "@/components/UpdateProviderForm/UpdateProviderForm";

export const metadata = {
  title: "Actualizar Perfil de Servicio | TecniClick",
};

export default function UpdateUserPage() {
    return (
        <ServiceProtect>
            <UpdateProviderForm />
        </ServiceProtect>
    );
}