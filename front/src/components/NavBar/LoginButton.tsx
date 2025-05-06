/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Image from "next/image"
import Link from "next/link"
import { MouseEvent, useEffect, useState } from "react"
import { toast } from "sonner"

import { IoSearch } from "react-icons/io5";
import { MdAdminPanelSettings, MdLogin, MdLogout } from "react-icons/md";
import { FaUser, FaUserPlus } from "react-icons/fa";
import logo from "../../../public/logo.png";
import { useAuth } from "@/contexts/authContext"
import { useRouter } from "next/navigation"
import { BsEnvelopePaperFill } from "react-icons/bs"
import { RiFilePaper2Fill } from "react-icons/ri"
import { UserRole } from "@/helpers/typeMock"

const LoginButton = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
      if (!user) setIsAdmin(false)
 else if (user.role == UserRole.CUSTOMER || user.role == UserRole.PROVIDER) setIsAdmin(false)
 else if (user.role == UserRole.ADMIN || user.role == UserRole.SUPERADMIN) setIsAdmin(true)
  })

  const logoutHandler = (event: MouseEvent) => {
    event.preventDefault();
    toast.warning("Seguro que quieres cerrar sesión?", {
      action: {
        label: "Seguro",
        onClick() {
          if (isAuthenticated) {
            logout();
          }
          router.push("/");
        },
      },
      position: "top-right",
    });
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="hidden md:flex flex-1 justify-evenly items-center">
          <Link href="/services" className="btn-hundido">Buscar Servicios</Link>
          {!isAdmin ? (
            <Link href="/contact" className="btn-hundido">Contacto</Link>)
         : (<Link href="/adminDashboard" className="btn-hundido">Perfil de Administrador</Link>)}
          <Link href="/dashboard" className="btn-hundido">Perfil</Link>
          <button
            onClick={(event) => logoutHandler(event)}
            className="px-3 py-1 ml-2 rounded-md bg-secondary hover:bg-quaternary text-primary hover:text-secondary text-center"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 justify-evenly items-center">
          <Link href="/services" className="btn-hundido">Buscar Servicios</Link>
          <Link href="/terms" className="hidden xl:flex btn-hundido">Términos y Condiciones</Link>
          <div className="flex flex-nowrap justify-center items-center">
            <Link href="/login" className="text-nowrap hover:text-quaternary">Iniciar Sesión</Link>
            <Link
              href="/register"
              className="px-3 py-[2px] ml-2 rounded-md bg-secondary hover:bg-quaternary text-primary hover:text-secondary flex justify-center items-center"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}

      <ul className="md:hidden flex justify-around items-center text-secondary font-semibold py-2">
        <Link className="hover:text-quaternary transition flex justify-center items-center h-8 aspect-[5/3] relative" href="/">
          <Image src={logo} alt="logo" fill loading="lazy" style={{ objectFit: "contain" }} />
        </Link>
        <Link className="hover:text-quaternary transition" href="/services">
          <IoSearch size={30} />
        </Link>

        {isAuthenticated ? (
          <>
          {!isAdmin ? (
            <Link className="hover:text-quaternary transition" href="/contact">
              <BsEnvelopePaperFill size={30} />
            </Link>)
          : (<Link className="hover:text-quaternary transition" href="/adminDashboard">
              <MdAdminPanelSettings size={30} />
            </Link>)}
            <Link className="hover:text-quaternary transition" href="/dashboard">
              <FaUser size={30} />
            </Link>
            <button className="hover:text-quaternary transition" onClick={(event) => logoutHandler(event)}>
              <MdLogout size={30} />
            </button>
          </>
        ) : (
          <>
            <Link className="hover:text-quaternary transition" href="/terms">
              <RiFilePaper2Fill size={30} />
            </Link>
            <Link className="hover:text-quaternary transition" href="/register">
              <FaUserPlus size={30} />
            </Link>
            <Link className="hover:text-quaternary transition" href="/login">
              <MdLogin size={30} />
            </Link>
          </>
        )}
      </ul>
    </>
  );
};

export default LoginButton;
