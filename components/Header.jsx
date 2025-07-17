import { useEffect, useState } from "react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

const inicialStateDarkMode = localStorage.getItem('theme') === 'dark';

export const Header = () => {
  const [darkMode, setDarkMode] = useState(inicialStateDarkMode);

  useEffect(() => {
    darkMode
      ? (() => {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        })()
      : (() => {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        })();
  }, [darkMode]);

  return (
    <header className="container mx-auto px-4 pt-8 md:max-w-xl">
      <div className="flex justify-between">
        <h1 className="uppercase text-white text-3xl font-semibold tracking-[0.3em]">
          ToDo
        </h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};
