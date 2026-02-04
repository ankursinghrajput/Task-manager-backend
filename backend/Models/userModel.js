const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Plaese add your user name"],
    },
    email: {
        type: String,
        required: [true, "Please add your email address"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        unique: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);