"use client";
export default function NotFound() {
  return (
    <div className="w-screen h-screen flex items-center justify-center font-tt-hoves bg-black">
      <div className="w-[300px] h-[120px] flex items-center justify-center border border-st-gray-600">
        <p className="text-slate-300 text-xl text-center">
          Oops! This page does not exist
        </p>
      </div>
    </div>
  );
}
