require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const routes = require('./routes');
const socket = require('./socket');
socket(server)

const cors = require('cors');
//const connect = require('./schema');
//connect();

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: '*',
}))

app.use('/', routes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`${port}번 포트 오픈~~~~!!!!`);
});