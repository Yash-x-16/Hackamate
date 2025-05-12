import { NextFunction ,Response,Request} from "express";
import { Jwt_secret } from "./config"; 
import jsonwebtoken from "jsonwebtoken"  

const jwt = jsonwebtoken

interface TokenData {
    id: number;
  }
  
  export async function Middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["token"];
  
    try {
      const data = jwt.verify(token as string, Jwt_secret) as TokenData;
      (req as Request & { id: number }).id = data.id;
      next();
    } catch (err) {
      res.status(401).json({
        message: "!! unauthorized !!"
      });
    }
  }