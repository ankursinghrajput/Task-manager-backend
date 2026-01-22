const express = require("express");
const validateToken = require("../Middleware/validateToken");
const {createTask, getTasks, updateTask, deleteTask, getTaskStats, getOverDueTasks} = require("../Controllers/taskController");

const router = express.Router();

router.post("/", validateToken, createTask);
router.get("/", validateToken, getTasks);
router.put("/:id", validateToken, updateTask);
router.delete("/:id", validateToken, deleteTask);
router.get("/stats", validateToken, getTaskStats);
router.get("/overdue", validateToken, getOverDueTasks);

module.exports = router;