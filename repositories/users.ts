import Users from "../schema/users"
//import Posts from "../schema/posts"
//import Comments from "../schema/comments"
//import Bookmark from "../schema/bookmark"
import moment from "moment"
const date = moment().format('YYYY-MM-DD HH:mm:ss');

class usersRepository {
    //회원가입
    signUp = async (
        {userId, nickName, email, password}
            : {userId: string, nickName: string, email: string, password: string}
    ) => {
        // create로 회원가입
        const createAccountData = await Users.create({
            userId, nickName, email, password, visible:"V", tutorial:false, createdAt: date,updatedAt: date
        });
        //await bookmark.create({ nickName });
        return createAccountData;
    };

    //유저 id 찾기
    findUserAccountId = async(userId: string) => {
        const findUserAccountData = await Users.findOne({userId});
        return findUserAccountData;
    };

    //유저 nickname 찾기
    findUserAccountNick = async(nickName: string) => {
        const findUserAccountData = await Users.findOne({nickName});
        return findUserAccountData;
    };
    
    //로그인
    login = async(userId: string)=> {
        const loginData = await Users.findOne({ userId: userId});
        return loginData;
    };
    
    //refreshToken 업뎃
    updateRefreshToken = async(userId: string, refreshToken: string) => {
        const  updateRefreshTokenData = await Users.updateOne(
            {userId}, {$set: {refresh_token: refreshToken}}
        );
        return updateRefreshTokenData;
    };
    
    //유저 정보 조회
    findUserAccount = async(userId: string) => {
    const findUserAccountData = await Users.findOne({userId});
    return findUserAccountData;
    };

};

export default usersRepository;