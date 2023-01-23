import Posts from "../schema/posts.js";
import Bookmarks from "../schema/bookmarks.js";
import Users from "../schema/users.js";

class PostsRepository {
    //게시글 작성
    createPost = async (
        {userId, nickName, img, title, content, location, date, time, map, partySize, participant, nowToClose}
            : { userId: string, nickName: string, img: string, title: string, content: string, location: string, date: string, time: [string, string], map: string, partySize: number, participant: [], nowToClose: number }
    ) => {
        const createPost = await Posts.create({
            userId,
            img,
            nickName,
            title,
            content,
            location,
            date,
            time,
            map,
            partySize,
            participant,
            confirmMember: nickName,
            expireAt: nowToClose
        });
        await Users.updateOne({userId}, {$inc: {point: 300, totalPoint: 300}});
        const UserAvatar = await Users.findOne({userId});
        if (UserAvatar) {
            createPost.userAvatar = UserAvatar.userAvatar;
        }
        return createPost;
    };

    //게시글 전부 보기
    findAllPosts = async (skip: number) => {
        const findAllPosts = await Posts.find({}, undefined, {skip, limit: 5}).sort('-createdAt')
        for (let i = 0; i < findAllPosts.length; i++) {
            const userAvatar = await Users.findOne({userId: findAllPosts[i].userId})
            if (userAvatar) {
                findAllPosts[i].userAvatar = userAvatar.userAvatar;
            }
        }
        return findAllPosts;
    };

    //게시글 하나 보기(게시글 상세 조회)
    findOnePost = async (postId: string) => {
        const findOnePosts = await Posts.findOne({_id: postId});
        if (findOnePosts) {
            const userAvatar = await Users.findOne({userId: findOnePosts.userId});
            if (userAvatar) {
                findOnePosts.userAvatar = userAvatar.userAvatar;
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
        return;
    };

    //게시글 삭제
    deletePost = async (postId: string, userId: string) => {
        await Posts.deleteOne({_id: postId, userId: userId});
        return;
    };

    //챗방에서 회원 차단
    banMember = async (postId: string, nickName: string) => {
        await Posts.updateOne({_id: postId}, {$push: {banUser: nickName}});
        await Posts.updateOne({_id: postId}, {$pull: {confirmMember: nickName}});
        return;
    };

    //챗방에서 회원 차단 해제
    cancelBanMember = async (postId: string, nickName: string) => {
        await Posts.updateOne({_id: postId}, {$pull: {banUser: nickName}});
        await Posts.updateOne({_id: postId}, {$push: {participant: nickName}});
        return;
    };

    //파티원 모집 마감
    closeParty = async (postId: string) => {
        await Posts.updateOne({_id: postId}, {$set: {closed: 1, expireAt: ""}});
        const closePartyResult = await Posts.findOne({_id: postId});
        return closePartyResult;
    };

    //파티원 모집 리오픈
    reopenParty = async (postId: string, nowToNewClose: number) => {
        await Posts.updateOne({_id: postId}, {$set: {closed: 0, expireAt: nowToNewClose, "time.1": nowToNewClose}});
        const reopenPartyResult = await Posts.findOne({_id: postId});
        return reopenPartyResult;
    };

    //본인이 작성한 게시물만 노출
    postsIWrote = async (nickName: string) => {
        const postsIWroteData = await Posts.find({nickName: nickName});
        return postsIWroteData;
    };

    //내가 등록한 북마크 조회하기
    findBookmark = async (postId: string, nickName: string) => {
        const findBookmark = await Bookmarks.findOne({nickName: nickName});
        return findBookmark;
    };

    //북마크 등록하기
    addBookmark = async (postId: string, nickName: string) => {
        const pushBookmark = await Bookmarks.updateOne({nickName: nickName}, {$push: {postId: postId}});
        return pushBookmark;
    };

    //북마크 취소하기
    cancelBookmark = async (postId: string, nickName: string) => {
        const pullBookmark = await Bookmarks.updateOne({nickName: nickName}, {$pull: {postId: postId}});
        return pullBookmark;
    };

    //등록한 북마크 모아보기
    findMyBookmark = async (nickName: string) => {
        const findMyBookmark = await Bookmarks.find({nickName: nickName});
        return findMyBookmark;
    };

    //postId로 게시글 조회하기
    findPostByPostId = async (postId: string) => {
        const findPostByPostIdData = await Posts.find({_id: postId});
        return findPostByPostIdData;
    };

    //참여 확정된 모임 조회(채팅중인 모임 조회)
    partyGoData = async (nickName: string) => {
        const partyGoData = await Posts.find({confirmMember: nickName}).sort('date');
        return partyGoData;
    };

}

export default PostsRepository;