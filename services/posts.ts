import PostsRepository from "../repositories/posts.js";
import { Error } from "../interfaces/Error";

import shuffle_array from "shuffle-array";
import {NextFunction, Request, Response} from "express";

class PostsService {
    public postsRepository = new PostsRepository();

    //게시글 작성
    createPost = async(
        {userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose}
            : {userId: string, nickName: string, img:string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number, participant: [], nowToClose: number}
    ) => {
        if (!title || !content || !location || !date || !time || !map || !partySize){
            const err: Error = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요."
            throw err;
        } else {
            const createPosts = await this.postsRepository.createPost({userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose
                });
            return createPosts
        }
    };

    //게시글 전부 보기
    findAllPosts = async(skip: number) => {
        const findAllPosts= await this.postsRepository.findAllPosts(skip);
        return findAllPosts;
    };

    //게시글 하나 보기
    findOnePost = async (postId: string) => {
        try{
            const findOnePosts = await this.postsRepository.findOnePost(postId);
            return findOnePosts;
        } catch(err: any){
            err.status = 404;
            err.message = "게시물이 없습니다.";
            throw err;
        }
    };

    //게시글 수정
    updatePost = async(
        {postId, userId, title, content, location, date, time, map, partySize}
            : {postId: string, userId: string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number}
    ) => {
        if(!title || !content || !location || !date || !time || !map || !partySize){
            const err: Error = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요.";
            throw err;
        }
        const findOnePost = await this.postsRepository.findOnePost(postId)
        if (findOnePost) {
            if (findOnePost._id.toString() !== postId) {
                const err: Error = new Error('postService Error');
                err.status = 404;
                err.message = "게시물이 없습니다.";
                throw err;
            }
        }
        await this.postsRepository.updatePost({postId, userId, title, content, location, date, time, map, partySize});
        return;
    };

    //게시글 삭제
    deletePost = async(postId: string, userId: string) => {
        try {
            await this.postsRepository.deletePost(postId, userId);
            return;
        } catch (err: any) {
            err.status = 404
            err.message = "경로 요청이 잘못되었습니다."
            throw err;
        }
    };

}

export default PostsService;