import http from "http";
import {Server} from "socket.io";

import connect from "./schema/index.js"
connect();

import Rooms from "./schema/rooms.js";
import Posts from "./schema/posts.js";

const socketIO = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    });

    //소켓 연결
    io.on("connection", socket => {
        //채팅룸 입장
        socket.on("joinRoom", async data => {
            let {room, nickName, userAvatar}: {room: string, nickName: string, userAvatar: string} = data;
            socket.join(room)
            const findRoom = await Rooms.findOne({room: room});
            if (!findRoom) {
                console.log("신규 방")
                //await Room.create({owner: nickName, room: room, member: nickName})
                //await Room.updateOne({room: room}, {$push: {avatar: {nickName: nickName, userAvatar: userAvatar}}})
                await Rooms.create({owner: nickName, room: room, member: nickName, avatar: [{nickName: nickName, userAvatar: userAvatar}]});  //이거 돌아가면 밑에 코드들도 리팩토링
                await Posts.updateOne({_id: room}, {$push: {confirmMember: nickName}});
                io.to(room).emit("roomUsers", [{nickName: nickName, userAvatar: userAvatar}]);
            } else {
                console.log("추가 방")
                console.log(findRoom.member)
                if (!findRoom.member.includes(nickName)) {
                    await Rooms.updateOne({room: room}, {$push: {member: nickName}});
                    await Rooms.updateOne({room: room}, {$push: {avatar: {nickName: nickName, userAvatar: userAvatar}}});
                    await Posts.updateOne({_id: room}, {$push: {confirmMember: nickName}});
                }
                const roomData = await Rooms.findOne({room: room});  //새로 들어온 멤버 뿐만 아니라 기존에 있던 모든 멤버들의 데이터가 필요하기 때문
                if (roomData) {
                    io.to(room).emit("roomUsers", roomData.avatar);
                }
            }
            socket.broadcast.to(room).emit("notice", `${nickName}님이 채팅방에 입장하셨습니다.`);
        });

        //메시지 전송
        socket.on("chatMessage", async data => {
            let {room, nickName, message, userAvatar}: {room: string, nickName: string, message: string, userAvatar: string} = data;
            await Rooms.updateOne({room: room}, {$push: {chat: {nickName: nickName, message: message, userAvatar: userAvatar, time: Date.now()}}});
            io.to(room).emit("message", {...data});
        });

        //채팅룸 퇴장
        socket.on("leaveRoom", async data => {
            let {room, nickName, userAvatar}: {room: string, nickName: string, userAvatar: string} = data;
            await Rooms.updateOne({room: room}, {$pull: {member: {nickName: nickName}}});
            await Rooms.updateOne({room: room}, {$pull: {avatar: {nickName: nickName, userAvatar: userAvatar}}});
            await Posts.updateOne({_id: room}, {$pull: {confirmMember: nickName}});
            socket.broadcast.to(room).emit("notice", `${nickName}님이 채팅방에서 퇴장하셨습니다.`)
            io.to(room).emit("roomUsers", nickName);
        });

        //채팅룸 차단
        socket.on("ban", async data => {
            let {room, nickName, userAvatar}: {room: string, nickName: string, userAvatar: string} = data;
            if (nickName) {
                socket.broadcast.to(room).emit("notice", `${nickName}님을 채팅방에서 내보냈습니다.`);
                await Rooms.updateOne({rom: room}, {$pull: {member: nickName}});
                await Rooms.updateOne({room: room}, {$pull: {avatar: {nickName: nickName, userAvatar: userAvatar}}});
                await Posts.updateOne({_id: room}, {$push: {banUser: nickName}});
                await Posts.updateOne({_id: room}, {$pull: {confirmMember: nickName}});
                io.emit("banUsers", nickName);
            }
            const roomData = await Rooms.findOne({room: room});
            if (roomData) {
                io.to(room).emit("roomUsers", roomData.avatar);
            }
        });
    });
}

export default socketIO