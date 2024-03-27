import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken'
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

export default async function LoginWithCredentials(req: Request, res: Response){
    const { email, password, image, username } = req.body;
    let registered_user = await prisma.user.findFirst({ where: { email: email, authVariant: 'salt' } });

    if (!registered_user){
        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(password, salt);
        let user = await prisma.user.create({
            data: {
              name: username,
              email: email ? email : null,
              provider: 'credentials',
              image: image ? image : null,
              authVariant: 'salt',
              hashedPassword: hashed_password 
            }
        });

        const payload = { email: user.email, username: user.name };
        const secretKey = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        res.send({ status: 'Authenticated', token: token });
    }
    else {
        const enteredPassword = password;
        let hashed_password = registered_user.hashedPassword;
        if(hashed_password){
            const isPasswordValid = bcrypt.compareSync(enteredPassword, hashed_password);
            if (!isPasswordValid){
                return res.status(401).send("Invalid password");
            }
        }
        else{
            res.send({status: 'account is broken'})
        }
        
        const payload = { email: registered_user.email, username: registered_user.name };
        const secretKey = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        res.send({ status: 'Authenticated', token: token });
    }
}