const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const connectDb = require("./Config/dbConnection");
const errorHandler = require("./Middleware/errorHandling");

// Load environment variables
dotenv.config();

// Passport Config
require("./Config/passport");

// Connect to database
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/users", require("./Routes/userRoute"));
app.use("/api/tasks", require("./Routes/taskRoute"));
app.use("/auth", require("./Routes/authRoute"));

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
