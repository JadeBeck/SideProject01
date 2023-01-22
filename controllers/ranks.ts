import {NextFunction, Request, Response} from "express";
import RanksService from "../services/ranks.js";

class RanksController {
    ranksService = new RanksService();

    getRanks = async(req: Request, res: Response, next: NextFunction) => {
        const getRank = await this.ranksService.getRanks();
        res.status(200).json({data:getRank});
    };

    getMyPoint = async(req: Request, res: Response, next: NextFunction) => {
        const nickName: string = res.locals.user.nickName;
        const getMyPoint = await this.ranksService.getMyPoint(nickName);
        res.status(200).json({data: getMyPoint, message:"조회 완료"});
    };
}

export default RanksController;