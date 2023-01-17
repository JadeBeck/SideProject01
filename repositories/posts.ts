import Posts from "../schema/posts.js";
//const Bookmarks = require("../schema/bookmark");
import Users from "../schema/users.js";

class PostsRepository {
    //게시글 작성
    createPost = async (userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose) => {
        const createPost = await Posts.create({
            userId,
            img,
            nickName,
            title,
            content,
            location,
            cafe,
            date,
            time,
            map,
            partyMember,
            participant,
            confirmMember: nickName,
            expireAt: nowToClose
        });
        await Users.updateOne({userId: userId}, {$inc: {point: 300, totalPoint: 300}})
        const UserAvatar = await Users.findOne({userId: userId})
        createPost.userAvatar = UserAvatar.userAvatar
        return createPost;
    };
};

export default PostsRepository;