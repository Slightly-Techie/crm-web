import {useForm} from 'react-hook-form';
import stars from "../assets/icons/Stars.png";
import rocket from "../assets/icons/big-blue-flying-rocket.png";
import githubLogo from "../assets/icons/Github-logo.png";
import googleLogo from "../assets/icons/Google-logo.png";
import { Link } from "react-router-dom";

//defining data types to be used
interface FormData{
    email: String
    password: String
}

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ mode: "onChange" });
    // const onSubmit = handleSubmit(({email, password}) => { console.log(email, password) });
    const onSubmit = handleSubmit((data: any) => { console.log(data) });
    return(
    <div className="flex bg-[#111111] text-white font-[Monolisa] max-h-full  Login" >
        <div className="w-1/2 border-solid border-r-[1px] border-[#353535] left">
            <div className="ml-[139px] mt-[260px] mb-[15%]">
                <img className='mb-5' src={stars} alt="" />
                <p className='text-[18px] font-medium'>Welcome to the</p>
                <p className='text-[35px] font-semibold'>SLightly Techie</p>
                    <p className='text-[35px] font-semibold'>Network</p>
                    <span id="text-animate"></span>
                <img className='mt-5' src={rocket} alt="" />
            </div>
        </div>
        <div className="right w-1/2">
            <div className="ml-[176px] mr-[176px] mt-[140px] mb-[120px] div">
            <form method='POST' onSubmit={onSubmit}>
                    <h3 className='text-[20px] font-bold '>Login To Your Account</h3>
                <div className="mt-[40px] mb-5">
                   <input {...register('email', { required: true, min:2 , max:25, pattern: /^\S+@\S+$/i })}  
                            style={{ borderColor: errors.email ? "#b92828" : "" }}
                                className='bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white border-[1.8px]' type="email" name="email" placeholder='Johndoe@slightytechie.io' />
                            {errors.email && <p className='text-[#b92828] text-[12px]'>Email must be valid</p>}
                </div>
                <div className="mb-3">
                    <input {...register('password', { required: true, min:8 , max:25, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ })} 
                            style={{ borderColor: errors.password ? "#b92828" : "" }}
                                className='bg-[#1E1E1E] border-[#353535] rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] placeholder:text-[#353535] pl-4 focus:outline-none focus:border-white border-[1.8px]' type="password" name="password" placeholder='Enter your password' />
                            {errors.password && <p className='text-[#b92828] text-[12px]'>Password must be at least 8 characters, can contain at least one uppercase, lowercase, a number and a special character</p>}
                </div>
                <p className="mb-3 text-center text-[#353535] text-[11px] font-bold">Forgot your <Link className="font-bold hover:text-gray-400" to='/forgot-password' ><u>password?</u></Link></p>
            
                <button id="btn" role="btn" type="submit" >Login to your account</button>
                        
                <div className="mt-6 mb-6 flex justify-center mx-auto gap-[1.3rem]">
                    <hr className="w-[2.5rem] border-[#353535]" />
                    <p className="text-[#353535] text-[11px] font-bold">continue with social media</p>
                    <hr className="w-[2.5rem] border-[#353535]" />
                </div>

                <div className="flex flex-col items-center gap-[1.2rem]">
                    <button className="bg-[#3A3A3A] hover:bg-black rounded-sm flex items-center justify-center text-[13px] w-[20rem] pr-[16px] pl-[16px] h-[48px] w-[20rem] gap-2" type="submit"><img src={googleLogo} alt="Google logo png"/><p>Continue with Google</p></button>
                    <button className="bg-[#3A3A3A] hover:bg-black rounded-sm flex items-center justify-center text-[13px] pr-[16px] pl-[16px] h-[48px] w-[20rem] gap-2" type="submit"><img src={githubLogo} alt="Github logo png"/><p>Continue with Github</p></button>
                </div>
                <p className="mt-7 text-center text-[12px]">Not registered? <Link to="/signup"><u className="font-bold hover:text-gray-400">create account</u></Link></p>
                
            </form>

            </div>
        </div>
    </div>
    )
}
export default Login