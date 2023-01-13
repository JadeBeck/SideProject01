"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = require("express");
const router = (0, express_1.Router)();
const users_1 = __importDefault(require("../repositories/users"));
// import PostsRepository from "../repositories/posts";
// import CommentsRepository from "../repositories/comments";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const CHECK_ID = /^[a-zA-Z0-9]{4, 20}$/; // 4 ~ 15으로 변경
const CHECK_PASSWORD = /^[a-zA-Z0-9]{4, 30}$/; // 8~15 으로 변경
const DB_HOST = process.env.DB_HOST;
const DB_SECRET_KEY = process.env.DB_SECRET_KEY;
class UserService {
    constructor() {
        this.usersRepository = new users_1.default();
        // postsRepository = new PostsRepository();
        // commentsRepository = new CommentsRepository();
        //회원가입
        this.signUp = ({ userId, nickName, email, password, confirm }) => __awaiter(this, void 0, void 0, function* () {
            const isSameId = yield this.usersRepository.findUserAccountId(userId);
            const isSameNickname = yield this.usersRepository.findUserAccountNick(nickName);
            //유저 id 중복 검사
            if (isSameId) {
                const err = new Error(`UserService Error`);
                err.status = 409;
                err.message = "이미 가입된 아이디가 존재합니다.";
                throw err;
            }
            ;
            //유저 nickname 중복 검사
            if (isSameNickname) {
                const err = new Error(`UserService Error`);
                err.status = 409;
                err.message = "이미 가입된 닉네임이 존재합니다.";
                throw err;
            }
            ;
            //아이디가 최소 9자리가 아닐 경우
            if (!CHECK_ID.test(userId)) {
                const err = new Error(`UserService Error`);
                err.status = 403;
                err.message = "아이디는 최소 4자리 이상으로 해주세요.";
                throw err;
            }
            ;
            //비밀번호 최소치가 맞지 않을 경우
            if (!CHECK_PASSWORD.test(password)) {
                const err = new Error(`UserService Error`);
                err.status = 403;
                err.message = "비밀번호는 최소 4자리 이상으로 해주세요.";
                throw err;
            }
            ;
            //비밀번호와 비밀번호 확인이 맞지 않을 경우
            if (password !== confirm) {
                const err = new Error(`UserService Error`);
                err.status = 403;
                err.message = "비밀번호와 확인 비밀번호가 일치하지 않습니다.";
                throw err;
            }
            ;
            const salt = yield bcrypt_1.default.genSalt(11);
            //반복 횟수를 늘려보자
            password = yield bcrypt_1.default.hash(password, salt);
            //자 이제 진짜 가입
            const createAccountData = yield this.usersRepository.signUp({
                userId, nickName, email, password
            });
            return createAccountData;
        });
        //유저 id 중복 검사
        this.findDupId = (userId) => __awaiter(this, void 0, void 0, function* () {
            const findDupId = yield this.usersRepository.findUserAccountId(userId);
            if (findDupId) {
                const err = new Error(`UserService Error`);
                err.status = 409;
                err.message = "이미 가입된 아이디가 존재합니다.";
                throw err;
            }
            else {
                return "사용 가능한 아이디입니다.";
            }
            ;
        });
        //유저 nickname 중복 검사
        this.findDupNick = (nickName) => __awaiter(this, void 0, void 0, function* () {
            const findDupNick = yield this.usersRepository.findUserAccountNick(nickName);
            if (findDupNick) {
                const err = new Error(`UserService Error`);
                err.status = 409;
                err.message = "이미 가입된 닉네임이 존재합니다.";
                throw err;
            }
            else {
                return "사용 가능한 닉네임입니다.";
            }
            ;
        });
        //로그인
        this.login = (userId, password) => __awaiter(this, void 0, void 0, function* () {
            //회원 여부 체크
            const loginData = yield this.usersRepository.login(userId);
            if (!loginData) {
                const err = new Error(`UserService Error`);
                err.status = 403;
                err.message = "아이디를 확인해주세요.";
                throw err;
            }
            ;
            const checkPW = yield bcrypt_1.default.compare(password, { loginData } && password); //🔥
            if (!checkPW) {
                const err = new Error(`UserService Error`);
                err.status = 403;
                err.message = "패스워드를 확인해주세요.";
                throw err;
            }
            ;
            //회원 맞으면 로그인 정보 반환
            return { loginData };
        });
        //nickName 불러오기 by userId
        this.getNickName = (userId) => __awaiter(this, void 0, void 0, function* () {
            const getNickNameData = yield this.usersRepository.findUserAccount(userId);
            return getNickNameData;
        });
        //accessToken 생성
        this.getAccessToken = (userId) => __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId }, DB_HOST, { expiresIn: "5m" });
            return accessToken;
        });
        //refreshToken 생성
        this.getRefreshToken = () => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = jsonwebtoken_1.default.sign({}, DB_SECRET_KEY, { expiresIn: "1d" });
            return refreshToken;
        });
        //refreshToken DB에 업뎃
        this.updateRefreshToken = (userId, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            console.log(refreshToken);
            yield this.usersRepository.updateRefreshToken(userId, refreshToken);
            const findUserAccountData = yield this.usersRepository.findUserAccount(userId);
            return findUserAccountData;
        });
    }
}
;
exports.default = UserService;
