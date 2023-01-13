import http from "http";
import express from "express";
const Server  = require("../socket")
/*import { instrument } from "@socket.io/admin-ui"*/

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const port = 3005 || process.env.PORT;
const handleListen = () => console.log(`Listening on http://localhost:${port}`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer)
app.set("io", wsServer);
/*instrument(wsServer,  {
    auth: false
});*/

httpServer.listen(`${port}`, handleListen);