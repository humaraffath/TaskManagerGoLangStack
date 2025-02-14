import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/tasks")
      .then((response) => {
        console.log("API Response:", response.data); // Ensure tasks are logged
        if (Array.isArray(response.data)) {
          setTasks(response.data); // Only set tasks if the response is a valid array
        } else {
          setTasks([]); // Default to empty array if the response is invalid
        }
      })
      .catch((error) => {
        console.error("Failed to load tasks:", error); // Log the error
        setError("Failed to load tasks");
        setTasks([]); // Ensure tasks is not null even if the request fails
      });
  }, []);

  // Delete task function
  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:8080/tasks/${id}`); // Correct syntax
        setTasks(tasks.filter((task) => task.id !== id)); // Remove task from state
        alert("Task deleted successfully");
      } catch (error) {
        alert("Failed to delete task");
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Task List</h3>
      {error && <p className="text-danger">{error}</p>}

      {/* Conditionally render "No tasks" message if the tasks array is empty */}
      {Array.isArray(tasks) && tasks.length === 0 ? (
        <p>No tasks to display</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Task Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title || "No Title"}</td>
                <td>{task.status}</td>
                <td>
                  <Link
                    to={`/tasks/view/${task.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/tasks/edit/${task.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
