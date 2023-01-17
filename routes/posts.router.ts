import { Router } from "express";
const router = Router();

import PostsController from "../controllers/posts.js";
const postsController = new PostsController;

import { auth_middleware } from  "../middleware/auth-middleware.js";

//게시글 작성
router.post("/", auth_middleware, postsController.createPost);

//모든 게시글 보기
//router.get("/", postsController.findAllPosts);

//게시글 수정
//router.put("/:postId", auth_middleware, postsController.updatePost);

//게시글 삭제
//router.delete("/:postId", auth_middleware, postsController.deletePost)

export default router;