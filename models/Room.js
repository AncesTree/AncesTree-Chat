const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema(
    {
        name: {
            type: String
        },
        users: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        },
        messages: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
        }
    },
    {
        timestamps: true
    });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;