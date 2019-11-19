const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        _id: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        pseudo: {
            type: String
        },
        rooms: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
        }
    },
    {
        timestamps: true
    }, {_id: false});

let User = mongoose.model("User", userSchema);
module.exports = User;