import Image from "next/image";
import LeftImage from "@/assets/images/Left.png";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="lg:h-screen lg:block sticky top-0 bg-white lg:bg-surface-dark">
          <Image
            src={LeftImage}
            alt="Collaborative workspace"
            className="hidden lg:block w-full object-cover h-screen"
          />
        </div>

        <div className="w-full min-h-screen flex items-center justify-center p-6 sm:p-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-on-surface">ST Network</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
