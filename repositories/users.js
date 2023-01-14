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
const users_1 = __importDefault(require("../schema/users"));
//import Posts from "../schema/posts"
//import Comments from "../schema/comments"
//import Bookmark from "../schema/bookmark"
const moment_1 = __importDefault(require("moment"));
const date = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
class usersRepository {
    constructor() {
        //회원가입
        this.signUp = ({ userId, nickName, email, password }) => __awaiter(this, void 0, void 0, function* () {
            // create로 회원가입
            const createAccountData = yield users_1.default.create({
                userId, nickName, email, password, visible: "V", tutorial: false, createdAt: date, updatedAt: date
            });
            //await bookmark.create({ nickName });
            return createAccountData;
        });
        //유저 id 찾기
        this.findUserAccountId = (userId) => __awaiter(this, void 0, void 0, function* () {
            const findUserAccountData = yield users_1.default.findOne({ userId });
            return findUserAccountData;
        });
        //유저 nickname 찾기
        this.findUserAccountNick = (nickName) => __awaiter(this, void 0, void 0, function* () {
            const findUserAccountData = yield users_1.default.findOne({ nickName });
            return findUserAccountData;
        });
        //로그인
        this.login = (userId) => __awaiter(this, void 0, void 0, function* () {
            const loginData = yield users_1.default.findOne({ userId: userId });
            return loginData;
        });
        //refreshToken 업뎃
        this.updateRefreshToken = (userId, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            const updateRefreshTokenData = yield users_1.default.updateOne({ userId }, { $set: { refresh_token: refreshToken } });
            return updateRefreshTokenData;
        });
        //유저 정보 조회
        this.findUserAccount = (userId) => __awaiter(this, void 0, void 0, function* () {
            const findUserAccountData = yield users_1.default.findOne({ userId });
            return findUserAccountData;
        });
    }
}
;
exports.default = usersRepository;
