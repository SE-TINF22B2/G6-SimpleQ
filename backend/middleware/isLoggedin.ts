import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";

export default async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    req.user ? next() : res.sendStatus(401);
}