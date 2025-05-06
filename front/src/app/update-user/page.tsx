import RouteProtect from "@/components/RouteProtect/RouteProtect";
import UpdateUserForm from "@/components/UpdateUserForm/UpdateUserForm";

export const metadata = {
  title: "Completar Perfil | TecniClick",
};

export default function UpdateUserPage() {
    return (
        <RouteProtect>
            <UpdateUserForm />
        </RouteProtect>
    );
}