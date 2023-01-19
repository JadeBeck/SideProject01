import "dotenv/config";
import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const DB_HOST: string = process.env.DB_HOST as string;

const connect = () => {
    mongoose
        .connect(DB_HOST)
        .then(() => console.log("mongoDB Connected(1st app ⇨ 2nd socket)"))
        .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
    console.error("mongoDB connecting error", err);
});

export default connect;