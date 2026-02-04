const express = require("express");
const { registerUser, loginUser, currentUser, changePassword, deleteUser, logout, logoutAll } = require("../Controllers/authController");
const validateToken = require("../Middleware/validateToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.put("/change-password", validateToken, changePassword);
router.delete("/delete-user", validateToken, deleteUser);
router.post("/logout", validateToken, logout);
router.post("/logout-all", validateToken, logoutAll);

module.exports = router;