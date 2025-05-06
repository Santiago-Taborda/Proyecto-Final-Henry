/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Link from "next/link"
import Image from "next/image"
import logo from "../../../public/logo.png"
import LoginButton from "./LoginButton"
import DarkMode from "@/components/DarkMode/DarkMode"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/contexts/authContext" // ajusta el path si es necesario
import { getUserById } from "@/services/userService" // ajusta el path si es necesario

const NavBar = () => {
  const pathname = usePathname()
  const { user, setUser } = useAuth()

  useEffect(() => {
    const updateUser = async () => {
      if (user?.id) {
        try {
          const updatedUser = await getUserById(user.id)
          if (!updatedUser) {
            console.log("Error al actualizar usuario");
            return
          }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("Usuario actualizado!");
        } catch (error) {
          console.error("Error al actualizar el usuario:", error)
        }
      }
    }

    updateUser()
  }, [pathname])

  return (
    <>
      {/* NavBar para pantallas medianas y grandes */}
      <nav className="hidden md:flex mx-5 lg:mx-36">
        <ul className="flex flex-row justify-between items-center text-secondary font-semibold w-full">
          <Link href="/" className="w-16 h-full justify-center">
            <button className="w-full h-full relative">
              <Image
                src={logo}
                alt="logo"
                fill
                loading="lazy"
                style={{ objectFit: "contain" }}
              />
            </button>
          </Link>
          <LoginButton />
          <li>
            <DarkMode />
          </li>
        </ul>
      </nav>

      {/* NavBar para pantallas pequeñas */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-primary border-t shadow-md z-50">
        <LoginButton />
      </nav>
    </>
  )
}

export default NavBar
