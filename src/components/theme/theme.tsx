"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import "./index.css";
// import moon from "@/assets/icons/dark-mode-black.png";
// import moonlight from "@/assets/icons/dark-mode.png";
// import sunlight from "@/assets/icons/light-mode.png";
// import sun from "@/assets/icons/light-mode-black.png";
// import Image from "next/image";

export default function ThemeSwitcher() {
  const { systemTheme, theme, setTheme } = useTheme();
  // const [dark, setDark] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const prefersDarkMode = window.matchMedia(
  //       "(prefers-color-scheme: dark)"
  //     ).matches;

  //     if (prefersDarkMode) {
  //       document.documentElement.classList.add("dark");
  //     }

  //     return prefersDarkMode;
  //   }
  // });
  // React.useEffect(() => {
  //   if (dark) {
  //     document.documentElement.classList.add("dark");
  //   }
  // }, [dark]);
  // const modifySetDark = (value: any) => {
  //   setDark(value);
  //   localStorage.setItem("theme", JSON.stringify(value));
  // };
  // const toggleTheme = () => {
  //   modifySetDark(document.documentElement.classList.toggle("dark"));
  // };

  return (
    // <>
    //   {" "}
    //   <div
    //     className="flex w-[112px] justify-between items-center cursor-pointer"
    //     onClick={toggleTheme}
    //   >
    //     <figure>
    //       <Image src={dark ? sunlight : sun} alt="" />
    //     </figure>
    //     <label className="switch ">
    //       <input type="checkbox" onChange={toggleTheme} checked={dark} />
    //       <span className="slider"></span>
    //     </label>
    //     <figure>
    //       <Image src={dark ? moonlight : moon} alt="" />
    //     </figure>
    //   </div>
    // </>
    <button
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className={`hover:scale-105 ease duration-500 aspect-square p-1 w-fit grid place-items-center cursor-pointer border ${
        theme === "light" ? "border-primary-dark" : "border-primary-light"
      } rounded`}
    >
      {theme === "light" ? (
        <RiMoonLine className="text-primary-dark" />
      ) : (
        <RiSunLine className=" text-primary-light" />
      )}
    </button>
  );
}
