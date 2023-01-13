import { Router } from "express";
const router = Router();

import UsersController from "../controllers/users";
const usersController = new UsersController;

import { auth_middleware } from  "../middleware/auth-middleware";

//회원가입
router.post("/signup", usersController.signUp);

//유저 id 중복 검사
router.post("/Dup/Id", usersController.findDupId)

//유저 nickName 중복 검사
router.post("/Dup/Nick", usersController.findDupNick);

// 로그인
router.post("/login", usersController.login);

export default Router;