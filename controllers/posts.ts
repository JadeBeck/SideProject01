import {NextFunction, Request, Response} from "express";
import PostsService from "../services/posts.js";

class postsController {
    public postsService = new PostsService();

    //게시글 작성
    createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = res.locals.user.userId;
            const {nickName, img}: { nickName: string, img: string } = res.locals.user;
            const {
                title,
                content,
                location,
                date,
                time,
                map,
                partySize,
                participant
            }: { title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number, participant: [] } = req.body;

            const closingTime = time[1];
            const nowToClose: number = new Date(closingTime).getTime();  //마감시간 date화
            //console.log(new Date)  //지금 시간
            //console.log(closingTime)  //마감시간
            //console.log(nowToClose) //마감시간 date화

            const createPost = await this.postsService.createPost({
                userId,
                nickName,
                img,
                title,
                content,
                location,
                date,
                time,
                map,
                partySize,
                participant,
                nowToClose
            });
            res.status(200).json({message: "게시물 생성 완료", createPost: createPost})
        } catch (err: any) {
            res.status(400).json({message: err.message})
        }
    };

    //게시글 전부 보기
    findAllPosts = async (req: Request, res: Response, next: NextFunction) => {
        const skip = req.query.skip && /^\d+$/.test(<string>req.query.skip) ? Number(req.query.skip) : 0
        const findAllPosts = await this.postsService.findAllPosts(skip);
        res.status(200).json({data: findAllPosts})
    };

    //게시글 하나 보기(게시글 상세 조회)
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
            const userId: string = res.locals.user.userId;
            const {
                title,
                content,
                location,
                date,
                time,
                map,
                partySize
            }: { title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number } = req.body
            await this.postsService.updatePost({postId, userId, title, content, location, date, time, map, partySize});
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

    //챗방에서 회원 차단
    banMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const nickName: string = req.body.nickName;
            await this.postsService.banMember(postId, nickName);
            res.status(200).json({message: "강퇴하였습니다."})
        } catch (err: any) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    };

    //챗방에서 회원 차단 해제
    cancelBanMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId;
            const nickName: string = req.body.nickName;
            await this.postsService.cancelBanMember(postId, nickName);
            res.status(200).json({message: "강퇴를 취소하였습니다."})
        } catch (err: any) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    };

    //파티원 모집 마감
    closeParty = async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId;
        const closePartyData = await this.postsService.closeParty(postId);
        res.status(200).json({message: "파티원 모집 마감", closePartyData});
    };

    //파티원 모집 리오픈
    reopenParty = async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId;
        const time: string = req.body.time;

        const nowToNewClose = new Date(time).getTime();  //새로운 마감 시간(절대적인 시점 자체) Date화

        const reopenPartyData = await this.postsService.reopenParty(postId, nowToNewClose);
        res.status(200).json({message: "파티원 모집 리오픈", reopenPartyData});
    };

    //본인이 작성한 게시물만 노출
    postsIWrote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nickName: string = res.locals.user.nickName;
            const postsIWroteData = await this.postsService.postsIWrote(nickName);
            res.status(200).json({data: postsIWroteData})
        } catch {
            res.status(401).json({message: "권한이 없습니다."})
        }
    };

    //북마크 등록 또는 취소하기
    addOrCancelBookmark = async (req: Request, res: Response, next: NextFunction) => {
        const postId: string = req.body.postId;
        const nickName: string= res.locals.user.nickName;
        await this.postsService.addOrCancelBookmark(postId, nickName);
        res.status(200).json({message: "추가되었습니다."});
    };

    //등록한 북마크 모아보기
    getBookmark = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nickName: string= res.locals.user.nickName;
            const findMyBookmark = await this.postsService.findMyBookmark(nickName);
            res.status(200).json({data: findMyBookmark, message: "조회 완료"});
        } catch (err: any) {
            res.status(err.status || 400).json({statusCode: err.status, message: err.message})
        }
    };

}

export default postsController;