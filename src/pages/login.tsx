import stars from "../assets/icons/Stars.png";
import rocket from "../assets/icons/big-blue-flying-rocket.png";
import {Link} from "react-router-dom";
function Login(){
    return(
    <div className="flex bg-[#111111] text-white font-[Monolisa]  Login" >
        <div className="w-1/2 border-solid border-r-[1px] border-[#353535] left">
            <div className="ml-[139px] mt-[235px] mb-[235px]  div">
                <img className='mb-5' src={stars} alt="" />
                <p className='text-xs font-medium'>Welcome to the</p>
                <p className='text-[25px] font-semibold'>SLightly Techie</p>
                <p className='text-[25px] font-semibold'>Network</p>
                <img className='mt-5' src={rocket} alt="" />
            </div>
        </div>
        <div className="right w-1/2">
            <div className="ml-[176px] mr-[176px] mt-[150px] mb-[150px] div">
            <form
                onSubmit={(e: React.SyntheticEvent) => {
                e.preventDefault();
                const target = e.target as typeof e.target & {
                    email: { value: string };
                    password: { value: string };
                };
                const email = target.email.value; // typechecks!
                const password = target.password.value; // typechecks!
                // etc...
                }}
                >
                    <h3 className='text-[20px] '>Login To Your Account</h3>
                <div className="mt-[40px] mb-5">
                    <input className='bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] w-[20rem] placeholder:text-[14px] p-1 focus:outline-none focus:border-white border-[1.8px]' type="email" name="email" placeholder='John Doe' />
                </div>
                <div className="mb-3">
                    <input className='bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.5px] w-[20rem] placeholder:text-[14px] p-1 focus:outline-none focus:border-white border-[1.8px]' type="password" name="password" placeholder='Enter Your Password' />
                </div>
                <p className="text-center text-[#353535] text-[11px] font-bold">Forgot your <Link className="font-bold hover:text-gray-400" to='/' ><u>password?</u></Link></p>
                <div>
                   <input type="button" value="Login to your account" />
                </div>
            </form>

            </div>
        </div>
    </div>
    )
}
export default Login