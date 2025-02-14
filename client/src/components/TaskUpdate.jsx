import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "./PageHeader";

const TaskUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", status: "Pending" }); // Changed 'name' to 'title'

  // Fetch the task details by ID
  useEffect(() => {
    axios
      .get(`http://localhost:8080/tasks/${id}`)
      .then((response) => setTask(response.data))
      .catch(() => alert("Task not found"));
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/tasks/${id}`, task); // Send updated task to backend
      alert("Task Updated Successfully!");
      navigate("/tasks/list");
    } catch (error) {
      alert("Error updating task");
    }
  };

  return (
    <div className="container">
      <h3>Edit Task</h3>
      <form onSubmit={handleSubmit}>
        {/* Edit Task Title */}
        <input
          type="text"
          className="form-control mb-2"
          value={task.title} // Changed from task.name to task.title
          onChange={(e) => setTask({ ...task, title: e.target.value })} // Update title
          placeholder="Task Title"
        />
        {/* Edit Task Status */}
        <select
          className="form-control mb-2"
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button className="btn btn-warning">Update Task</button>
      </form>
      <Link to="/tasks/list" className="btn btn-light mt-2">
        Go Back
      </Link>
    </div>
  );
};

export default TaskUpdate;
