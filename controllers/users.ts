import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import UsersService from "../services/users.js";
import jwt from "jsonwebtoken";

class usersController {
    public usersService = new UsersService();

    //회원가입
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId, nickName, email, password, confirm}
                : {userId: string, nickName: string, email: string, password: string, confirm: string}
                = req.body;
            await this.usersService.signUp({userId, nickName, email, password, confirm});
            res.status(201).json({ok: true, statusCode: 201, message: "회원가입 성공!!"});
        } catch (err: any) {
            res.status(err.status || 400).json({ok: 0, statusCode: err.status, err: err.message})
        };
    };

    //유저 id 중복 검사
   public findDupId = async (req: Request, res: Response, next: NextFunction) => {
       const {userId}: {userId: string} = req.body;
       try {
           const findDupIdData = await this.usersService.findDupId(userId);
           res.status(201).json({findDupIdData});
       } catch (err: any) {
           res.status(400).json({message: err.message, statusCode: err.status});
       };
   };
    
    //유저 nickname 중복 검사
    public findDupNick = async (req: Request, res: Response, next: NextFunction) => {
        const {nickName}: {nickName: string} = req.body;
        try {
            const findDupNickData = await this.usersService.findDupNick(nickName);
            res.status(201).json({findDupNickData});
        } catch (err: any) {
            res.status(400).json({message: err.message, statusCode: err.status});
        };
    };

    //로그인
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId, password}: {userId: string, password: string}= req.body;
            
            //유효성 검사
            const login = await this.usersService.login(userId, password);
            
            if (login === null) {
                return res.status(404).send({ok: 0, statusCode: 404, errorMessage: "가입 정보를 찾을 수 없습니다."});
            };
            
            const getNickName = await this.usersService.getNickName(userId);
            if (!getNickName) {
                throw new Error();
            }
            const accessToken  = await this.usersService.getAccessToken(userId);
            const refreshToken = await this.usersService.getRefreshToken();

            //refreshToken DB에 업뎃
            await this.usersService.updateRefreshToken(userId, refreshToken);

            res.status(201).json({
                accessToken: `Bearer ${accessToken}}`,
                refresh_token: `Bearer ${refreshToken}`,
                nickName: getNickName.nickName
            });
        } catch (err: any) {
            res.status(err.status || 400).json({
                ok: 0,  
                statusCode: err.status, 
                message: err.message || "로그인 실패.."});
        };
    };
    
};

export default usersController;