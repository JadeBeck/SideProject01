import { Router } from "express";
const router = Router();

import UsersController from "../controllers/users.js";
const usersController = new UsersController;

import { auth_middleware } from  "../middleware/auth-middleware.js";

//회원가입
router.post("/signUp", usersController.signUp);

//유저 id 중복 검사
router.post("/dup/id", usersController.findDupId);

//유저 nickName 중복 검사
router.post("/dup/nick", usersController.findDupNick);

//로그인
router.post("/login", usersController.login);

//refreshToken 체크 후 accessToken 전달
router.post("/refresh", usersController.ckRTandSendAT);

// 내 정보 확인하기
router.get("/", auth_middleware, usersController.getUserData);

//내 정보 수정하기
router.put("/", auth_middleware, usersController.updateUserData);

//비밀번호 변경하기
router.post("/change/password", usersController.changePW);

//회원 탈퇴하기
router.delete("/", auth_middleware, usersController.deleteUserData);

// 다른 유저 정보 보기
router.get("/:nickName", usersController.getOtherUserData);

export default router;