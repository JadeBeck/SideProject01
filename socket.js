const SocketIO = require("socket.io");

module.exports = (server, app) => {
    // path 변수는 백엔드랑은 아무 관련 없음
    // 이는 클라이언트가 /socket.io 경로 접근시 소켓 연결을 시작함을 의미
    const wsServer = SocketIO(server, { path: "/socket.io" });

    function publicRooms() {
        const {sockets: {adapter: {sids: sids, rooms}}} = wsServer;
        const publicRooms = [];
        rooms.forEach((_, key) => {
            if (sids.get(key) === undefined) {
                publicRooms.push(key);
            }
        });
        return publicRooms;
    }

    function countRoom(roomName) {
        return wsServer.sockets.adapter.rooms.get(roomName)?.size;
    }

    wsServer.on("connection", (socket) => {
        socket["nickname"] = "Anonymous";
        socket.onAny((event) => {
            console.log(event);
        });
        socket.on("enter_room", (roomName, showRoom) => {
            socket.join(roomName);
            showRoom();
            socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
            wsServer.sockets.emit("room_change", publicRooms());
        });
        socket.on("disconnecting", () => {
            socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
        });
        socket.on("disconnect", () => {
            wsServer.sockets.emit("room_change", publicRooms());
        });
        socket.on("new_message", (msg, room, done) => {
            socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
            done();
        });
        socket.on("nickname", nickname => (socket["nickname"] = nickname));
    });
}

    /*const wss = new WebSocket.Server({server});
    const sockets = [];
    wss.on("connection", (socket) => {
        sockets.push(socket);
        socket["nickname"] = "Anon";
        console.log("Connected to Server");
        socket.on("message", (msg) => {
            const message = JSON.parse(msg);
            switch (message.type) {
                case "new_message":
                    sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                case "nickname":
                    socket["nickname"] = message.payload;
            }
        });
        socket.on("close", () => console.log("Disconnected from the Browser"));
    });*/