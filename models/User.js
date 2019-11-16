const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        name: {
            type: String
        },
        pseudo: {
            type: String
        },
        roomsName: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
        }
    },
    {
        timestamps: true
    });

let User = mongoose.model("User", userSchema);
module.exports = User;