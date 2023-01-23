import "dotenv/config";
import {NextFunction, Request, Response} from "express";
import SocialService from "../services/socials.js";

// 순서
// 1. 프론트에게 인가코드 받기
// 2. 받은 인가코드를 백이 kakao쪽에 token요청
// 3. token받은 걸로 유저 정보 체크 후 DB에 저장
// 4. DB에 저장 후 token을 다시 만들어서 프론트에게 보내기

class SoicalController {
    socialService = new SocialService();

    //카카오 소셜로그인
    isKakao = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 프론에게 인가코드 받기
            const { code } = req.body;
            console.log('인가 코드' + code);
            try {
                const isKakao = await this.socialService.isKakao(code);  //카카오에 인가코드로 아이디 받아내기
                const findKakaoUser = await this.socialService.findUser(isKakao);  //아이디로 유저 존재 여부 확인
                if (!findKakaoUser) {
                    res.status(200).json({ userId: isKakao });
                } else {
                    const accessToken = await this.socialService.getAccessToken(isKakao);  //accessToken 생성
                    const refreshToken = await this.socialService.getRefreshToken();  //refreshToken 생성
                    await this.socialService.updateRefreshToken(isKakao, refreshToken);  //refreshToken DB에 업뎃

                    res.status(201).json({
                        accessToken: `Bearer ${accessToken}`,
                        refresh_token: `Bearer ${refreshToken}`,
                    });
                }
            } catch (err: any) {
                console.log(err);
                res.send(err);
            }
        } catch (err: any) {
            res.status(400).send({
                success: false,
                errorMessage: err.message,
                message: "에러가 발생했습니다.",
            });
        }
    };

    kakao_callback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 프론에게 인가코드 받기
            const { userId, nickName, email } : {userId: string, nickName: string, email: string}= req.body;

            // 회원가입에 필요한 내용 싹다 넣기 -> kakao에 있는 schema를 users로 변경
            // console.log(nickName)
            try {
                await this.socialService.createUser(userId, nickName, email);
                const accessToken = await this.socialService.getAccessToken(userId);  //accessToken 생성
                const refreshToken = await this.socialService.getRefreshToken();  //refreshToken 생성
                await this.socialService.updateRefreshToken(userId, refreshToken);  //refreshToken DB에 업뎃

                res.status(201).json({
                    accessToken: `Bearer ${accessToken}`,
                    refresh_token: `Bearer ${refreshToken}`,
                });
            } catch (err: any) {
                console.log(err);
                res.status(409).json({message : err.message, statusCode : err.status});
            }
        } catch (err: any) {
            res.status(400).send({
                success: false,
                errorMessage: err.message,
                message: "에러가 발생했습니다.",
            });
        }
    };
}

export default SoicalController;
