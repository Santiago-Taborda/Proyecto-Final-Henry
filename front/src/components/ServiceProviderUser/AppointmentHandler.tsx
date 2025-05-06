"use client";

import { MouseEvent } from "react";
import { toast } from "sonner";

type Props = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  isAuthenticated: boolean;
};

const AppointmentHandler = ({ onClick, isAuthenticated }: Props) => {
  const handler = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para poder reservar un turno!");
      return;
    }

    if (onClick) {
      onClick(event); // Llamar al onClick pasado como prop
    }
  };

  return (
    <div className="p-4 w-full flex justify-center items-center">
      <button
        className="py-1 px-8 bg-primary hover:bg-quaternary dark:bg-quinary dark:hover:bg-[#ff1251] text-secondary rounded-md"
        onClick={handler}
      >
        Agregar turno a la agenda
      </button>
    </div>
  );
};

export default AppointmentHandler;
