import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FooterConditional from "./Conditional";

const Footer = () => {
    return (
        <footer className="text-secondary bg-gradient-banner w-full text-xs px-4 md:px-8 xl:px-16 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start my-4 gap-4">
                <FooterConditional/>
                <div className="flex flex-col items-center">
                    <h6 className="font-bold mb-2"> Síguenos en Redes Sociales</h6>
                    <ul className="grid grid-cols-4 gap-4">
                        <li><a  href="https://facebook.com"  target="_blank" rel="noopener noreferrer"><FaFacebook  className="hover:text-quaternary transition" size={22}/> </a></li>
                        <li><a  href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:text-quaternary transition" size={22}/> </a></li>
                        <li><a  href="https://x.com"         target="_blank" rel="noopener noreferrer"><FaXTwitter  className="hover:text-quaternary transition" size={22}/> </a></li>
                        <li><a  href="https://linkedin.com"  target="_blank" rel="noopener noreferrer"><FaLinkedin  className="hover:text-quaternary transition" size={22}/> </a></li>
                    </ul>
                </div>
            </div>

            <h6 className="text-center text-sm mt-4">© 2025 TecniClick. Todos los derechos reservados.</h6>
        </footer>
    );
};

export default Footer;
