"use client"

import { useAuth } from "@/contexts/authContext"
import Link from "next/link"
import { FaEnvelope, FaFileContract, FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa"
import { IoSearch } from "react-icons/io5"
import { MdHomeRepairService } from "react-icons/md"

const FooterConditional = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <ul className="text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/">             <FaHome              size={22}/> Inicio                   </Link></li>
                     <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/services">     <IoSearch            size={22}/> Buscar Servicios         </Link></li>
{!isAuthenticated && <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/register">     <FaUserPlus          size={22}/> Registrarse              </Link></li>}
{!isAuthenticated && <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/login">        <FaSignInAlt         size={22}/> Iniciar Sesión           </Link></li>}
 {isAuthenticated && <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/provider-edit"><MdHomeRepairService size={22}/> Conviertase en Proveedor </Link></li>}
 {isAuthenticated && <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/contact">      <FaEnvelope          size={22}/> Contacto                 </Link></li>}
                     <li><Link className="flex flex-row items-center gap-3 hover:text-quaternary transition" href="/terms">        <FaFileContract      size={22}/> Términos y Condiciones   </Link></li>
    </ul>
  )
}

export default FooterConditional