import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import ChatsService from "../services/chats.js";

class ChatsController {
    public chatsService = new ChatsService();

    updateSocket = async (req: Request, res: Response, next: NextFunction) => {
      const { room } = req.params;
      const updateSocketData = await this.chatsService.updateSocket(room);
      res.status(200).json({ updateSocketData });
    };
}

export default ChatsController;