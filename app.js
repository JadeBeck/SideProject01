"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const generalErrorHandler_1 = __importDefault(require("./src/error/generalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const connect = require("./schema");
connect();
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
// app.use(express.json());
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));
//
// app.use(
//     "/swagger",
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerFile, { explorer: true })
// );
app.use(express_1.default.json());
app.use("/", routes_1.default);
app.use(generalErrorHandler_1.default);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`${port}번 포트로 열렸습니다.`);
});
