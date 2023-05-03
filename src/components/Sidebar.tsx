import React from "react";
import Bag from "../assets/icons/bag.png";
import Person from "../assets/icons/person.png";
import Cart from "../assets/icons/cart.png";
import { NavbarProps } from "../types/type";

function Sidebar({ isOpen }: NavbarProps) {
  return (
    <>
      <aside className="py-6 px-3 lg:px-5 sm:w-15 lg:w-20 border-r-[#DCDDE1] border-r bg-white hidden sm:block">
        <div className="bg-secondary p-2 mx-auto rounded-sm text-white">
          <h1 className="font-bold text-xl">ST</h1>
        </div>

        <div className="grid gap-8 mt-10 place-items-center">
          <img src={Bag} alt="Bag icon" />

          <img src={Person} alt="Person icon" />

          <img src={Cart} alt="Cart icon" />
        </div>
      </aside>

      {isOpen && (
        <aside className="py-6 px-5 w-20 border-r-[#DCDDE1] border-r bg-white z-40 fixed left-0 bottom-0 top-0">
          <div className="bg-secondary p-2 mx-auto rounded-sm text-white">
            <h1 className="font-bold text-xl">ST</h1>
          </div>

          <div className="grid gap-8 mt-10 place-items-center">
            <img src={Bag} alt="Bag icon" />

            <img src={Person} alt="Person icon" />

            <img src={Cart} alt="Cart icon" />
          </div>
        </aside>
      )}
    </>
  );
}

export default Sidebar;
