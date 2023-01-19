import Posts from "../schema/posts.js";
//const Bookmarks = require("../schema/bookmark");
import Users from "../schema/users.js";

class PostsRepository {
    //게시글 작성
    createPost = async (
        {userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose}
            : { userId: string, nickName: string, img: string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number, participant: [], nowToClose: number }
    ) => {
        const createPost = await Posts.create({
            userId, img, nickName, title, content, location, date, time, map, partySize, participant, confirmMember: nickName, expireAt: nowToClose
        });
        await Users.updateOne({userId}, {$inc: {point: 300, totalPoint: 300}})
        const UserAvatar = await Users.findOne({userId})
        if (UserAvatar) {
            createPost.userAvatar = UserAvatar.userAvatar
        }
        return createPost;
    };

    //게시글 전부 보기
    findAllPosts = async (skip: number) => {
        const findAllPosts = await Posts.find({}, undefined, {skip, limit: 5}).sort('-createdAt')
        for (let i = 0; i < findAllPosts.length; i++) {
            const userAvatar = await Users.findOne({userId: findAllPosts[i].userId})
            if (userAvatar) {
                findAllPosts[i].userAvatar = userAvatar.userAvatar
            }
        }
        return findAllPosts;
    };

    //게시글 하나 보기
    findOnePost = async (postId: string) => {
        const findOnePosts = await Posts.findOne({_id: postId})
        if (findOnePosts) {
            const userAvatar = await Users.findOne({userId: findOnePosts.userId});
            if (userAvatar) {
                findOnePosts.userAvatar = userAvatar.userAvatar
                return findOnePosts;
            }
        }
    };

    //게시글 수정
    updatePost = async (
        {postId, userId, title, content, location, date, time, map, partySize}
            : { postId: string, userId: string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number }) => {
        await Posts.updateOne(
            {_id: postId, userId: userId},
            {$set: {title, content, location, date, time, map, partySize}}
        );
        return
    };

    //게시글 삭제
    deletePost = async (postId: string, userId: string) => {
        await Posts.deleteOne({_id: postId, userId: userId});
        return
    };

}

export default PostsRepository;