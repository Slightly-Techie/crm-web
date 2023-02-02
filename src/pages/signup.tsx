import { useForm } from "react-hook-form";
import stars from "../assets/icons/Stars.png";
import rocket from "../assets/icons/big-blue-flying-rocket.png";
import githubLogo from "../assets/icons/Github-logo.png";
import googleLogo from "../assets/icons/Google-logo.png";
import { Link, useNavigate } from "react-router-dom";

//defining data types to be used
interface FormData {
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  password_confirmation: String;
}

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({ mode: "onSubmit" });
  // get data and clean then send to backend

  // get raw data and send to backend

  // watch the values of the password and password_confirm fields
  const [password, password_confirmation] = watch([
    "password",
    "password_confirmation",
  ]);

  const passwordMatch =
    password === password_confirmation &&
    password_confirmation !== undefined &&
    password_confirmation !== "";

  const onSubmit = handleSubmit((data: any) => {
    fetch("https://crm-api.fly.dev/api/v1/users/register", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className="flex bg-[#111111] text-white font-[Monolisa] h-screen">
      <div className="flex justify-center items-center w-1/2 border-solid border-r-[1px] border-[#353535] max-h-full left">
        <div className="">
          <img className="mb-5" src={stars} alt="" />
          <p className="text-[18px] font-medium">Welcome to the</p>
          <p className="text-[35px] font-semibold">SLightly Techie</p>
          <p className="text-[35px] font-semibold">Network</p>
          <img className="mt-5" src={rocket} alt="" />
        </div>
      </div>
      <div className="right w-1/2">
        <div className="flex justify-center items-center h-full">
          <form method="POST" onSubmit={onSubmit}>
            <h3 className="text-[20px] font-bold ">Create An Account</h3>
            <div className="mt-[40px] mb-5">
              <input
                {...register("first_name", {
                  required: true,
                  min: 2,
                  max: 25,
                  pattern: /^[a-zA-Z]+$/,
                })}
                style={{ borderColor: errors.first_name ? "#b92828" : "" }}
                className="bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white"
                type="text"
                placeholder="Enter your firstname"
              />
              {errors.first_name && (
                <p className="text-[#b92828] text-[12px]">
                  Firstname must be only letters
                </p>
              )}
            </div>
            <div className=" mb-5">
              <input
                {...register("last_name", {
                  required: true,
                  min: 2,
                  max: 25,
                  pattern: /^[a-zA-Z]+$/,
                })}
                style={{ borderColor: errors.last_name ? "#b92828" : "" }}
                className="bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white"
                type="text"
                placeholder="Enter your lastname"
              />
              {errors.last_name && (
                <p className="text-[#b92828] text-[12px]">
                  Lastname must be only letters
                </p>
              )}
            </div>
            <div className=" mb-5">
              <input
                {...register("email", {
                  required: true,
                  min: 2,
                  max: 25,
                  pattern: /^\S+@\S+$/i,
                })}
                style={{ borderColor: errors.email ? "#b92828" : "" }}
                className="bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white"
                type="email"
                name="email"
                placeholder="Johndoe@slightytechie.io"
              />
              {errors.email && (
                <p className="text-[#b92828] text-[12px]">
                  Email must be valid
                </p>
              )}
            </div>
            <div className="mb-5">
              <input
                {...register("password", {
                  required: true,
                  min: 8,
                  max: 25,
                  pattern:
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                })}
                style={{ borderColor: errors.password ? "#b92828" : "" }}
                className="bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white"
                type="password"
                name="password"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-[#b92828] text-[12px]">
                  Password must be at least 8 characters, can contain at least
                  one uppercase, lowercase, a number and a special character
                </p>
              )}
            </div>

            <div className="mb-5">
              <input
                {...register("password_confirmation", {
                  required: true,
                  min: 8,
                  max: 25,
                  pattern:
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                })}
                style={{
                  borderColor: errors.password_confirmation
                    ? "#b92828"
                    : passwordMatch
                    ? "#21c129"
                    : "",
                }}
                className="bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white"
                type="password"
                placeholder="Confirm your password"
              />
              {/* {errors.password_confirm && <p className='text-[#b92828] text-[12px]'>Password must be at least 8 characters, can contain at least one uppercase, lowercase, a number and a special character</p>} */}
              {errors.password_confirmation && (
                <p className="text-[#b92828] text-[12px]">
                  Password must be at least 8 characters, can contain at least
                  one uppercase, lowercase, a number and a special character
                </p>
              )}
            </div>

            <button id="btn" type="submit">
              Create your account
            </button>

            <div className="mt-6 mb-6 flex justify-center mx-auto gap-[1.3rem]">
              <hr className="w-[2.5rem] border-[#353535]" />
              <p className="text-[#353535] text-[11px] font-bold">
                continue with social media
              </p>
              <hr className="w-[2.5rem] border-[#353535]" />
            </div>

            <div className="flex flex-col items-center gap-[1.2rem]">
              <button
                className="bg-[#3A3A3A] hover:bg-black rounded-sm flex items-center justify-center text-[13px] w-[20rem] pr-[16px] pl-[16px] h-[48px] gap-2"
                type="submit"
              >
                <img src={googleLogo} alt="Google logo png" />
                <p>Continue with Google</p>
              </button>
              <button
                className="bg-[#3A3A3A] hover:bg-black rounded-sm flex items-center justify-center text-[13px] pr-[16px] pl-[16px] h-[48px] w-[20rem] gap-2"
                type="submit"
              >
                <img src={githubLogo} alt="Github logo png" />
                <p>Continue with Github</p>
              </button>
            </div>
            <p className="mt-7 text-center text-[12px]">
              Already have an account?{" "}
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
export default SignUp;
