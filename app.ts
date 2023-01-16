import "dotenv/config";
import helmet from "helmet";
import express, {Express} from "express";
const app: Express = express();
import http from "http";
const server = http.createServer(app)
import generalErrorHandler from "./src/error/generalErrorHandler.js";
import routes from "./routes/index.js";

// const socket = require('./socket')
// socket(server)

import swaggerUi from "swagger-ui-express";
import outputFile from "./swagger-output.json" assert { type: "json"};

import mongoose from "mongoose";
import connect from "./schema/index.js"
//const connect = require("./schema");
connect();

// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());

import cors from "cors";
 app.use(cors({
     origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
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
    console.log(`${port}번 포트로 열렸습니다.`);
});