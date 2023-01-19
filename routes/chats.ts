import { Router } from "express";
const router = Router();

import ChatsController from "../controllers/chats.js";
const chatsController = new ChatsController;

//방에 있는 내용 불러오기
router.get('/:room', chatsController.updateSocket);

export default router;