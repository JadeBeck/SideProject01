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
const users_1 = __importDefault(require("../services/users"));
class usersController {
    constructor() {
        this.usersService = new users_1.default();
        //회원가입
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, nickName, email, password, confirm } = req.body;
                yield this.usersService.signUp({ userId, nickName, email, password, confirm });
                res.status(201).json({ ok: true, statusCode: 201, message: "회원가입 성공!!" });
            }
            catch (err) {
                res.status(err.status || 400).json({ ok: 0, statusCode: err.status, err: err.message });
            }
            ;
        });
        //유저 id 중복 검사
        this.findDupId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            try {
                const findDupIdData = yield this.usersService.findDupId(userId);
                res.status(201).json({ findDupIdData });
            }
            catch (err) {
                res.status(400).json({ message: err.message, statusCode: err.status });
            }
            ;
        });
        //유저 nickname 중복 검사
        this.findDupNick = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { nickName } = req.body;
            try {
                const findDupNickData = yield this.usersService.findDupNick(nickName);
                res.status(201).json({ findDupNickData });
            }
            catch (err) {
                res.status(400).json({ message: err.message, statusCode: err.status });
            }
            ;
        });
        //로그인
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, password } = req.body;
                //유효성 검사
                const login = yield this.usersService.login(userId, password);
                if (login === null) {
                    return res.status(404).send({ ok: 0, statusCode: 404, errorMessage: "가입 정보를 찾을 수 없습니다." });
                }
                ;
                const getNickName = yield this.usersService.getNickName(userId);
                if (!getNickName) {
                    throw new Error();
                }
                const accessToken = yield this.usersService.getAccessToken(userId);
                const refreshToken = yield this.usersService.getRefreshToken();
                //refreshToken DB에 업뎃
                yield this.usersService.updateRefreshToken(userId, refreshToken);
                res.status(201).json({
                    accessToken: `Bearer ${accessToken}}`,
                    refresh_token: `Bearer ${refreshToken}`,
                    nickName: getNickName.nickName //🔥
                });
            }
            catch (err) {
                res.status(err.status || 400).json({
                    ok: 0,
                    statusCode: err.status,
                    message: err.message || "로그인 실패.."
                });
            }
            ;
        });
    }
}
;
exports.default = usersController;
