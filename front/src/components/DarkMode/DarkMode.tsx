"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import light from "../../../public/light.png";
import dark from "../../../public/dark.png";
import auto from "../../../public/auto.png";

const DarkMode = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      localStorage.setItem("theme", "system");
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <div className="flex justify-end gap-2 w-36">
      <button
        onClick={() => setTheme("light")}
        className={`px-4 py-2 rounded btn-hundido border-secondary ${theme === "light" ? "bg-quaternary border" : "bg-senary"}`}
      >
        <Image src={light} alt="light" className="w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-2 rounded btn-hundido border-secondary ${theme === "dark" ? "bg-quaternary border" : "bg-senary"}`}
      >
        <Image src={dark} alt="dark" className="w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-4 py-2 rounded btn-hundido border-secondary ${theme === "system" ? "bg-quaternary border" : "bg-senary"}`}
      >
        <Image src={auto} alt="auto" className="w-4" />
      </button>
    </div>
  );
};

export default DarkMode;
