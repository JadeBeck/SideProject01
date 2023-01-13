"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', true);
const DB_HOST = process.env.DB_HOST;
const connect = () => {
    mongoose_1.default
        .connect(DB_HOST)
        .then(() => console.log("mongoDB Connected"))
        .catch(err => console.log(err));
};
mongoose_1.default.connection.on("error", err => {
    console.error("mongoDB connecting error", err);
});
module.exports = connect;
