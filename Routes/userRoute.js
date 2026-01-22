const express = require("express");
const {registerUser, loginUser, currentUser} = require("../Controllers/authController");
const validateToken = require("../Middleware/validateToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);

module.exports = router;