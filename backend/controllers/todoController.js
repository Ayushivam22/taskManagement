import Task from "../models/taskModel.js";

// Create a new todo
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = new Task({ title, description });

    const result = await todo.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating task:", error); // Log full error in server console
    res
      .status(400)
      .json({
        message: "Failed to create task",
        error: error.message,
        "request received:": req.body,
      });
  }
};

export const getTasks = async (req, res) => {
  try {
    console.log("GET /getTasks request received");
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description,completed} = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description,completed},
      { new: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update task", error: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL params
    console.log("Deleting task with ID:", id); // Debugging line

    const deletedTask = await Task.findByIdAndDelete(id); // Use MongoDB's _id

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
