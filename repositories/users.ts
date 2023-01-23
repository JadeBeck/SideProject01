import Users from "../schema/users.js";
import Posts from "../schema/posts.js";
import Bookmarks from "../schema/bookmarks.js";
import moment from "moment";

const date = moment().format('YYYY-MM-DD HH:mm:ss');

class usersRepository {
    //회원가입
    signUp = async (
        {userId, nickName, email, password}
            : { userId: string, nickName: string, email: string, password: string }
    ) => {
        //create로 회원가입
        const createAccountData = await Users.create({
            userId, nickName, email, password, visible: "V", tutorial: false, createdAt: date, updatedAt: date
        });
        await Bookmarks.create({nickName});
        return createAccountData;
    };

    //userId로 유저 정보 찾기
    findUserDataByUserId = async (userId: string) => {
        const findUserDataByUserId = await Users.findOne({userId});
        return findUserDataByUserId;
    };

    //nickName으로 유저 정보 찾기
    findUserAccountNick = async (nickName: string) => {
        const findUserAccountData = await Users.findOne({nickName});
        return findUserAccountData;
    };

    //로그인
    login = async (userId: string) => {
        const loginData = await Users.findOne({userId: userId});
        return loginData;
    };

    //refreshToken 업뎃
    updateRefreshToken = async (userId: string, refreshToken: string) => {
        const updateRefreshTokenData = await Users.updateOne(
            {userId}, {$set: {refresh_token: refreshToken}}
        );
        return updateRefreshTokenData;
    };

    //refreshToken으로 유저 정보 찾아오기
    ckUserDataByRT = async (refreshTokenValue: string) => {
        const ckUserDataByRT = await Users.findOne({refresh_token: refreshTokenValue});
        return ckUserDataByRT;
    };

    //내 정보 확인하기
    getUserData = async (userId: string) => {
        const getUserData = await Users.findOne({userId}).select([
            "-_id",
            "-password",
            "-createdAt",
            "-updatedAt",
            "-refresh_token",
            "-phoneNumber",
            "-__v",
        ]);
        return getUserData;
    };

    //내 정보 수정하기
    updateUserData = async (userId: string, nickName: string, email: string) => {
        await Users.updateOne({ userId: userId }, {$set: {nickName : nickName, email: email}});
        await Posts.updateMany({ userId: userId }, {$set: {nickName : nickName}});
        return;
    };

    //비밀번호 변경하기
    changePW = async (userId: string, password: string) => {
        const changePW = await Users.updateOne({ userId: userId }, { $set: { password: password } });
        return changePW;
    };

    //회원 탈퇴하기
    deleteUserData = async (nickName: string) => {
        await Posts.deleteMany({ nickName: nickName });
        await Bookmarks.deleteMany({ nickName: nickName });
        const deleteUserData = await Users.deleteOne({ nickName: nickName });
        return deleteUserData;
    };

    //다른 유저 정보 보기
    getOtherUserData = async (nickName: string) => {
        const getOtherUserData = await Users.findOne({ nickName: nickName }).select([
            "-_id",
            "-userId",
            "-password",
            "-createdAt",
            "-updatedAt",
            "-refresh_token",
            "-phoneNumber",
            "-__v",
        ]);
        return getOtherUserData;
    };

}

export default usersRepository;