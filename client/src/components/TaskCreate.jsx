import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TaskCreate = () => {
  const [task, setTask] = useState({ title: "", status: "Pending" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the form from refreshing the page

    try {
      const response = await axios.post("http://localhost:8080/tasks", task, {
        headers: { "Content-Type": "application/json" }, // Ensure JSON format
      });
      console.log("Task Created:", response.data);
      alert("Task Created Successfully!");
      navigate("/tasks/list"); // Redirects after successful creation
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response ? error.response.data : error.message
      );
      alert("Error creating task");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label className="form-label">Task Title:</label>
          <input
            type="text"
            className="form-control"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Task Status:</label>
          <select
            className="form-control"
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;
