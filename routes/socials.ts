import { Router } from "express";
const router = Router();

import SocialController from "../controllers/socials.js";
const socialController = new SocialController();

router.post('/kakao/isKaKao', socialController.isKakao);

router.post('/kakao/callback', socialController.kakao_callback);

export default router;