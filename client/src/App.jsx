import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskCreate from "./components/TaskCreate";
import TaskView from "./components/TaskView";
import TaskUpdate from "./components/TaskUpdate";
import PageHeader from "./components/PageHeader";

const App = () => (
  <Router>
    <PageHeader />
    <div className="container mt-4">
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/tasks/list" element={<TaskList />} />
        <Route path="/tasks/create" element={<TaskCreate />} />
        <Route path="/tasks/view/:id" element={<TaskView />} />
        <Route path="/tasks/edit/:id" element={<TaskUpdate />} />
      </Routes>
    </div>
  </Router>
);

export default App;
