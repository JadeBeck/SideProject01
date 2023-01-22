import { Router } from "express";
const router = Router();

import SMS from "../controllers/sms.js";
const sms = new SMS();

// 회원가입 시 사용
router.post('/send', sms.send);
router.post('/verify', sms.verify);

// 아이디 찾을 때 사용
router.post('/sendID', sms.sendID);
router.post('/verifyID', sms.verifyID);

// 비밀번호 변경할때 사용
router.post('/sendPW', sms.sendPW);

export default router;