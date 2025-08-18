
import { useEffect, useState } from "react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";
import swasSiglasBy from '../assets/swas-siglas-by.svg';

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
    <header className="container py-4" style={{maxWidth: 600}}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-end gap-2">
          <h1 className="text-uppercase text-white fw-bold fs-2 letter-spacing-2 mb-0" style={{letterSpacing:'2px',lineHeight:'1'}}>
            ToDo
            <img
              src={swasSiglasBy}
              alt="SWAS Siglas by Logo"
              style={{
                height: 22,
                width: 70,
                marginLeft: 6,
                marginBottom: '-2px',
                display: 'inline-block',
                verticalAlign: 'sub',
                borderRadius: 8,
                background: '#fff',
                boxShadow: '0 1px 6px #0d6efd22'
              }}
              draggable={false}
            />
          </h1>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};
