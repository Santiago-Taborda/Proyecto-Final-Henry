"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "@/styles/styles.css";
import GoogleButton from "../GoogleButton/GoogleButton";
import logoContraste from "../../../public/logoContraste.png";
import logo from "../../../public/logo.png";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  //handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const { token, userId } = await res.json();

      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) throw new Error("Error al obtener el usuario");

      const user = await userRes.json();

      // ✅ Validación de cuenta dada de baja
      if (user.deletedAt) {
        setError(
          "Tu cuenta ha sido dada de baja por infringir las normas de la comunidad. Contacta al soporte."
        );
        return;
      }

      await login(token, user);
      router.push("/");
    } catch (error) {
      console.error("Login fallido:", error);
      // Solo mostrar error genérico si no es por cuenta dada de baja
      if (error instanceof Error && !error.message.includes("dada de baja")) {
        setError("Correo o contraseña incorrectos");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[calc(100vh-89px)] flex flex-col md:flex-row justify-center items-center gap-4 md:gap-16 px-4 sm:px-8 md:px-16 py-8 text-primary dark:bg-primary">
      <form
        onSubmit={handleSubmit}
        className="relative oscuro shadow-xl p-4 flex flex-col items-center h-fit rounded-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-md"
      >
        <div className="flex items-center justify-center relative w-1/2 md:w-2/4 h-24">
          <Image
            src={logoContraste}
            alt="logo claro"
            fill
            className="!relative object-contain pb-4 block dark:hidden"
            priority
          />
          <Image
            src={logo}
            alt="logo oscuro"
            fill
            className="!relative object-contain pb-4 hidden dark:block"
            priority
          />
        </div>

        <div className="flex flex-col w-full mt-4">
          {/* Email */}
          <div className="container-input-login flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
            <label className="w-full sm:w-20 text-sm sm:text-base self-start">Correo</label>
            <div className="w-full flex flex-col">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@gmail.com"
                className={`impunts p-1 rounded-md shadow-md w-full ${
                  error ? "border-quinary" : ""
                }`}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="container-input-login mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
            <label className="w-full sm:w-20 text-sm sm:text-base self-start">Contraseña</label>
            <div className="w-full flex flex-col">
              <div className="w-full flex flex-row items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*******"
                  className={`impunts p-1 rounded-md shadow-md w-full ${
                    error ? "border-quinary" : ""
                  }`}
                  required
                />
                <div
                  className="pl-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            </div>
          </div>

          {/* Errores */}
          {error && <div className="mt-2 text-quinary text-sm text-center">{error}</div>}
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className={`mt-6 py-2 w-full sm:w-4/5 buttons transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        {/* Google Login (decorativo) */}
        <div className="my-4 flex flex-col items-center w-full">
          <GoogleButton />
        </div>

        {/* Link de registro */}
        <Link href="/register" className="self-center">
          <p className="text-primary dark:text-quinary hover:underline cursor-pointer text-sm sm:text-base hover:text-opacity-80 transition-colors">
            ¿No tienes cuenta? Regístrate
          </p>
        </Link>
      </form>
    </main>
  );
};

export default LoginForm;
