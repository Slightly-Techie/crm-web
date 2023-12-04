import Image from "next/image";
import Stars from "@/assets/icons/Stars.png";
import Rocket from "@/assets/icons/blue-rocket.png";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-st-bg dark:bg-primary-dark overflow-x-hidden">
      <div className="w-screen h-screen grid lg:grid-cols-2 bg-black mx-auto">
        <>
          <div className="new-sign-upbg  lg:block  ">
            <div className="flex flex-col gap-4 justify-center p-0 lg:p-8 w-4/5 mx-auto  h-full">
              <Image
                src={Stars}
                className="hidden lg:block w-36 object-contain h-8 "
                alt="stars"
              />
              <h1 className=" text-[2rem] text-center lg:text-left md:text-[3.5rem] text-white font-bold ">
                Welcome to{" "}
                <span className="text-[#ffffffd8]">
                  Slightly Techie Network
                </span>
              </h1>
              <Image
                className=" hidden lg:block aspect-square w-20 object-contain "
                src={Rocket}
                alt="rocket"
              />
            </div>
          </div>
          <div className=" p-8 w-full md:w-[30rem] lg:w-5/6 mx-auto my-auto flex flex-col gap-4 justify-center dark:bg-primary-[#020202] h-fit">
            {children}
          </div>
        </>
      </div>
    </div>
  );
}
