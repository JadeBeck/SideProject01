import { Router } from "express";
const router = Router();

import SmsController from "../controllers/sms.js";
const smsController = new SmsController();

//회원가입 시 사용
router.post('/send', smsController.send);
router.post('/verify', smsController.verify);

//아이디 찾을 때 사용
router.post('/sendID', smsController.sendID);
router.post('/verifyID', smsController.verifyID);

//비밀번호 변경할 때 사용
router.post('/sendPW', smsController.sendPW);

export default router;