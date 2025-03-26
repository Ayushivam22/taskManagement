import express from "express";
// import Task from "../models/taskModel.js";
import {getTasks , createTask,updateTask,deleteTask} from "../controllers/todoController.js";
const router = express.Router();

// Get all tasks
router.get("/getTasks", getTasks);

// Create a new task
router.post("/task",createTask);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

export default router;
