import { Router } from "express";
const router = Router();

import usersRouter from "./users.router.js";
// const postsRouter = require("./posts.router");
// const commentsRouter = require("./comments.router");
// const chatRouter = require("./chat.router");
// const socialRouter = require("./social.router");
// const smsRouter = require("./sms.router")
// const rankRouter = require("./rank.router")

//router.use("/chats", chatRouter);
router.use("/users", usersRouter);
// router.use("/posts", postsRouter);
// router.use("/comments", commentsRouter);
// router.use("/social", socialRouter);
// router.use("/sms", smsRouter)
// router.use("/rank", rankRouter);

export default router;