const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        nom: {
            type: String
        },
        pseudo: {
            type: String
        }
    },
    {
        timestamps: true
    });

let User = mongoose.model("User", userSchema);
module.exports = User;