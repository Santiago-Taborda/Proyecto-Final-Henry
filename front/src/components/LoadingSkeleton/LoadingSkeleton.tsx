import Image from "next/image";
import logo from "../../../public/logo.png";

export default function LoadingSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-pulse">
          {/* Logo para modo claro */}
          <Image src={logo} alt="logo claro" className="w-32 sm:w-64 block dark:hidden" priority/>
        </div>
        <p className="mt-4 text-lg animate-pulse">Cargando...</p>
      </div>
    );
};
