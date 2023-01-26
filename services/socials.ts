import "dotenv/config";
import {Error} from "../interfaces/Error";
import axios from "axios";
import jwt from "jsonwebtoken";
import SocialRepository from "../repositories/socials.js";
import UsersRepository from "../repositories/users.js"

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

const KAKAO_GRANT_TYPE = "authorization_code";
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID as string;
const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL as string;

class SocialService {
    socialRepository = new SocialRepository();
    usersRepository = new UsersRepository();

    //카카오 소셜로그인
    isKakao = async (code: any) => {
        const { data } = await axios.post(
            `https://kauth.kakao.com/oauth/token?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
            {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            }
        );
        let access_token = data.access_token;

        // token을 카카오 쪽에 보내서 정보 요청 및 아이디 받기
        const kakaoUser = await axios("https://kapi.kakao.com/v2/user/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return kakaoUser.data.id
    };

    //회원가입
    createUser = async (userId: string, nickName: string, email: string, admin?: string) => {
        const isSameNickname = await this.usersRepository.findUserAccountNick(nickName);
        if (isSameNickname) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 닉네임이 존재합니다.";
            throw err;
        }
        const createUser = await this.socialRepository.createUser(userId, nickName, email, admin);
        return createUser;
    };

    //userId로 유저 찾기
    findUser = async (userId: string) => {
        const findUser = await this.usersRepository.findUserDataByUserId(userId);
        return findUser;
    };

    //accessToken 생성
    getAccessToken = async (userId: string) => {
        const accessToken = jwt.sign({userId}, JWT_SECRET_KEY, {expiresIn: "1d"});
        return accessToken;
    };

    //refreshToken 생성
    getRefreshToken = async () => {
        const refreshToken = jwt.sign({}, JWT_SECRET_KEY, {expiresIn: "30d"});
        return refreshToken;
    };

    //refreshToken DB에 업뎃
    updateRefreshToken = async (userId: string, refreshToken: string) => {
        console.log(refreshToken);
        await this.usersRepository.updateRefreshToken(userId, refreshToken);
        const findUserAccountData = await this.usersRepository.findUserDataByUserId(userId);
        return findUserAccountData;
    };
}

export default SocialService;