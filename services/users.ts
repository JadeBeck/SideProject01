import "dotenv/config";
import { Router } from 'express';
const router = Router();
import { Error } from "../interfaces/Error";
import UsersRepository from "../repositories/users.js";
// import PostsRepository from "../repositories/posts";
// import CommentsRepository from "../repositories/comments";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const CHECK_ID = /^[a-zA-Z0-9]{4, 20}$/;
const CHECK_PASSWORD = /^[a-zA-Z0-9]{4, 30}$/;

const  DB_HOST: string = process.env.DB_HOST as string;
const DB_SECRET_KEY: string = process.env.DB_SECRET_KEY as string;

class UserService {
    usersRepository = new UsersRepository();
    // postsRepository = new PostsRepository();
    // commentsRepository = new CommentsRepository();
    
    //회원가입
    signUp = async (
        {userId, nickName, email, password, confirm}
                        : {userId: string, nickName: string, email: string, password: string, confirm: string}
    ) => {
        const isSameId = await this.usersRepository.findUserAccountId(userId);
        const isSameNickname = await this.usersRepository.findUserAccountNick(nickName);
        
        //유저 id 중복 검사
        if (isSameId) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 아이디가 존재합니다.";
            throw err;
        };
        
        //유저 nickname 중복 검사
        if (isSameNickname) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 닉네임이 존재합니다.";
            throw err;
        };

        // //아이디가 최소 4자리가 아닐 경우
        // if (!CHECK_ID.test(userId)) {
        //     const err: Error = new Error(`UserService Error`);
        //     err.status = 403;
        //     err.message = "아이디는 최소 4자리 이상으로 해주세요.";
        //     throw err;
        // };
        //
        // //비밀번호가 최소 4자리가 아닐 경우
        // if (!CHECK_PASSWORD.test(password)) {
        //     const err: Error = new Error(`UserService Error`);
        //     err.status = 403;
        //     err.message = "비밀번호는 최소 4자리 이상으로 해주세요.";
        //     throw err;
        // };

        //비밀번호와 비밀번호 확인이 맞지 않을 경우
        if (password !== confirm) {
            const err: Error = new Error(`UserService Error`);
            err.status = 403;
            err.message = "비밀번호와 확인 비밀번호가 일치하지 않습니다.";
            throw err;
        };

        const salt = await bcrypt.genSalt(11);
        password = await bcrypt.hash(password, salt);

        //자 이제 진짜 가입
        const createAccountData = await this.usersRepository.signUp({
            userId, nickName, email, password
        });
        return createAccountData;
    };

    //유저 id 중복 검사
    findDupId = async(userId: string) => {
        const findDupId = await this.usersRepository.findUserAccountId(userId);

        if (findDupId) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 아이디가 존재합니다.";
            throw err;
        } else{
            return "사용 가능한 아이디입니다."
        };
    };

    //유저 nickname 중복 검사
    findDupNick = async(nickName: string) => {
        const findDupNick = await this.usersRepository.findUserAccountNick(nickName);

        if (findDupNick) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 닉네임이 존재합니다.";
            throw err;
        } else{
            return "사용 가능한 닉네임입니다."
        };
    };

    //로그인
    login = async (userId: string, password: string) => {
        //회원 여부 체크
        const loginData = await this.usersRepository.login(userId);
        if (!loginData) {
            const err: Error = new Error(`UserService Error`)
            err.status = 403;
            err.message = "아이디를 확인해주세요.";
        throw err;
    };
        const checkPW = await bcrypt.compare(password, loginData.password as string);  //🔥
        if (!checkPW) {
            const err: Error = new Error(`UserService Error`)
            err.status = 403;
            err.message = "패스워드를 확인해주세요.";
            throw err;
        };
        //회원 맞으면 로그인 정보 반환
        return { loginData };
    };
    
    //nickName 불러오기 by userId
    getNickName = async (userId: string) => {
        const getNickNameData = await this.usersRepository.findUserAccount(userId);
        return getNickNameData;
    };

    //accessToken 생성
    getAccessToken = async (userId: string) => {
        const accessToken = jwt.sign({userId}, DB_HOST, {expiresIn: "5m"});
    return accessToken;
    };

    //refreshToken 생성
    getRefreshToken = async () => {
        const refreshToken = jwt.sign({}, DB_SECRET_KEY, {expiresIn: "1d"});
        return refreshToken;
    };
    
    //refreshToken DB에 업뎃
    updateRefreshToken = async (userId: string, refreshToken: string) => {
        console.log(refreshToken);
        await this.usersRepository.updateRefreshToken(userId, refreshToken);
        
        const findUserAccountData = await this.usersRepository.findUserAccount(userId);
        return findUserAccountData;
    };

};

export default UserService;