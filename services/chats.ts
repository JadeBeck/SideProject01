import ChatsRepository from "../repositories/chats.js";

class ChatsService {
    public chatsRepository = new ChatsRepository();

    updateSocket = async (room: string) => {
        const updateSocketData = await this.chatsRepository.updateSocket(room);
        return updateSocketData;
    };
}

export default ChatsService;