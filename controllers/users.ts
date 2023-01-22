import "dotenv/config";
import {NextFunction, Request, Response} from "express";
import UsersService from "../services/users.js";
import {verifyToken} from "../middleware/auth-middleware.js";

class usersController {
    public usersService = new UsersService();

    //회원가입
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId, nickName, email, password, confirm}
                : { userId: string, nickName: string, email: string, password: string, confirm: string }
                = req.body;
            await this.usersService.signUp({userId, nickName, email, password, confirm});
            res.status(201).json({ok: true, statusCode: 201, message: "회원가입 성공!!"});
        } catch (err: any) {
            res.status(err.status || 400).json({ok: 0, statusCode: err.status, err: err.message})
        }
    };

    //유저 id 중복 검사
    public findDupId = async (req: Request, res: Response, next: NextFunction) => {
        const {userId}: { userId: string } = req.body;
        try {
            const findDupIdData = await this.usersService.findDupId(userId);
            res.status(201).json({findDupIdData});
        } catch (err: any) {
            res.status(400).json({message: err.message, statusCode: err.status});
        }
        ;
    };

    //유저 nickname 중복 검사
    public findDupNick = async (req: Request, res: Response, next: NextFunction) => {
        const {nickName}: { nickName: string } = req.body;
        try {
            const findDupNickData = await this.usersService.findDupNick(nickName);
            res.status(201).json({findDupNickData});
        } catch (err: any) {
            res.status(400).json({message: err.message, statusCode: err.status});
        }
        ;
    };

    //로그인
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId, password}: { userId: string, password: string } = req.body;

            //유효성 검사
            const login = await this.usersService.login(userId, password);

            if (login === null) {
                return res.status(404).send({ok: 0, statusCode: 404, errorMessage: "가입 정보를 찾을 수 없습니다."});
            }

            const getNickName = await this.usersService.getNickName(userId);
            if (!getNickName) {
                throw new Error();
            }
            const accessToken = await this.usersService.getAccessToken(userId);
            const refreshToken = await this.usersService.getRefreshToken();

            //refreshToken DB에 업뎃
            await this.usersService.updateRefreshToken(userId, refreshToken);

            res.status(201).json({
                accessToken: `Bearer ${accessToken}`,
                refresh_token: `Bearer ${refreshToken}`,
                nickName: getNickName.nickName
            });
        } catch (err: any) {
            res.status(err.status || 400).json({
                ok: 0,
                statusCode: err.status,
                message: err.message || "로그인 실패.."
            });
        }
    };

    //refreshToken 체크 후 accessToken 전달
    ckRTandSendAT = async (req: Request, res: Response, next: NextFunction) => {
        const refresh_token: string = req.body.refresh_token; //-> 헤더로 받아보기
        console.log("날아오는 토큰", refresh_token)
        const refreshTokenValue = await refresh_token.split(" ")[1];
        console.log("토큰 분리", refreshTokenValue)
        const ckUserDataByRTResult = await this.usersService.ckUserDataByRT(refreshTokenValue);

        if (!ckUserDataByRTResult) {
            res.status(999).json({message: "다른 곳에서 이미 로그인을 했습니다. 로그아웃 합니다.", code: 999});
        } else {
            const myRefreshToken = ckUserDataByRTResult.refresh_token;
            const userId = ckUserDataByRTResult.userId;

            if (refreshTokenValue === myRefreshToken) {
                const verifiedRT = await verifyToken(myRefreshToken);

                if (verifiedRT === "jwt expired" || verifiedRT == null) {
                    res.status(420).json({message: "로그인이 필요합니다.", code: 420});
                } else {
                    const accessToken = await this.usersService.getAccessToken(userId);
                    res.status(201).json({accessToken: accessToken});
                }
            }
        }
    };

    //내 정보 확인하기
    getUserData = async (req: Request, res: Response, next: NextFunction) => {
        const {userId, nickName}: {userId: string, nickName: string} = res.locals.user;
        const getUserData = await this.usersService.getUserData(userId);

        //참여 예약한 모임
        const partyReserved = await this.usersService.partyReservedData(nickName);

        //참여 확정된 모임
        const partyGo = await this.usersService.partyGoData(nickName);

        res.status(200).json({getUserData, partyReserved, partyGo});
    };

    //내 정보 수정하기
    updateUserData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = res.locals.user.userId;
            const {nickName, email}: {nickName: string, email: string} = req.body;
            await this.usersService.updateUserData(userId, nickName, email);
            const findUserData = await this.usersService.getUserData(userId);
            res.status(200).json({ok: 1, statusCode: 200, message: "수정 완료", findUserData : findUserData});
        } catch (err: any) {
            res.status(err.status || 400).json({ok: 0, statusCode: err.status, message: err.message || "수정 실패"});
        }
    };

    //비밀번호 변경하기
    changePW = async (req: Request, res: Response, next: NextFunction) => {
        const userId: string = res.locals.user.userId;
        const password: string = req.body.password;
        await this.usersService.changePW(userId, password);
        res.status(200).json({message: "비밀번호 변경 완료"});
    };

    //회원 탈퇴하기
    deleteUserData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nickName: string = res.locals.user.nickName;
            await this.usersService.deleteUserData(nickName);
            res.status(200).json({ok: 1, statusCode: 200, message: "탈퇴 완료"});
        } catch (err: any) {
            res.status(err.status || 400).json({ok: 0, statusCode: err.status, message: err.message || "탈퇴 실패"});
        }
    };

    //다른 유저 정보 보기
    getOtherUserData = async (req: Request, res: Response, next: NextFunction) => {
        const nickName: string = req.params.nickName;
        const lookOtherUser = await this.usersService.getOtherUserData(nickName);

        //참여 예약한 모임
        const partyReserved = await this.usersService.partyReservedData(nickName);

        //참여 확정된 모임
        const partyGo = await this.usersService.partyGoData(nickName);

        res.status(200).json({lookOtherUser: lookOtherUser, partyReserved, partyGo});
    };

}

export default usersController;