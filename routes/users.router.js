"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const users_1 = __importDefault(require("../controllers/users"));
const usersController = new users_1.default;
//회원가입
router.post("/signUp", usersController.signUp);
//유저 id 중복 검사
router.post("/dup/id", usersController.findDupId);
//유저 nickName 중복 검사
router.post("/dup/nick", usersController.findDupNick);
// 로그인
router.post("/login", usersController.login);
exports.default = router;
