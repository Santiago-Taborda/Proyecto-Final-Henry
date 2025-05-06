'use client';
import Image from "next/image";
import googleIcon from "../../../public/googleIcon.png"


export default function GoogleButton() {
  const handleLoginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`;
  };
  return (
    <button
      type="button"
      onClick={handleLoginWithGoogle}
      className="flex flex-row gap-1 py-1 px-8 text-black bg-senary shadow-md shadow-gray-300 dark:shadow-gray-500 rounded font-semibold">
      Iniciar sesión con
      <Image
        src={googleIcon}
        alt="icon"
        className="w-16"
      />
    </button>
  );
}