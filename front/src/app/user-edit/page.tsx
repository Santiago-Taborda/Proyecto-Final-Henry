import RouteProtect from "@/components/RouteProtect/RouteProtect";
import UserDashboardEditForm from "@/components/UserDashboardEditForm/UserDashboardEditForm";

export const metadata = {
  title: "Editar Perfil | TecniClick",
};

export default function Page() {
  return (
    <RouteProtect>
      <UserDashboardEditForm />
    </RouteProtect>
  );
}