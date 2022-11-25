import React, { useState } from "react";
import google from "../Asset/1534129544.svg";
import github from "../Asset/iconmonstr-github-1.svg";
import { Signup } from "../Components/Interface";

const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Signup>({
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <div
      className="flex flex-col bg-techie text-white"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div className="grid grid-cols-12">
        <div className="col-span-6 pb-2 border-r" style={{ height: "100vh" }}>
            <div>
                
            </div>
          <div className="flex flex-col items-start m-16 mt-72">
            <p className="text-2xl">Welcome to the </p>
            <p className="text-7xl mt-4 mb-4">Slightly Techie</p>
            <p className="text-5xl">Network</p>
          </div>
        </div>

        <div className="col-span-6 pb-2" style={{ height: "100vh" }}>
          <div className="mt-32">
            <p className="mb-8"> Create An Account</p>

            <section>
              <form onSubmit={handleOnSubmit}>
                <div className="mb-6">
                  <input
                    type="email"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    name="email"
                    required
                    placeholder="Enter your Email"
                    className="border border-gray-100 bg-gray-800 px-2 py-2"
                    style={{ borderRadius: "1px" }}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="border border-gray-100 bg-gray-800 px-2 py-2"
                    style={{ borderRadius: "1px" }}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    onChange={(e) =>
                      setData({ ...data, confirm_password: e.target.value })
                    }
                    name="confirm_password"
                    required
                    placeholder="Confirm your password"
                    className="border border-gray-100 bg-gray-800 px-2 py-2"
                    style={{ borderRadius: "1px" }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    style={{ borderRadius: "1px" }}
                    className="bg-white mx-auto flex mb-5 text-black px-14 py-2 active:px-12"
                  >
                    {loading && (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    Create your account
                  </button>
                </div>
              </form>
            </section>

            <div className="flex items-center justify-center mx-auto gap-2">
              <hr className="w-8 border-gray-500" />
              <p className="text-gray-500">continue with social media</p>
              <hr className="w-8 border-gray-500" />
            </div>

            <div className="mt-5">
              <button className="mb-3 px-12 py-2 flex mx-auto bg-gray-700">
                <img src={google} alt="" className="w-5 mr-3" />
                Signup with Google
              </button>
              <button className="px-12 py-2 flex mx-auto bg-gray-700">
                <img src={github} className="w-6 mr-3" />
                Signup with Github
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <p className="">Already have an account?</p>
              <button className="underline ml-2">Sign in</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
