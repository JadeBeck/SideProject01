import { NextFunction, Request, Response } from "express";
import PostsService from "../services/posts.js";

class postsController {
    public postsService = new PostsService();

    //게시글 작성
    createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId : string = res.locals.user.userId;
            const {nickName, img} : {nickName: string, img: string} = res.locals.user;
            const {title, content, location, date, time, map, partySize, participant} : {title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number, participant: []}= req.body;

            const closingTime = time[1];
            const nowToClose : number = new Date(closingTime).getTime();  //마감시간 date화
            //console.log(new Date)  //지금 시간
            //console.log(closingTime)  //마감시간
            //console.log(nowToClose) //마감시간 date화

            const createPost = await this.postsService.createPost(userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose);
            res.status(200).json({message: "게시물 생성 완료", createPost : createPost})
        } catch (err: any) {
            res.status(400).json({message: err.message})
        }
    };

    //게시글 전부 보기
    findAllPosts = async (req: Request, res: Response, next: NextFunction) => {
        const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0
        const findAllPosts = await this.postsService.findAllPosts(skip);
        res.status(200).json({data: findAllPosts})
    };

    //게시글 하나 보기
    findOnePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const findOnePosts = await this.postsService.findOnePost(postId);
            res.status(200).json({data: findOnePosts})
        } catch (err: any) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    }

    //게시글 수정
    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const userId : string = res.locals.user.userId;
            const {title, content, location, date, time, map, partySize} : {title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number}= req.body
            await this.postsService.updatePost(postId, userId, title, content, location, date, time, map, partySize);
            res.status(200).json({message: "게시물 수정을 완료하였습니다."})
        } catch (err: any) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    };

    //게시글 삭제
    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const userId = res.locals.user.userId;
            await this.postsService.deletePost(postId, userId);
            res.status(200).json({message: "게시물 삭제를 완료하였습니다."})
        } catch (err: any) {
            res.status(err.status || 404).json({statusCode: err.status, message: err.message})
        }
    };

}

export default postsController;