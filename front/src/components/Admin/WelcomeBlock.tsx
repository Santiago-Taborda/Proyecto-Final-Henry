'use client'
import Image from "next/image";
import { Calendar, Clock, UserCheck } from "react-feather";
import admin from "../../../public/admin.png";

export function WelcomeBlock() {
  // Formateador de fecha
  const formatLastAccess = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      })
    };
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full flex flex-col">
      {/* Encabezado con avatar */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20">
            <Image
              src={admin}
              alt="Administrador"
              fill
              className="rounded-full object-cover border-4 border-blue-100 dark:border-gray-600"
              priority
            />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">¡Bienvenido al Panel!</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Herramientas de administración disponibles
        </p>
      </div>

      {/* Información contextual */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-2 bg-blue-100 dark:bg-gray-600 rounded-full">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha actual</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {formatLastAccess().date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-2 bg-blue-100 dark:bg-gray-600 rounded-full">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Último acceso</p>
            <p className="font-medium text-gray-800 dark:text-white">
              Hoy a las {formatLastAccess().time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-2 bg-blue-100 dark:bg-gray-600 rounded-full">
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tu rol</p>
            <p className="font-medium text-gray-800 dark:text-white">
              Administrador Principal
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Sistema operativo • Versión 1.0.0
        </p>
      </div>
    </section>
  );
}