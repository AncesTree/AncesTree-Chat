const express = require("express");
const app = express()
const http = require("http").Server(app)
const io = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors")
const axios = require("axios")
require('dotenv').config()
const port = 3000;

const socket = io(http);

// DataBase connection
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true
}).then(db => {
    db.dropDatabase();
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(function (req, res, next) {
  if (process.env.ENV != 'DEV') {
    if (!req.headers.authorization) {
      res.status(403).send('Unauthorized')
    }
    let token = req.headers.authorization;
    if (token === 'null') {
      res.status(403).send('Unauthorized')
    }
    axios.get('https://ancestree-auth.igpolytech.fr/auth/checktoken', {
      headers: {
        Authorization: token
      }
    })
      .then((result) => {
        if (result.status === 200) {
          next()
        } else {
          res.status(403).send('Unauthorized')
        }
      })
  } else {
    next()
  }
})

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

  socket.on("User connected", (msg) => {
    const userId = msg.userId;

    User.findById(userId)
      .then(
        result => {
          if (result == null) {

            const newUser = new User(
            {
              _id: msg.userId,
              firstName: msg.firstName,
              lastName: msg.lastName,
              pseudo: "",
              rooms: []
            })
            newUser.save();
          }
        }
      )
  })

  socket.on("chat message", (msg) => {
    const message = { message: msg.message, sender: msg.sender }
    socket.broadcast.emit(msg.room, message);

    let chatMessage = new Message(message);
    chatMessage.save();

    Room.findById(msg.room)
      .then(
        result => {
          result.messages.push(chatMessage._id);
          result.save();
        }
      );
  });

  socket.on("user added in room", (msg) => {
    const userToAdd = msg.user;
    const roomToUpdate = msg.room;

    Room.findById(roomToUpdate)
      .then(
        result => {
          result.users.push(userToAdd);
          result.save();
        }
      );

    User.findById(userToAdd)
      .then(
        result => {
          result.rooms.push(roomToUpdate);
          result.save();
        }
      )

    socket.emit(userToAdd, "You have been added to a conversation");
    socket.emit(roomToUpdate, { message: `I add a user`, sender: actingUser });

  });

  socket.on("user removed from room", (msg) => {
    const userToRemove = msg.user;
    const roomToUpdate = msg.room;
    const actingUser = msg.actingUser;

    Room.findById(roomToUpdate)
      .then(
        result => {
          result.users = result.users.filter(user => user != userToRemove);
          result.save();
        }
      );

    User.findById(userToRemove)
      .then(
        result => {
          result.rooms = result.rooms.filter(room => room != roomToUpdate);
          result.save();
        }
      );

    socket.emit(userToRemove, "You have been removed from a conversation");
    socket.emit(roomToUpdate, { message: `I remove a user`, sender: actingUser });

  });

  socket.on("message removed from room", (msg) => {
    const messageToRemove = msg.message;
    const roomToUpdate = msg.room;

    Room.findById(roomToUpdate)
      .then(
        result => {
          result.messages = result.messages.filter(message => message != messageToRemove);
          result.save();
        }
      );

  });

});

http.listen(port, () => {
  console.log("connected to port: " + port)
});