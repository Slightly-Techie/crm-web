"use client";
type AlertProps = {
  title: string;
  message: string;
  responseHandler: (res: "yes" | "no") => void;
};
export default function Alert({ title, message, responseHandler }: AlertProps) {
  return (
    <div className=" fixed bottom-[5%] p-6 h-64 flex flex-col justify-evenly right-[5%] rounded-md bg-red-500 z-50">
      <h1 className="text-white">{title}</h1>
      <p>{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => responseHandler("yes")}
          className="py-2 px-8  bg-secondary text-white font-tt-hoves font-semibold rounded-[4px]"
        >
          Yes
        </button>
        <button
          onClick={() => responseHandler("no")}
          className="py-2 px-8 bg-[#161616] text-white font-tt-hoves font-semibold rounded-[4px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
