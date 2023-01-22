import { Router } from "express";
const router = Router();

import { auth_middleware } from  "../middleware/auth-middleware.js";

import RanksController from "../controllers/ranks.js";
const ranksController = new RanksController();

//유저 랭킹 보기 by the amount of points
router.get("/", ranksController.getRanks);

//내 포인트 보기
router.get("/mypoint", auth_middleware, ranksController.getMyPoint)

export default router;