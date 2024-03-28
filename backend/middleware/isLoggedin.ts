import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    interface myUser extends Express.User {
        id: string,
        displayName: string,
        username: string,
        profileUel: string,
        photos: string[],
    }
    try{
        let logged_user: myUser = req.user as myUser;
        let user_exists = !!(await prisma.user.findUnique({where: {id: logged_user.id}}));
        user_exists ? next() : res.sendStatus(401);
    }
    catch(err) {
        res.sendStatus(401)
    }
}