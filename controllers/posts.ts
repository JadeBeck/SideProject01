import { NextFunction, Request, Response } from "express";
import PostsService from "../services/posts.js";

class postsController {
    public postsService = new PostsService();

    //게시글 작성
    createPost = async (req: Request, res: Request, next: NextFunction) => {
        try {
            const userId = res.locals.user.userId;
            const {nickName, img} = res.locals.user;
            const {title, content, location, date, time, map, partyMember, participant} : {title: string, content: string, location: string, date: string, time: string[], map: string, partyMember: number, participant: []}= req.body;

            const closingTime : string = time[1];
            const nowToClose = new Date(closingTime).getTime();  //마감시간 date화
            //console.log(new Date)  //지금 시간
            //console.log(closingTime)  //마감시간
            //console.log(nowToClose) //마감시간 date화

            const createPost = await this.postsService.createPost({userId, img, nickName, title, content, location, date, time, map, partyMember, participant, nowToClose});
            res.status(200).json({message: "게시물 생성 완료", createPost : createPost})
        } catch (e) {
            res.status(400).json({message: e.message})
        }
    }

};

export default postsController;