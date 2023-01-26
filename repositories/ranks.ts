import Users from "../schema/users.js";

class RanksRepository {
    getRanks = async () => {
        let count = 1;
        let result: { nickName: string | undefined; userAvatar: [] | undefined; totalPoint: number | null; rank: number | undefined; }[] = [];
        const getRanks = await Users.find({}).sort("-totalPoint")  //앞뒤로 쌍따옴표 맞음?
        for (let i = 0; i < getRanks.length; i++) {
            getRanks[i].rank = count++
        }
        getRanks.map((user) => result.push({
                nickName: user.nickName,
                userAvatar: user.userAvatar,
                totalPoint: user.totalPoint,
                rank: user.rank
            })
        );
        return result
    };

    getMyPoint = async (nickName: string) => {
        const findUserByNickName = await Users.findOne({nickName: nickName});
        if (findUserByNickName) {
            const result = {
                point: findUserByNickName.point,
                totalPoint: findUserByNickName.totalPoint
            }
            return result;
        }
    };
}

export default RanksRepository;