const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const registerUser = asyncHandler (async(req,res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Exist!");
    }
    const hashedPassword = await bcrypt.hash(password,10);
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

const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All Field are Mandatory!");
    }
    const user = await User.findOne({email});
    //Compare password with hashPassword
    if (user && (await bcrypt.compare(password,user.password))) {
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
    process.env.ACCESS_TOKEN_SECRET,{expiresIn: "1d"}
    );
    res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@access private
const currentUser = asyncHandler (async (req, res) => {
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser};