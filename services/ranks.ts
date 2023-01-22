import RanksRepository from "../repositories/ranks.js";

class RanksService {
    ranksRepository = new RanksRepository();

    getRanks = async() => {
        const getRanks = await this.ranksRepository.getRanks();
        return getRanks;
    };

    getMyPoint = async(nickName: string) => {
        const getMyPoint = await this.ranksRepository.getMyPoint(nickName);
        return getMyPoint;
    };
}

export default RanksService;