console.log("yash is devootee of radha rani")


import express from "express" 
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken" 
import { Jwt_secret } from "./config"
import { Middleware } from "./middleware"
import cors from "cors"


const app = express()
const client  = new PrismaClient() 
const jwt = jsonwebtoken


app.use(express.json()) 
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
} 
)) ; 


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

app.get('/ischecking',Middleware,(req,res)=>{
    try{

    //@ts-ignore
    res.json(req.user)

    }catch{
        res.json({
            message:"unautorized user !!"
        })
    }
})

app.get('/user',Middleware,async(req,res)=>{

    const username = req.body.username

    try{
        const user = await client.user.findUnique({
            where:{ 
                username: username 
            } 

        })

        res.json({
            message:"found user",
            id:user?.id
        })

    }catch{
        res.json({
            message:"coudn't found user !!!"
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


app.get('/profile',Middleware,async (req,res)=>{
    
    try{
    
    const profile = await client.profile.findFirst({

        where:{  //@ts-ignore
            userId:req.id 
        }
    })  
     res.json({
        profile: profile
     })

    }catch{
        res.json({
            message:" cannot get profile !! "
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
        const tag = await client.tag.findUnique({
            where:{
                name:name
            }
        }) 

        await client.userTag.delete({
            where:{
                userId_tagId:{ //@ts-ignore
                    userId : req.id , 
                    tagId : tag?.id as number
                }
            } 
        })
        res.json({
          message:"deleted tag"      
        })

    }catch(e){
        console.log(e)
        res.json({
            message:"cannot deleted tag"      
          })
    }
})


app.post('/messages',Middleware,async(req,res)=>{
    const {content,recieverId} =req.body

    try{
         await client.message.create({
            data:{
                content:content , 
                recieverId:recieverId ,//@ts-ignore 
                senderId:req.id
            }
        })

        res.json({
            message:"message sent !"
        })

    }catch{

        res.json({
            message:"message not sent !"
        })
    }
})


app.get('/messages',Middleware,async(req,res)=>{

    try{
        const message = await client.message.findMany({
            where:{
                //@ts-ignore
                id:req.id
            }
        })

        const content  = message.map(x=>x.content)
        res.json({
            message:content
        })

    }catch{

        res.json({
            message:"message not found !"
        })
    }
})


app.post('/hackathon',Middleware,async(req,res)=>{
    
    const {name,placement,year} = req.body 

    try{
        await client.hackathon.create({
            data:{
                name :name as string,
                placement :placement as string,
                year : year as number, //@ts-ignore
                user : req.id
            }
        })

        res.json({
            message:"updated hackathon"
        })
    }catch{
        res.json({
            message:"try again !!"
        })
    }
})

app.get('/hackathon',Middleware,async (req,res)=>{
  try{
  const hack =   await client.hackathon.findMany({
        where:{//@ts-ignore
            userid:req.id 
        }
    }) 

    const hacked  = hack.map(x=>x)
    res.json({
        hack : hacked
    }) 

    }catch{
        res.json({
            message:"didn't found hacks!!"
        })
    }
})

app.listen(3000,()=>{
    console.log("server is running !!")
})
 