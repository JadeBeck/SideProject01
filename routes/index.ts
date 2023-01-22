import { Router } from "express";
const router = Router();

import chatsRouter from "./chats.js";
import usersRouter from "./users.js";
import postsRouter from "./posts.js";
import socialRouter from "./socials.js";
import smsRouter from "./sms.js";
import rankRouter from "./ranks.js";

router.use("/chats", chatsRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/social", socialRouter);
router.use("/sms", smsRouter)
router.use("/rank", rankRouter);

export default router;