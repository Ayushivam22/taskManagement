import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // Fetch tasks from the database
  useEffect(() => {
    axios
      .get("http://localhost:8000/getTasks")
      .then((response) => {
        setTasks(response.data);
        console.log("Tasks fetched successfully");
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const addTask = () => {
    axios
      .post("http://localhost:8000/task", { title, description })
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error("Error adding task:", error));
  };

  // Update a task
  const updateTask = (id, updatedTask) => {
    axios
      .put(`http://localhost:8000/${id}`, updatedTask)
      .then((response) =>
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)))
      )
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:8000/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  // Save edited task
  const saveEdit = (id) => {
    updateTask(id, { title: editedTitle, description: editedDescription });
    setEditingTaskId(null); // Exit edit mode
  };

  return (
    <div>
      <h1>Task Management</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <button onClick={() => updateTask(task._id, { ...task, completed: !task.completed })}>
                  {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </button>
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
