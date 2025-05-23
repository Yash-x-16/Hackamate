import { useEffect } from 'react'
import './App.css'

import { Signup } from './pages/signup' 
import { useAuthStore } from './store/store'
import { Loader} from "lucide-react"
import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import { Homepage } from './pages/homepage'
import { Signinpage } from './pages/signin'
import { Profilepage } from './pages/profile'
import toast, { Toaster } from 'react-hot-toast';

function App() {//@ts-ignore
  const {checkAuth,isChecking,isCheckingAuth,authUser} = useAuthStore() 
  useEffect(()=>{
    checkAuth()

  },[checkAuth])



  if(isCheckingAuth && !authUser){
    return (<div className='flex justify-center items-center h-screen bg-gray-100'>
      <Loader className='size-10 animate-spin text-indigo-600'></Loader>
    </div>)
  }
  return <BrowserRouter>
  <Routes>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/signin' element={<Signinpage/>}/>
    <Route path='/home' element={authUser?<Homepage/>:<Signinpage/>}/>
    <Route path='/profile' element={authUser?<Profilepage/>:<Signinpage/>}/>
    <Route path='/message' element={authUser?<Homepage/>:<Signinpage/>}/>
  </Routes>
  <div><Toaster/></div>
  </BrowserRouter>


}

export default App
