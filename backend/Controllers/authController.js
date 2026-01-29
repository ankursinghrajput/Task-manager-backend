const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Exist!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword, //Store the hashed version of the password in the database, not the original password.
    });
    return res.status(201).json({
        _id: user.id,
        email: user.email,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All Field are Mandatory!");
    }
    const user = await User.findOne({ email });
    //Compare password with hashPassword
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
            process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

//@desc Change User Password
//@route PUT /user/change-password
//@access private
const changePassword = asyncHandler(async (req, res) => {
    // Step 1: Get data from client
    const { currentPassword, newPassword } = req.body;

    // Step 2: Validate fields
    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error("All fields are required");
    }

    // Step 3: Find user by ID (req.user comes from validateToken middleware)
    const user = await User.findById(req.user.id);

    // Step 4: Compare current password with stored hash
    // bcrypt.compare(plainTextPassword, hashedPassword)
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error("Current password is incorrect");
    }

    // Step 5: Hash new password
    // 10 is the salt rounds (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 6: Update user in database
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
        res.status(400);
        throw new Error("User not Found!");
    }
    res.status(200).json({ message: "User deleted successfully" });
});

module.exports = { registerUser, loginUser, currentUser, changePassword, deleteUser };