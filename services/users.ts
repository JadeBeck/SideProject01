import "dotenv/config";
import {Error} from "../interfaces/Error";
import UsersRepository from "../repositories/users.js";
import PostsRepository from "../repositories/posts.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const CHECK_ID = new RegExp(/^[a-zA-Z0-9]{4,12}$/);
const CHECK_PASSWORD = new RegExp(/^[a-zA-Z0-9]{4,20}$/);
const CHECK_EMAIL = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i);

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

class UsersService {
    usersRepository = new UsersRepository();
    postsRepository = new PostsRepository();

    //회원가입
    signUp = async (
        {userId, nickName, email, password, confirm}
            : { userId: string, nickName: string, email: string, password: string, confirm: string }
    ) => {
        const isSameId = await this.usersRepository.findUserDataByUserId(userId);
        const isSameNickname = await this.usersRepository.findUserAccountNick(nickName);

        //유저 id 중복 검사
        if (isSameId) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 아이디가 존재합니다.";
            throw err;
        }

        //유저 nickname 중복 검사
        if (isSameNickname) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 닉네임이 존재합니다.";
            throw err;
        }

        //아이디가 최소 4자리가 아닐 경우
        if (!CHECK_ID.test(userId)) {
            const err: Error = new Error(`UserService Error`);
            err.status = 403;
            err.message = "아이디는 최소 4자리 이상으로 해주세요.";
            throw err;
        }

        //비밀번호가 최소 4자리가 아닐 경우
        if (!CHECK_PASSWORD.test(password)) {
            const err: Error = new Error(`UserService Error`);
            err.status = 403;
            err.message = "비밀번호는 최소 4자리 이상으로 해주세요.";
            throw err;
        }

        //올바른 이메일 형식이 아닐 경우
        if (!CHECK_EMAIL.test(email)) {
            const err: Error = new Error(`UserService Error`);
            err.status = 403;
            err.message = "이메일 형식이 올바르지 않습니다.";
            throw err;
        }

        //비밀번호와 비밀번호 확인이 맞지 않을 경우
        if (password !== confirm) {
            const err: Error = new Error(`UserService Error`);
            err.status = 403;
            err.message = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
            throw err;
        }

        const salt = await bcrypt.genSalt(11);
        password = await bcrypt.hash(password, salt);

        //자 이제 진짜 가입
        const createAccountData = await this.usersRepository.signUp({
            userId, nickName, email, password
        });
        return createAccountData;
    };

    //유저 id 중복 검사
    findDupId = async (userId: string) => {
        const findDupId = await this.usersRepository.findUserDataByUserId(userId);

        if (findDupId) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 아이디가 존재합니다.";
            throw err;
        } else {
            return "사용 가능한 아이디입니다."
        }
    };

    //유저 nickname 중복 검사
    findDupNick = async (nickName: string) => {
        const findDupNick = await this.usersRepository.findUserAccountNick(nickName);

        if (findDupNick) {
            const err: Error = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 닉네임이 존재합니다.";
            throw err;
        } else {
            return "사용 가능한 닉네임입니다."
        }
    };

    //로그인
    login = async (userId: string, password: string) => {
        //회원 여부 체크
        const loginData = await this.usersRepository.login(userId);
        if (!loginData) {
            const err: Error = new Error(`UserService Error`)
            err.status = 403;
            err.message = "아이디를 확인해주세요.";
            throw err;
        }
        const checkPW = await bcrypt.compare(password, loginData.password as string);  //🔥
        if (!checkPW) {
            const err: Error = new Error(`UserService Error`)
            err.status = 403;
            err.message = "패스워드를 확인해주세요.";
            throw err;
        }
        //회원 맞으면 로그인 정보 반환
        return {loginData};
    };

    //nickName 불러오기 by userId
    getNickName = async (userId: string) => {
        const getNickNameData = await this.usersRepository.findUserDataByUserId(userId);
        return getNickNameData;
    };

    //accessToken 생성
    getAccessToken = async (userId: string) => {
        const accessToken = jwt.sign({userId}, JWT_SECRET_KEY, {expiresIn: "1d"});
        return accessToken;
    };

    //refreshToken 생성
    getRefreshToken = async () => {
        const refreshToken = jwt.sign({}, JWT_SECRET_KEY, {expiresIn: "30d"});
        return refreshToken;
    };

    //refreshToken DB에 업뎃
    updateRefreshToken = async (userId: string, refreshToken: string) => {
        console.log(refreshToken);
        await this.usersRepository.updateRefreshToken(userId, refreshToken);
        const findUserAccountData = await this.usersRepository.findUserDataByUserId(userId);
        return findUserAccountData;
    };

    //refreshToken으로 유저 정보 찾아오기
    ckUserDataByRT = async (refreshTokenValue: string) => {
        const ckUserDataByRT = await this.usersRepository.ckUserDataByRT(refreshTokenValue);
        return ckUserDataByRT;
    };

    //내 정보 확인하기
    getUserData = async (userId: string) => {
        const findUserData = await this.usersRepository.getUserData(userId);
        if (findUserData) {
            const findBookmarkData = await this.postsRepository.findPostByPostId(findUserData.bookmark.toString());  //이렇게 하는게 맞나.....?
            const bookmarkMappedData = findBookmarkData.map((postInfo) => {
                return {
                    postId: postInfo._id,
                    title: postInfo.title,
                    closed: postInfo.closed,
                };
            });
            findUserData["bookmarkData"] = bookmarkMappedData;
        }
        return findUserData;
    };

    //참여 확정된 모임(채팅중인 모임)
    partyGoData = async (nickName: string) => {
        const partyGoData = await this.postsRepository.partyGoData(nickName);
        return partyGoData;
    };

    //내 정보 수정하기
    updateUserData = async (userId: string, nickName: string, email: string) => {
        const findUserDataByUserId = await this.usersRepository.findUserDataByUserId(userId);
        if (findUserDataByUserId) {
            if (nickName === findUserDataByUserId.nickName) {
                const err: Error = new Error(`UserService Error`);
                err.status = 403;
                err.message = "이미 중복된 닉네임이 존재합니다.";
                throw err;
            }

            if (nickName == "" &&  findUserDataByUserId.nickName) {
                nickName = findUserDataByUserId.nickName.toString();
            }

            if (email == "" &&  findUserDataByUserId.email) {
                email = findUserDataByUserId.emai.toString();
            }
        }
        const updateUserData = await this.usersRepository.updateUserData(userId, nickName, email);
        return updateUserData;
    };

    //비밀번호 변경하기
    changePW = async (userId: string, password: string) => {
        const salt = await bcrypt.genSalt(11);
        password = await bcrypt.hash(password, salt);
        const changePW = await this.usersRepository.changePW(userId, password);
        return changePW;
    };

    //회원 탈퇴하기
    deleteUserData = async (nickName: string) => {
        const deleteUserData = await this.usersRepository.deleteUserData(nickName);
        return deleteUserData;
    };

    //다른 유저 정보 보기
    getOtherUserData = async (nickName: string) => {
        const getOtherUserData = await this.usersRepository.getOtherUserData(nickName);
        return getOtherUserData;
    };

}

export default UsersService;