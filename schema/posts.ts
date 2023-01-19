import { Schema, model } from 'mongoose';

const PostsSchema = new Schema({
    userId: {
        type: String,
    },
    img : {
        type : String,
    },
    nickName: {
        type: String,
    },
    title: {
        type: String,
        index: true,
    },
    content: {
        type: String,
    },
    location: {
        type: Object, String,
    },
    date: {
        type: String
    },
    time: {
        type : Array
    },
    map : {
        type : String
    },
    partySize : {
        type : Number
    },
    participant : {
        type : Array
    },
    confirmMember : {
        type : Array
    },
    memberStatus : {
        type: Number
    },
    banUser : {
        type : Array
    },
    closed : {
        type: Number,
        default: 0
    },
    userAvatar : {
        type : Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 0
    },
});

export default model('Posts', PostsSchema.index({title: 'text'}));