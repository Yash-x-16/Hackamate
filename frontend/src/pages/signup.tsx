import { PiGreaterThan,PiLessThan} from "react-icons/pi";
import { IoIosArrowRoundForward } from "react-icons/io";


export  function  Signup(){
    return <div className=" flex items-center justify-center bg-gray-100 h-screen w-screen flex-col">
        <div className=" h-auto w-auto flex flex-col items-center pb-5"> 
            <div className="flex">
                <PiLessThan color="blue" size={"30px"}/>
                <PiGreaterThan  color="blue" size={"30px"}/>
            </div>
            <div className="flex pt-4 flex-col items-center">
                <h1 className="font-bold text-black text-3xl">
                    create your account
                </h1> 
                <span className="pt-1 text-gray-400 ">
                    already have an account ? <a className="text-indigo-600 cursor-pointer">
                        sign in 
                    </a>
                </span>
            </div>
        </div>
        <div className=" bg-white flex flex-col max-h-max w-1/3 rounded-md shadow-xs">
                    <fieldset className="fieldset m-5 ">
                        <legend className="fieldset-legend text-black font-normal text-sm ">Username</legend>
                        <input type="text" className="input-primary shadow-xs text-gray-500 border border-gray-300 rounded-md h-9 text-base focus:outline-none px-4 py-2" placeholder="Yash"/>
                    </fieldset>
                    <fieldset className="fieldset mb-3">
                        <legend className="fieldset-legend text-black pl-5 font-normal text-sm ">Email</legend>
                        <input type="text" className="input-primary shadow-xs text-gray-500 border border-gray-300 rounded-md h-9 ml-5 mb-2 mr-5 focus:outline-none text-base px-4 py-2" placeholder="xyz@gmail.com" />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-black pl-5 font-normal text-sm ">Password</legend>
                        <input type="password" className="input-primary shadow-xs text-gray-500 border border-gray-300 rounded-md h-9 ml-5 mb-2 mr-5 focus:outline-none text-base px-2 py-2" placeholder="*****" />
                    </fieldset> 
                    <div className="flex items-center m-4">
                        <input type="checkbox" defaultChecked className="checkbox checkbox-primary checkbox-xs mr-2"/>
                        <span className="text-black pr-4 inline-block">
                            I agree to the <a className="text-indigo-600 cursor-pointer">
                             Terms of Service </a> 
                            and <a className="text-indigo-600 cursor-pointer">
                             Privacy Policy 
                                </a> 
                        </span>
                    </div>

                    <div className="m-2 flex justify-center items-center">
                    <button className="btn btn-wide btn-primary mb-4">
                        Create account
                    <IoIosArrowRoundForward size={"30px"}/>
                    </button>
                    </div>
            </div>
    </div>
}