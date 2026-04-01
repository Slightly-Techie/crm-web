import Image from "next/image";
import LeftImage from "@/assets/images/Left.png";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="lg:h-screen lg:block sticky top-0 bg-white lg:bg-surface-dark">
          <Image
            src={LeftImage}
            alt="Collaborative workspace"
            className="hidden lg:block w-full object-cover h-screen"
          />
        </div>

        <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-white">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
