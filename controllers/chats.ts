import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import ChatsService from "../services/chats.js";

class ChatsController {
    public chatsService = new ChatsService();

    bringChats = async (req: Request, res: Response, next: NextFunction) => {
      const { room } = req.params;
      const bringChatsData = await this.chatsService.bringChats(room);
      res.status(200).json({ bringChatsData });
    };
}

export default ChatsController;