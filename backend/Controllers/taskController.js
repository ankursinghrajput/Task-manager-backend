const asyncHandler = require("express-async-handler");
const Task = require("../Models/taskModel");

const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title is required");
    }
    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        userId: req.user.id,
    });
    res.status(201).json(task);
});

const getTasks = asyncHandler(async (req, res) => {
    // Filteration
    const filters = { userId: req.user.id }; //check that tasks created by the logged-in user.
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        // either title or description matches the search query
        filters.$or = [
            { title: searchRegex },
            { description: searchRegex }
        ];
    }

    // Pagination
    const page = Number(req.query.page) || 1; //default 1
    const limit = Number(req.query.limit) || 6; //default 6
    const skip = (page - 1) * limit; //page = 2, limit = 6, skip = 6 i.e Skip first 6 tasks and return next 6.

    // Get total count for pagination
    const total = await Task.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    const tasks = await Task.find(filters) //Applies filters (user, status, priority)
        .sort({ dueDate: 1 }) //earliest due date come first
        .skip(skip) //Skips old records
        .limit(limit) //Returns limited results
        .lean(); //Converts MongoDB document → normal JS object, for faster, less memory.

    const now = new Date();
    const finalTasks = tasks.map(task => ({
        ...task, //spread operator, to copy all the field of tasks.
        isOverdue: task.dueDate && task.dueDate < now && task.status !== "done",
    }));

    res.status(200).json({
        tasks: finalTasks,
        pagination: {
            currentPage: page,
            totalPages,
            totalTasks: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    });
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error("Task not Found");
    }
    if (task.userId.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Not Authorized to update this task");
    }
    const updateTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updateTask);
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(403);
        throw new Error("Task not Found");
    }
    if (task.userId.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Not Authorized to delete this task");
    }
    await task.deleteOne();
    res.status(200).json({ message: "Task deleted Successfully" });
});

const getTaskStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const now = new Date();
    const total = await Task.countDocuments({ userId });
    const completed = await Task.countDocuments({ userId, status: "done" });
    const pending = await Task.countDocuments({ userId, status: "todo" });
    const overdue = await Task.countDocuments({ userId, dueDate: { $lt: now }, status: { $ne: "done" }, });

    res.status(200).json({
        total, completed, pending, overdue,
    });
});

const getOverDueTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({
        userId: req.user.id,
        dueDate: { $lt: new Date() }, // $ lt means less than; Find tasks whose due date is before today.
        status: { $ne: "done" },// $ ne means not equal; Ignore completed tasks.
    });
    res.status(200).json(tasks);
})

module.exports = { createTask, getTasks, updateTask, deleteTask, getTaskStats, getOverDueTasks };