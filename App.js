const express = require("express");
const app = express()
const http = require("http").Server(app)
const io = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors")

const port = 4001;

const socket = io(http);

// DataBase connection
const url = "mongodb://localhost:27017/chat";
const connect = mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
const messageRouter = require("./routes/messages");
const roomRouter = require("./routes/rooms");
const userRouter = require("./routes/users");
app.use("/messages", messageRouter);
app.use("/rooms", roomRouter);
app.use("/users", userRouter);

// Models
const Message = require("./models/Message");
const User = require("./models/User");
const Room = require("./models/Room");

socket.on("connection", socket => {
    const { id } = socket.client;
    console.log(`User connected : ${id}`);
    socket.on("disconnection", function () {
        console.log("User disconnected");
    });
    socket.on("chat message", function (msg) {
        const message = { message: msg.message, sender: msg.sender }
        socket.broadcast.emit(room, message);

        let chatMessage = new Message(message);
        chatMessage.save();
        Room.findById(msg.room)
            .then(
                result => {
                    result.messages.push(chatMessage._id);
                    result.save();
                }
            )

    });
});
// https://www.freecodecamp.org/news/how-to-create-a-realtime-app-using-socket-io-react-node-mongodb-a10c4a1ab676/
// https://amritb.github.io/socketio-client-tool/

//wire up the server to listen to our port 500
http.listen(port, () => {
    console.log("connected to port: " + port)
});