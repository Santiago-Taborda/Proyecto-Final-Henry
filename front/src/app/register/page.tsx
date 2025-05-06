import RegisterProtect from "@/components/RouteProtect/RegisterProtect";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import React from "react";

export const metadata = {
  title: "Registrarse | TecniClick",
};

export default function RegisterPage() {
  return (
    <RegisterProtect>
      <RegisterForm />
    </RegisterProtect>
  );
}
