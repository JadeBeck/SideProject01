import "dotenv/config";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Users from "../schema/users.js"

const  DB_HOST: string = process.env.DB_HOST as string;
const DB_SECRET_KEY: string = process.env.DB_SECRET_KEY as string;

export const auth_middleware = async(req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (authorization == null) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    };

    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    };

    try {
        // 가지고있는 accessToken 확인
        const myToken = verifyToken(tokenValue);

        // 만약 만료가 되었을때
        if (myToken == "jwt expired" || myToken == undefined) {
            res.status(419).json({message : "access_token_expired", code : 419})
        } else {
            const userId = jwt.verify(tokenValue, DB_SECRET_KEY);
            const user = await Users.findOne({userId})
            res.locals.user = user;
            next();
        };
    } catch (err: any) {
        res.send({ errorMessage: err + " : 로그인이 필요합니다." });
    };
};

function verifyToken(token: any) {
    try {
        return jwt.verify(token, DB_SECRET_KEY);
    } catch (err: any) {
        return err.message;
    };
};