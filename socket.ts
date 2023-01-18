import http from "http";
import { Server } from "socket.io";

import connect from "./schema";
connect();

import Room from "./schema/rooms.js";
import Posts from "./schema/posts.js";

const socketIO = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    });

    io.on("connection", socket => {
        socket.on("joinRoom", async data => {
            let {nickName, room, userAvatar} : {nickName: string, room: string, userAvatar: string} = data;
            socket.join(room)
            const findRoom = await Room.findOne({ room });
            if (!findRoom) {
                console.log("신규 방")
                await Room.create({ owner: nickName, room, member: nickName });
                await Room.updateOne({ room}, {$push: {avatar: { nickName, userAvatar }}});
                io.to(room).emit("roomUsers", [{nickName, userAvatar}]);
            } else {
                console.log("추가 방")
                console.log(findRoom.member)
                if (!findRoom.member.includes(nickName)) {

                }
            }
        });
    });

}

export default socketIO