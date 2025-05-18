import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set)=>({
    authUser : null , 
    isLoading : false,
    isUpdatingProfile : false , 
    isSigning:false , 
    isSignup:false ,
    isCheckingAuth:true,
    checkAuth:async()=>{
        try{
            const res = await axiosInstance.get('/isChecking')
            set({authUser: res.data})
        }catch{
            set({authUser: null})
            
        }finally{
            set({isCheckingAuth:false})
        }
    }
}));