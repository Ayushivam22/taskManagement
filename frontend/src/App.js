import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { MdDelete, MdEdit } from "react-icons/md";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // Fetch tasks from the database
  useEffect(() => {
    axios
      .get(`${BASE_URL}getTasks`)
      .then((response) => {
        setTasks(response.data);
        console.log("Tasks fetched successfully");
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const addTask = () => {
    axios
      .post(`${BASE_URL}task`, { title, description })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setTitle(""); // Clear title input field
        setDescription(""); // Clear description textarea)
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Update a task (toggle completion)
  const toggleCompletion = (id, completed) => {
    axios
      .put(`${BASE_URL}${id}`, { completed })
      .then(() => {
        setTasks(
          tasks.map((task) => (task._id === id ? { ...task, completed } : task))
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`${BASE_URL}${id}`)
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
    axios
      .put(`${BASE_URL}${id}`, {
        title: editedTitle,
        description: editedDescription,
      })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task._id === id
              ? { ...task, title: editedTitle, description: editedDescription }
              : task
          )
        );
        setEditingTaskId(null); // Exit edit mode
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div className="todo-container">
      <h1>Task Management</h1>
      <div className="add-task">
        <div className="task-heading-add-task">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-title-input"
          />
        </div>
        <div className="task-desc">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            {editingTaskId === task._id ? (
              <div className="editing-task-card">
                <div className="editing-task-title">
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
                </div>
                <div className="editing-task-buttons">
                <button onClick={() => saveEdit(task._id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="task-card">
                <div className="task-heading">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) =>
                      toggleCompletion(task._id, e.target.checked)
                    }
                  />
                  <div className="task-title">
                    <h2 className={task.completed ? "completed" : ""}>
                      {task.title}
                    </h2>
                  </div>
                  <button
                    className="edit-button"
                    onClick={() => startEditing(task)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task._id)}
                  >
                    <MdDelete />
                  </button>
                </div>
                <div className="task-desc">{task.description}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
