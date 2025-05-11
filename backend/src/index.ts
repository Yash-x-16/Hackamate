console.log("yash is devootee of radha rani")


import express from "express" 
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken" 
import { Jwt_secret } from "./config"


const app = express()
const client  = new PrismaClient() 
const jwt = jsonwebtoken


app.use(express.json()) 


app.post('/signup',async (req,res)=>{ 

    const {username,password , email} = req.body  ; 
    const hashed  = await bcrypt.hash(password,4) 
    try{

        await client.user.create({

                data:{
                    username : username  , 
                    password : hashed  , 
                    email : email
                }
        }) 

        res.json({
            message : "signed up complete !!"
        })
        
    }catch{
        res.json({
            message :" !! couldn't signedup !!"
        })
    }
})


app.post('/signin',async (req,res)=>{
    const {username,password} = req.body 
    
    try{

      const resp =   await client.user.findFirst({
            
        where:{
                username : username
            }
        }) 


        const matched  = await bcrypt.compare(password,resp?.password as string) 

        if(matched){
            const token = jwt.sign({ id: resp?.id } ,Jwt_secret) 
            
            res.json({
                token :token
            })

        }else{
            res.json({
                message : " wrong password "
            })
        }

    }catch{ 

        res.json({
            message:"try again !!"
        })
    }
})


app.listen(3000,()=>{
    console.log("server is running !!")
})
 