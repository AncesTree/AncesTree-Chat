const express = require("express");
const app = express()
const http = require("http").Server(app)
const io = require("socket.io");
const mongoose = require("mongoose");
const bodyParser  = require("body-parser");
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
const messageRouter  = require("./routes/messages");
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
    console.log("user connected");
    socket.on("disconnect", function () {
        console.log("user disconnected");
    });
    socket.on("chat message", function (msg) {
        console.log("message: " + msg);
        //broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg });

        //save chat to the database
        connect.then(db => {
            console.log("connected correctly to the server");

            let chatMessage = new Message({ message: msg, sender: "Anonymous" });
            chatMessage.save();
        });
    });
});

//wire up the server to listen to our port 500
http.listen(port, () => {
    console.log("connected to port: " + port)
});