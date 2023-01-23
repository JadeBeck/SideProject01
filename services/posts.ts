import PostsRepository from "../repositories/posts.js";
import {Error} from "../interfaces/Error";
import shuffle_array from "shuffle-array";

class PostsService {
    public postsRepository = new PostsRepository();

    //게시글 작성
    createPost = async (
        {userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose}
            : { userId: string, nickName: string, img: string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number, participant: [], nowToClose: number }
    ) => {
        if (!title || !content || !location || !date || !time || !map || !partySize) {
            const err: Error = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요."
            throw err;
        } else {
            const createPosts = await this.postsRepository.createPost({
                userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose
            });
            return createPosts
        }
    };

    //게시글 전부 보기
    findAllPosts = async (skip: number) => {
        const findAllPosts = await this.postsRepository.findAllPosts(skip);
        return findAllPosts;
    };

    //게시글 하나 보기(게시글 상세 조회)
    findOnePost = async (postId: string) => {
        try {
            const findOnePosts = await this.postsRepository.findOnePost(postId);
            return findOnePosts;
        } catch (err: any) {
            err.status = 404;
            err.message = "게시물이 없습니다.";
            throw err;
        }
    };

    //게시글 수정
    updatePost = async (
        {postId, userId, title, content, location, date, time, map, partySize}
            : { postId: string, userId: string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number }
    ) => {
        if (!title || !content || !location || !date || !time || !map || !partySize) {
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
    deletePost = async (postId: string, userId: string) => {
        try {
            await this.postsRepository.deletePost(postId, userId);
            return;
        } catch (err: any) {
            err.status = 404
            err.message = "경로 요청이 잘못되었습니다."
            throw err;
        }
    };

    //챗방에서 회원 차단
    banMember = async (postId: string, nickName: string) => {
        await this.postsRepository.banMember(postId, nickName)
        return
    };

    //챗방에서 회원 차단 해제
    cancelBanMember = async (postId: string, nickName: string) => {
        await this.postsRepository.cancelBanMember(postId, nickName)
        return
    };

    //파티원 모집 마감
    closeParty = async (postId: string) => {
        const closeParty = await this.postsRepository.closeParty(postId);
        if (closeParty) {
            return {
                userId: closeParty.userId,
                nickName: closeParty.nickName,
                title: closeParty.title,
                time: closeParty.time,
                expireAt: closeParty.expireAt,
                closed: closeParty.closed
            };
        }
    };

    //파티원 모집 리오픈
    reopenParty = async (postId: string, nowToNewClose: number) => {
        const reopenParty = await this.postsRepository.reopenParty(postId, nowToNewClose)
        if (reopenParty) {
            return {
                userId: reopenParty.userId,
                nickName: reopenParty.nickName,
                title: reopenParty.title,
                time: reopenParty.time,
                expireAt: reopenParty.expireAt,
                closed: reopenParty.closed
            };
        }
    };

    //본인이 작성한 게시물만 노출
    postsIWrote = async(nickName: string) => {
        const postsIWroteData = await this.postsRepository.postsIWrote(nickName);
        return postsIWroteData;
    };

    //북마크 등록 또는 취소하기
    addOrCancelBookmark = async(postId: string, nickName: string) => {
        const findBookmark = await this.postsRepository.findBookmark(postId, nickName);
        if (findBookmark) {
            if (!findBookmark.postId.includes(postId)) {
                await this.postsRepository.addBookmark(postId, nickName);
            } else if (findBookmark.postId.includes(postId)) {
                await this.postsRepository.cancelBookmark(postId, nickName);
            }
        }
        return findBookmark;
    };

    //등록한 북마크 모아보기
    findMyBookmark = async(nickName: string) => {
        let result: string[] = [];
        const findMyBookmark = await this.postsRepository.findMyBookmark(nickName);

        const bookmarkMappedData = findMyBookmark.map((post) => post.postId);
        for (let i = 0; i < bookmarkMappedData.length; i++){
            const findPostByPostId = await this.postsRepository.findPostByPostId(bookmarkMappedData[i].toString());
            if(findPostByPostId.length === 0) {
                const err: Error = new Error('postsService Error');
                err.status = 200;
                err.message = "등록된 게시물이 없습니다.";
                throw err;
            } else if (findPostByPostId.length !== 0){
                result.push(findPostByPostId.toString());
            }
        }
        return result;
    };

}

export default PostsService;