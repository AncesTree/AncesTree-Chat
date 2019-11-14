//Require the express moule
const express = require("express");

//create a new express application
const app = express()

//require the http module
const http = require("http").Server(app)

// require the socket.io module
const io = require("socket.io");

const port = 4001;

const socket = io(http);
//create an event listener
const Chat = require("./models/Chat");
const User = require("./models/User");
const Room = require("./models/Room");

const connect = require("./dbconnect");

const bodyParser  = require("body-parser");
const chatRouter  = require("./routes/chats");
const cors = require("cors") 
//bodyparser middleware
app.use(bodyParser.json());
app.use(cors())
//routes
app.use("/chats", chatRouter);

//setup event listener
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

            let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
            chatMessage.save();
        });
    });
});

//wire up the server to listen to our port 500
http.listen(port, () => {
    console.log("connected to port: " + port)
});