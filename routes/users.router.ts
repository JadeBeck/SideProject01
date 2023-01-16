import { Router } from "express";
const router = Router();

import UsersController from "../controllers/users.js";
const usersController = new UsersController;

import { auth_middleware } from  "../middleware/auth-middleware.js";

//회원가입
router.post("/signUp", usersController.signUp);

//유저 id 중복 검사
router.post("/dup/id", usersController.findDupId)

//유저 nickName 중복 검사
router.post("/dup/nick", usersController.findDupNick);

// 로그인
router.post("/login", usersController.login);

export default router;