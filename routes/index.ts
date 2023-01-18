import { Router } from "express";
const router = Router();

import usersRouter from "./users.js";
import postsRouter from "./posts.js";
// const commentsRouter = require("./comments.js");
import chatsRouter from "./chats.js";
// const socialRouter = require("./social.js");
// const smsRouter = require("./sms.router")
// const rankRouter = require("./rank.js")

router.use("/chats", chatsRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
// router.use("/comments", commentsRouter);
// router.use("/social", socialRouter);
// router.use("/sms", smsRouter)
// router.use("/rank", rankRouter);

export default router;