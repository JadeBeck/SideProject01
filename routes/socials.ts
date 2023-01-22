import { Router } from "express";
const router = Router();

import SocialController from "../controllers/socials.js";
const socialController = new SocialController();

router.post('/google/isGoogle', socialController.isGoogle);

router.post('/google/callback', socialController.google_callback);

router.post('/kakao/isKaKao', socialController.isKakao);

router.post('/kakao/callback', socialController.kakao_callback);

router.post('/naver/isNaver', socialController.isNaver);

router.post('/naver/callback', socialController.naver_callback);

export default router;