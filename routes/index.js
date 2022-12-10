const express = require("express");
const router = express.Router();

// const usersRouter = require("./users.router");
// const postsRouter = require("./posts.router");
// const commentsRouter = require("./comments.router");
// const chatRouter = require("./chat.router");
// const socialRouter = require("./social.router");
// const smsRouter = require("./sms.router")
// const rankRouter = require("./rank.router")
const socketRouter = require('./socket.router')

// router.use("/chats", chatRouter);
// router.use("/users", usersRouter);
// router.use("/posts", postsRouter);
// router.use("/comments", commentsRouter);
// router.use("/social", socialRouter);
// router.use("/sms", smsRouter)
// router.use("/rank", rankRouter);
router.use('/socket', socketRouter);


module.exports = router;