import "dotenv/config";
import helmet from "helmet";

import generalErrorHandler from "./src/error/generalErrorHandler.js";
import routes from "./routes/index.js";

import express, { Express } from "express";
const app: Express = express();
import http from "http";
const server: http.Server = http.createServer(app)
import socket from "./socket.js"
socket(server);

import swaggerUi from "swagger-ui-express";
import outputFile from "./swagger-output.json" assert { type: "json"};

import connect from "./schema/index.js"
connect();

app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
import cors from "cors";
 app.use(cors({
     origin: '*'
 }));

app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(outputFile, { explorer: true })
);

app.use(express.json());
app.use("/", routes);
app.use(generalErrorHandler);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`🛡${port}번 포트로 열렸습니다.`);
});

//app은 신체 & server는 신체 외부. app안에 주사를 놔주면 server는 문제 없이 돌아가는 느낌 !!