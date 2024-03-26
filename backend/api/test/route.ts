import { Request, Response } from "express"

export default function HelloWorld(req: Request, res: Response){
    res.send("Das ist ein Testendpunkt")
}