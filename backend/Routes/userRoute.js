const express = require("express");
const { registerUser, loginUser, currentUser, changePassword, deleteUser } = require("../Controllers/authController");
const validateToken = require("../Middleware/validateToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.put("/change-password", validateToken, changePassword);
router.delete("/delete-user", validateToken, deleteUser);

module.exports = router;