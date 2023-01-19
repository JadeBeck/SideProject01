import Room from "../schema/rooms.js";

class ChatsRepository {
    bringChats = async (room: string) => {
        const bringChatsData = await Room.findOne({room});
        return bringChatsData;
    };
}

export default ChatsRepository;