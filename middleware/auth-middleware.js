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
exports.auth_middleware = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users = require("../schema/users");
const DB_HOST = process.env.DB_HOST;
const DB_SECRET_KEY = process.env.DB_SECRET_KEY;
const auth_middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (authorization == null) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    }
    ;
    const [tokenType, tokenValue] = authorization.split(" ");
    if (tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    }
    ;
    try {
        // 가지고있는 accessToken 확인
        const myToken = verifyToken(tokenValue);
        // 만약 만료가 되었을때
        if (myToken == "jwt expired" || myToken == undefined) {
            res.status(419).json({ message: "access_token_expired", code: 419 });
        }
        else {
            const userId = jsonwebtoken_1.default.verify(tokenValue, DB_SECRET_KEY);
            const user = yield Users.findOne({ userId });
            res.locals.user = user;
            next();
        }
        ;
    }
    catch (err) {
        res.send({ errorMessage: err + " : 로그인이 필요합니다." });
    }
    ;
});
exports.auth_middleware = auth_middleware;
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, DB_SECRET_KEY);
    }
    catch (err) {
        return err.message;
    }
    ;
}
;
