import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

export default async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    //let user_data = req.user;
    //const prisma = new PrismaClient();
    //const user = await prisma.user.findUnique({ where: { id: user_data.id, name: user_data.username } });
    req.user ? next() : res.sendStatus(401);
}