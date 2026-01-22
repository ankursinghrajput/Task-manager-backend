const express = require("express");
const connectDb = require("./Config/dbConnection");
const errorHandler = require("./Middleware/errorHandling");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5004;

connectDb();

app.use(express.json());
app.use("/user", require("./Routes/userRoute"));
app.use("/tasks", require("./Routes/taskRoute"));
app.use(errorHandler);

app.get("/", (req, res) =>{
    res.send("Server is working!");
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})