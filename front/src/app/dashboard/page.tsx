import DashboardContent from "@/components/DashboardContent/DashboardContent";
import RouteProtect from "@/components/RouteProtect/RouteProtect";

export const metadata = {
  title: "Perfil | TecniClick",
};

export default function DashboardPage() {
  return (
    <RouteProtect>
      <DashboardContent />
    </RouteProtect>
  );
}
