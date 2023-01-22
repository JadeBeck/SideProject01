import Users from "../schema/users";

class RanksRepository {
    getRanks = async() => {
        let count = 1;
        let result = [];
        const getRanks = await Users.find({}).sort("-totalPoint")  //앞뒤로 쌍따옴표 맞음?
        for(let i = 0; i<getRanks.length; i++){
            getRanks[i].rank = count++
        }
        getRanks.map((p) => result.push({
                nickName: p.nickName,
                userAvatar : p.userAvatar,
                totalPoint: p.totalPoint,
                rank: p.rank
            })
        );
        return result
    };

    getMyPoint = async(nickName: string) => {
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