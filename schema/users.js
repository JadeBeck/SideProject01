"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    nickName: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    myPlace: {
        type: Array,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    visible: {
        type: String,
    },
    likeGame: {
        type: Array,
    },
    userAvatar: {
        type: Object,
        default: { Eye: 1, Hair: 1, Mouth: 1, Back: 1 }
    },
    point: {
        type: Number,
        default: 3000
    },
    totalPoint: {
        type: Number,
        default: 3000
    },
    refresh_token: {
        type: String,
    },
    admin: {
        type: String,
    },
    bookmark: {
        type: Array,
    },
    bookmarkData: {
        type: Array,
    },
    loginCheck: {
        type: Boolean,
        default: true
    },
    tutorial: {
        type: Boolean,
    },
    rank: {
        type: Number,
    },
    verifyCode: {
        type: String,
    },
    createdAt: {
        type: String,
        default: Date.now
    },
    updatedAt: {
        type: String,
        default: Date.now
    },
});
exports.default = (0, mongoose_1.model)('Users', UserSchema);
//module.exports = mongoose.model("Users", UserSchema);
