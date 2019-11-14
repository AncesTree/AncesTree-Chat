const mongoose = require("mongoose");
const User = require("./User");
const Chat = require("./Chat");
const Schema = mongoose.Schema;
const roomSchema = new Schema(
    {
        id : {
            type: Number
        },
        users: {
            type: [User]
        },
        messages: {
            type: [Chat]
        }
    },
    {
        timestamps: true
    });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;