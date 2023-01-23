import "dotenv/config";
import {NextFunction, Request, Response} from "express";

import SmsService from "../services/sms.js";

class SmsController {
    smsService = new SmsService();

    //문자 전송
    send = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phoneNumber = req.body.phoneNumber;

            const send = await this.smsService.send(phoneNumber);

            res.status(201).json({code: 201, message: "본인인증 문자 발송 성공", verifyCode: send})
        } catch (err: any) {
            res.status(401 || err.status).json({statusCode: err.status, message: err.message})
        }
    };

    //회원가입 시 인증번호 확인
    verify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phoneNumber = req.body.phoneNumber;
            const verifyCode = req.body.verifyCode;

            const verify = await this.smsService.verify(phoneNumber, verifyCode)

            res.status(201).json(verify)
        } catch (err: any) {
            res.status(401).json({statusCode: err.status, message: err.message})
        }
    };

    //아이디 찾을 때 인증번호 전송하기
    sendID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phoneNumber = req.body.phoneNumber;

            const sendID = await this.smsService.sendID(phoneNumber);

            res.status(201).json({code: 201, message: "본인인증 문자 발송 성공", verifyCode: sendID})
        } catch (err: any) {
            res.status(401).json({statusCode: err.status, message: err.message})
        }
    };

    //아이디 찾을 때 받은 인증번호 확인
    verifyID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phoneNumber = req.body.phoneNumber;
            const verifyCode = req.body.verifyCode;

            const verifyID = await this.smsService.verifyID(phoneNumber, verifyCode)

            res.status(201).json(verifyID)
        } catch (err: any) {
            res.status(401).json({statusCode: err.status, message: err.message})
        }
    };

    //비밀번호 찾을 때 인증번호 전송하기
    sendPW = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.userId;
            const phoneNumber = req.body.phoneNumber;

            const sendPW = await this.smsService.sendPW(phoneNumber, userId)

            res.status(201).json({code: 201, message: "본인인증 문자 발송 성공", verifyCode: sendPW})
        } catch (err: any) {
            res.status(401).json({statusCode: err.status, message: err.message})
        }
    };
}

export default SmsController;