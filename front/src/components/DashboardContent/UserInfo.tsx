import { useAuth } from "@/contexts/authContext";
import Link from "next/link";

export default function UserInfo({
  email,
  phone,
  address,
}: {
  email: string;
  phone: string;
  address: string;
}) {
  const { user } = useAuth();
  return (
    <div className="w-full bg-quaternary/40 dark:bg-quinary/40 p-4 rounded-2xl border borders shadow-md">
      <div className="flex items-baseline justify-between mb-4 border-b">
        <h2 className="text-lg font-bold mb-3 pb-1">Información personal</h2>
        <Link href="/user-edit">
          <button className="text-sm text-secondary dark:text-secondary border rounded-md p-1 bg-quaternary dark:bg-quinary font-semibold hover:scale-105 transition-all">
            Editar mi perfil
          </button>
        </Link>
      </div>
      <ul className="space-y-1 font-semibold">
        <li>Email: {email}</li>
        <li>Teléfono: {phone}</li>
        <li>Dirección: {address}</li>
      </ul>
    </div>
  );
}
