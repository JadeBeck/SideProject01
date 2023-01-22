import "dotenv/config";
import jwt from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";
import Users from "../schema/users.js"

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

export const auth_middleware = async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;

    if (!authorization) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    }

    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    }

    try {
        // 가지고있는 accessToken 확인
        const myToken = verifyToken(tokenValue);

        // 만약 만료가 되었을때
        if (myToken == "jwt expired" || myToken == undefined) {
            res.status(419).json({message: "access_token_expired", code: 419})
        } else {
            const {userId} = jwt.verify(tokenValue, JWT_SECRET_KEY) as JwtPayload;
            const user = await Users.findOne({userId})
            res.locals.user = user;
            next();
        }
    } catch (err: any) {
        res.send({errorMessage: err + " : 로그인이 필요합니다."});
    }
};

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    } catch (err: any) {
        return err.message;
    }
}