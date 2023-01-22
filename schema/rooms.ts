import { Schema, model } from 'mongoose';

const RoomsSchema = new Schema({
    room : {
        type : String,
    },
    owner : {
        type : String,
    },
    member : {
        type : Array,
    },
    avatar : {
        type : Array,
    },
    createdAt: {
        type: Date,
        default : Date.now
    },
    chat : {
        type : Object
    }
});

export default model("Rooms", RoomsSchema);