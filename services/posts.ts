import PostsRepository from "../repositories/posts.js";
import shuffle_array from "shuffle-array";

class PostsService {
    public postsRepository = new PostsRepository();

    //게시글 작성
    createPost = async( userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose) => {
        if(!title || !content || !location || !cafe || !date || !time || !map || !partyMember){
            const err = new Error('postService Error');
            err.status = 403;
            err.message = "빈칸을 입력해주세요."
            throw err;
        } else {
            const createPosts = await this.postsRepository.createPost(userId, img, nickName, title, content, location, cafe, date, time, map, partyMember, participant, nowToClose)
            return createPosts
        }
    }
};

export default PostsService;