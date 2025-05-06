import CreateCategoryBlock from "@/components/Admin/CreateCategory";
import PendingRequests from "@/components/Admin/PendingRequests";
import { WelcomeBlock } from "@/components/Admin/WelcomeBlock";
import UserSearcherBlock from "@/components/Admin/UserSearcherBlock";
import UserTableBlock from "@/components/Admin/UserTableBlock";
import CreateAdminBlock from "@/components/Admin/CreateAdminBlock";
import AdminStats from "@/components/Admin/AdminStats";
import AdminProtect from "@/components/RouteProtect/AdminProtect";
import ReviewSearchModalBlock from "@/components/Admin/ReviewSearcher";
import ServiceProfileReviewsTable from "@/components/Admin/ServiceProfileReviewsTable";
import UpgradeUserToAdminBlock from "@/components/Admin/UpgradeUserToAdminBlock";
import ReactivateUsersTable from "@/components/Admin/ReactivateUsersTable";
import { UserProvider } from "@/contexts/UserContext";

export const metadata = {
  title: "Panel de Administración | TecniClick",
};

export default function AdminDashboard() {
  return (
    <AdminProtect>
        <UserProvider>
      <div className="p-6 space-y-6">
        {/* Primera Fila: Welcome + Acciones Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <WelcomeBlock />
            <div className="space-y-6">
              <CreateCategoryBlock />
              <CreateAdminBlock />
            </div>
          </div>
          <div className="lg:col-span-3">
            <AdminStats />
          </div>
        </div>

        {/* Segunda Fila: Solicitudes Pendientes */}
        <div className="grid grid-cols-1 gap-6">
          <PendingRequests />
        </div>

        {/* Tercera Fila: Gestión de Usuarios */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Gestión de Usuarios</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <UpgradeUserToAdminBlock />
              </div>
              <div className="lg:col-span-3">
                <UserTableBlock />
              </div>
            </div>
          </div>
        </div>

        {/* Cuarta Fila: Moderación de Reviews */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Moderación de Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <ReviewSearchModalBlock />
              </div>
              <div className="lg:col-span-3">
                <ServiceProfileReviewsTable />
              </div>
            </div>
          </div>
        </div>

        {/* Quinta Fila: Reactivación de Usuarios */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Reactivación de Usuarios</h2>
            <div className="grid grid-cols-1 gap-6">
              <ReactivateUsersTable />
            </div>
          </div>
        </div>
      </div>
      </UserProvider>
    </AdminProtect>
  );
}