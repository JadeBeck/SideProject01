import { Schema, model } from 'mongoose';

const BookmarksSchema = new Schema({
    nickName: {
        type: String,
    },
    postId: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

export default model("Bookmarks", BookmarksSchema);