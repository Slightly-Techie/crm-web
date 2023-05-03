import stars from "../../../assets/icons/Stars.png";
import rocket from "../../../assets/icons/big-blue-flying-rocket.png";

import { Link } from "react-router-dom";
function ForgotPassword() {
  return (
    <div className="flex bg-[#111111] text-white font-[Monolisa]   Login">
      <div className="w-1/2 border-solid border-r-[1px] border-[#353535] left">
        <div className="ml-[139px] mt-[260px] mb-[20%]">
          <img className="mb-5" src={stars} alt="" />
          <p className="text-[18px] font-medium">Welcome to the</p>
          <p className="text-[35px] font-semibold">SLightly Techie</p>
          <p className="text-[35px] font-semibold">Network</p>
          <span id="text-animate"></span>
          <img className="mt-5" src={rocket} alt="" />
        </div>
      </div>
      <div className="right w-1/2">
        <div className="ml-[176px] mr-[176px] mt-[35%] mb-[50px] div">
          <form>
            <h3 className="text-[20px] font-bold ">
              Enter Your Email To Reset Password
            </h3>
            <div className="mt-[40px] mb-5">
              <input
                className="bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white"
                type="email"
                name="email"
                placeholder="Johndoe@slightytechie.io"
                required
              />
            </div>

            <button id="btn" type="submit">
              Reset Password
            </button>

            <p className="mt-7 text-center text-[12px]">
              Go back to{" "}
              <Link to="/">
                <u className="font-bold hover:text-gray-400">Sign In</u>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
