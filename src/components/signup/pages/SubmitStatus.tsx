import React, { SVGProps } from "react";
import CheckIcon from "@/assets/icons/check-icon.svg";
import { formatDate } from "@/utils";
import { Status } from "@/types";
import LoadingSpinner from "@/components/loadingSpinner";
import Image from "next/image";

type StatusProp = {
  status: Status;
  message?: string;
  resetForm: () => void;
};

const Error = ({
  message,
  resetForm,
}: {
  message?: string;
  resetForm: () => void;
}) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-white dark:bg-surface">
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-5xl">error</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-on-surface text-center mb-2 font-headline">
          Registration Failed
        </h1>

        {message && (
          <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-6">
            <p className="text-on-surface text-center">{message}</p>
          </div>
        )}

        <button
          type="button"
          onClick={resetForm}
          className="w-full bg-primary text-on-primary font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
const Success = ({ name = "" }) => {
  const date = new Date(); // Current date
  const formattedDate = formatDate(date);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-2 md:p-4">
      <div className="max-w-3xl w-full bg-surface-container-lowest border border-outline rounded-2xl p-8 md:p-12 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary text-5xl">celebration</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-surface mb-3 font-headline">
            You are the real MVP, {name}!
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant">
            Thank you for signing up 🎉
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-surface-container border border-outline rounded-xl p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-3">
            Your application is being reviewed
          </h2>
          <p className="text-on-surface-variant mb-6 leading-relaxed">
            We are currently reviewing your account information and will get in touch with you shortly.
            In the meantime, keep an eye on your email inbox. We'll be sending you an email with the
            next steps to join the network.
          </p>

          {/* Status Steps */}
          <div className="space-y-4">
            {/* Step 1: Completed */}
            <div className="flex gap-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-xl">check</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface mb-1">Application Submitted</h3>
                <p className="text-sm text-on-surface-variant mb-2">{formattedDate}</p>
                <p className="text-sm text-on-surface">
                  We're reviewing your account information.
                </p>
              </div>
            </div>

            {/* Step 2: Pending */}
            <div className="flex gap-4 p-4 bg-surface-container-high border border-outline rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-surface-container border-2 border-outline rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">schedule</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface mb-1">Account Activation</h3>
                <p className="text-sm text-on-surface-variant">Pending review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-surface-container border border-outline rounded-xl p-6">
          <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            What happens next?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-on-surface-variant">
            <li>Check your email for a technical task (if applicable)</li>
            <li>Complete and submit the task within the deadline</li>
            <li>Our team will review your submission</li>
            <li>You'll receive an email with the outcome</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-8 pt-6 border-t border-outline text-center">
          <p className="text-sm text-on-surface-variant">
            Questions? Contact us at{" "}
            <a
              href="mailto:info@slightlytechie.com"
              className="text-primary hover:underline font-medium"
            >
              info@slightlytechie.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <LoadingSpinner />
    </div>
  );
};

function SubmitStatus({ status, message, resetForm }: StatusProp) {
  if (status === "error")
    return <Error resetForm={resetForm} message={message} />;
  if (status === "onsubmit") return <Loader />;
  if (status === "success") return <Success name={message} />;

  return null;
}

export default SubmitStatus;

const PendingIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={31}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <circle cx={15} cy={11.5} r={11} fill="#000" />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m10.723 11.718 2.906 2.837 6.26-6.11"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={30}
        height={30}
        x={0}
        y={0.5}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_12_1556" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_12_1556"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
