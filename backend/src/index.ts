console.log("yash is devootee of radha rani")


import express from "express" 
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken" 
import { Jwt_secret } from "./config"
import { Middleware } from "./middleware"


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


app.post('/profile',Middleware,async(req ,res)=>{
    const {bio,role,image} = req.body ; 

    try{

      await client.profile.create({
 
            data:{
                bio : bio , 
                role : role , 
                image : image , 
                user:{
                    connect:{  //@ts-ignore
                        id : req.id 
                    }
                }
            
        }
               
        }) 

        res.json({
          message : "updated the profile "  
        })

    }catch{
        res.json({
            message: "something went wrong !!"
        })
    }
})


app.post('/tag',Middleware,async(req,res)=>{

    const name = req.body.name 
    
    try{
        await client.tag.create({
            data:{
                name: name,
                }
        })

        const tagId = await client.tag.findFirst({
            where:{
                name : name
            } 
        })

        await client.userTag.create({
            data :{ //@ts-ignore
                userId:req.id  , 
                tagId : tagId?.id as number
               }
        })
        res.json({
            message :"tag added !!"
        })

    }catch{
        res.json({
            message :" couldn't update !!"
        })
    }
})


app.get('/tag',Middleware,async(req,res)=>{
        
    try{
        const tags = await client.userTag.findMany({
            where:{
                //@ts-ignore
                userId:req.id
            },include:{
                tag:true
            },
        })  

        const tagname = tags.map(entry=>entry.tag.name)

        res.json({
            tags : tagname
                })
    }
    catch{
        res.json({
            message:"coudn't find any tag!!"
        })
    }
})


app.delete('/tag',Middleware,async(req,res)=>{
    const name = req.body.name 
    
    try{
        const tag = await client.tag.delete({
            where:{
                name:name
            }
        })
    }catch{}
})


app.listen(3000,()=>{
    console.log("server is running !!")
})
 