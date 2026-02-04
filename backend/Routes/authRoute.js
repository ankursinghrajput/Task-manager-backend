const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Generates a token
        const token = jwt.sign(
            {
                user: {
                    username: req.user.username,
                    email: req.user.email,
                    id: req.user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // Redirect to frontend with token
        // Assuming frontend is at localhost:5173
        res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    }
);

module.exports = router;
