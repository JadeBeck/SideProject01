import ChatsRepository from "../repositories/chats.js";

class ChatsService {
    public chatsRepository = new ChatsRepository();

    bringChats = async (room: string) => {
        const bringChatsData = await this.chatsRepository.bringChats(room);
        return bringChatsData;
    };
}

export default ChatsService;