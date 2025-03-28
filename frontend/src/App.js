import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./demoApp.css";
import "./model.css";
import { MdDelete, MdEdit, MdAdd, MdMoreVert } from "react-icons/md";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile if width <= 768px
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null); // Close the dropdown
      }
    };
  
    // Add both `mousedown` and `touchstart` event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
  
    return () => {
      // Clean up both event listeners
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}getTasks`)
      .then((response) => {
        setTasks(response.data);
        console.log("Tasks fetched successfully");
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Open popup window for adding tasks
  const addingNewTask = () => {
    setIsModalOpen(true);
  };

  // Add a new task
  const addTask = () => {
    axios
      .post(`${BASE_URL}task`, { title, description })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setTitle(""); // Clear title input field
        setDescription(""); // Clear description textarea
      })
      .catch((error) => console.error("Error adding task:", error));
    setIsModalOpen(false);
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
    <div className="todo-app">
      <div className="header">Task Manager</div>

      <div className="todo-container">
        <button className="add-button" onClick={addingNewTask}>
          <MdAdd />
        </button>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">Add New Task</div>
              <textarea
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="task-title-input"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="task-desc-input"
              />
              <div className="modal-buttons">
                <button onClick={addTask}>Add Task</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

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
                    {isMobile ? (
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle"
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === task._id ? null : task._id)
                          }
                        >
                          <MdMoreVert />
                        </button>
                        {dropdownOpen === task._id && (
                          <div className="dropdown-menu">
                            <button onClick={() => startEditing(task)}>Edit</button>
                            <button onClick={() => deleteTask(task._id)}>Delete</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  <div className="task-desc">{task.description}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;