"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const users_router_1 = __importDefault(require("./users.router"));
// const postsRouter = require("./posts.router");
// const commentsRouter = require("./comments.router");
// const chatRouter = require("./chat.router");
// const socialRouter = require("./social.router");
// const smsRouter = require("./sms.router")
// const rankRouter = require("./rank.router")
//router.use("/chats", chatRouter);
router.use("/users", users_router_1.default);
// router.use("/posts", postsRouter);
// router.use("/comments", commentsRouter);
// router.use("/social", socialRouter);
// router.use("/sms", smsRouter)
// router.use("/rank", rankRouter);
exports.default = router;
