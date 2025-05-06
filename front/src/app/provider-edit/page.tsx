import ProviderEdit from "@/components/ProviderEdit/ProviderEdit";
import RouteProtect from "@/components/RouteProtect/RouteProtect";

export const metadata = {
  title: "Formulario de Proveedor | TecniClick",
};

export default function DashboardPage() {
  return (
    <RouteProtect>
      <ProviderEdit />
    </RouteProtect>
  );
}
