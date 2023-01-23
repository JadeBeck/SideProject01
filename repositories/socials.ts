import Users from "../schema/users.js";
import Bookmark from "../schema/bookmarks.js";
import moment from "moment";
const date = moment().format('YYYY-MM-DD HH:mm:ss')

class SocialRepository {
    //DB에 그 userId가 없을 경우 생성
    createUser = async(userId: string, nickName: string, email: string, admin?: string) => {
        const createUser = await Users.create({userId, nickName, email, admin, visible:"V", createdAt: date, updatedAt: date, expireAt: date
        });
        await Bookmark.create({ nickName });
        return createUser;
    };
}

export default SocialRepository;