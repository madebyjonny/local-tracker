import "./main.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./model/db";
import Sidebar from "./components/Sidebar";
import Project from "./components/Project";

function App() {
  const projects = useLiveQuery(() => db.projects.toArray());

  if (projects === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`/${projects?.[0]?.projectId}`} replace />}
            />
            <Route path="/:projectId" element={<Project />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
