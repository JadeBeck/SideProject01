import Users from "../schema/users.js";

class SmsRepository {
    UpdateCode = async(phoneNumber: string, verifyCode: string) => {
        const UpdateCode = await Users.updateOne({phoneNumber : phoneNumber},{$set : {verifyCode : verifyCode}})
        return UpdateCode;
    }

    findPhone = async(phoneNumber: string) => {
        const findPhone = await Users.findOne({phoneNumber : phoneNumber});
        return findPhone;
    }

    findPass = async(phoneNumber: string, userId: string) => {
        const findPass = await Users.findOne({phoneNumber : phoneNumber, userId : userId});
        return findPass;
    }

    findValue = async(phoneNumber: string, verifyCode: string) => {
        const findValue = await Users.findOne({phoneNumber : phoneNumber, verifyCode : verifyCode})
        return findValue;
    }
}

export default SmsRepository;