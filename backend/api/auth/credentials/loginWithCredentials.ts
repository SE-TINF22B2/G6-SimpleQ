import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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

        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).send("There was an error logging the user in"); 
            }
            return res.send({ status: 'Authenticated'});
        });
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
        
        req.logIn(registered_user, function(err) {
            if (err) {
                return res.status(500).send("There was an error logging the user in"); 
            }
            return res.send({ status: 'Authenticated'});
        });
    }
}