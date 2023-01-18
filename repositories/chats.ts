import Room from "../schema/rooms.js";

class ChatsRepository {
    updateSocket = async (room: string) => {
        const updateSocket = await Room.findOne({room});
        return updateSocket;
    };
}

export default ChatsRepository;