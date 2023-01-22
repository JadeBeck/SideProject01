import { Router } from "express";
const router = Router();

import PostsController from "../controllers/posts.js";
const postsController = new PostsController;

import { auth_middleware } from  "../middleware/auth-middleware.js";

//게시글 작성
router.post("/", auth_middleware, postsController.createPost);

//게시글 전부 보기
router.get("/", postsController.findAllPosts);

//게시글 하나 보기(게시글 상세 조회)
router.get("/:postId", postsController.findOnePost);

//게시글 수정
router.put("/:postId", auth_middleware, postsController.updatePost);

//게시글 삭제
router.delete("/:postId", auth_middleware, postsController.deletePost);

//챗방에서 회원 차단
router.put("/ban/:postId", auth_middleware, postsController.banMember);

//챗방에서 회원 차단 해제
router.put("/cancelBan/:postId", auth_middleware, postsController.cancelBanMember);

//파티원 모집 마감
router.put("/closeParty/:postId", auth_middleware, postsController.closeParty);

//파티원 모집 리오픈
router.put("/reopenParty/:postId", auth_middleware, postsController.reopenParty);

//본인이 작성한 게시물만 노출
router.get("/user/:nickName", auth_middleware, postsController.postsIWrote);

//북마크 등록 또는 취소하기
router.put("/bookmark/bookmark", auth_middleware, postsController.addOrCancelBookmark);

//등록한 북마크 모아보기
router.get("/bookmark/:nickName", auth_middleware, postsController.getBookmark);

export default router;