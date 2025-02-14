import { Link } from "react-router-dom";

const PageHeader = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link to="/" className="navbar-brand">
        Task Manager
      </Link>
      <button
        type="button"
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarmenu"
      >
        <span className="navbar-toggler-icon"> </span>
      </button>
      <div id="navbarmenu" className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/" className="nav-link active">
              Tasks
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tasks/create" className="nav-link">
              Add Task
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default PageHeader;
