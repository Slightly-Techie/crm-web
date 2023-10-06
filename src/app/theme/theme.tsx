import React, { useState } from "react";
import "./index.css";
import moon from "@/assets/icons/dark-mode-black.png";
import moonlight from "@/assets/icons/dark-mode.png";
import sunlight from "@/assets/icons/light-mode.png";
import sun from "@/assets/icons/light-mode-black.png";
import Image from "next/image";
export default function ThemeSwitcher() {
  const [dark, setDark] = useState(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (prefersDarkMode) {
      console.log("hmm");
      document.documentElement.classList.add("dark");
    }

    return prefersDarkMode;
  });

  console.log("theme", dark);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    }
  }, [dark]);
  const modifySetDark = (value: any) => {
    setDark(value);
    localStorage.setItem("theme", JSON.stringify(value));
  };
  const toggleTheme = () => {
    modifySetDark(document.documentElement.classList.toggle("dark"));
  };
  return (
    <>
      {" "}
      <div
        className="flex w-[112px] justify-between items-center cursor-pointer"
        onClick={toggleTheme}
      >
        <figure>
          <Image src={dark ? sunlight : sun} alt="" />
        </figure>
        <label className="switch ">
          <input type="checkbox" onChange={toggleTheme} checked={dark} />
          <span className="slider"></span>
        </label>
        <figure>
          <Image src={dark ? moonlight : moon} alt="" />
        </figure>
      </div>
    </>
  );
}
