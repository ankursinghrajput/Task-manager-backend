const express = require("express");
const cors = require("cors");
const connectDb = require("./Config/dbConnection");
const errorHandler = require("./Middleware/errorHandling");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5004;

connectDb();

// Enable CORS for frontend
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));

app.use(express.json());
app.use("/user", require("./Routes/userRoute"));
app.use("/tasks", require("./Routes/taskRoute"));
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Server is working!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})