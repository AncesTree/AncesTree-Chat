const mongoose = require("mongoose");
const User = require("./User").model("User").schema;
const Message = require("./Message").model("Message").schema;
const Schema = mongoose.Schema;
const roomSchema = new Schema(
    {
        name: {
            type: String
        },
        users: {
            type: [User]
        },
        messages: {
            type: [Message]
        }
    },
    {
        timestamps: true
    });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;