import "dotenv/config";
import helmet from "helmet";
import express, {Express} from "express";
const app: Express = express();
import http from "http";
const server = http.createServer(app)
import generalErrorHandler from "./src/error/generalErrorHandler";
import routes from "./routes";

// const socket = require('./socket')
// socket(server)

// const swaggerFile = require("./swagger-output");
// const swaggerUi = require("swagger-ui-express");
//import cors from "cors";
import mongoose from "mongoose";
const connect = require("./schema");
connect();

// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
// app.use(express.json());

import cors from "cors";
 app.use(cors({
     origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
 }));
//
// app.use(
//     "/swagger",
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerFile, { explorer: true })
// );

app.use(express.json());
app.use("/", routes);
app.use(generalErrorHandler);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`${port}번 포트로 열렸습니다.`);
});