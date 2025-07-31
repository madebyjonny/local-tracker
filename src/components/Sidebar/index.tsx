import { useRef } from "react";
import { db } from "../../model/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FaPlus, FaRegFolder, FaRegFolderOpen } from "react-icons/fa6";

function Sidebar() {
  const dialog = useRef<HTMLDialogElement>(null);

  const projects = useLiveQuery(() => db.projects.toArray());

  function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const projectName = formData.get("projectName") as string;
    if (projectName) {
      db.projects.add({
        name: projectName,
        projectId: projectName.toLowerCase().replace(/\s+/g, "-"),
      });
      if (dialog.current) {
        dialog.current.close();
      }
    }
  }

  const showCreateProjectDialog = () => {
    if (dialog.current) {
      dialog.current.showModal();
    }
  };

  return (
    <div className="sidebar">
      <div className="top-panel ">
        <span>Clarity</span>
      </div>

      <div className="container side-bar-content">
        <header className="sidebar-header">
          <h2 className="list-title">Projects</h2>

          <button onClick={showCreateProjectDialog} aria-label="Create Project">
            <FaPlus />
          </button>
        </header>
        <ul className="project-list">
          {projects?.map((project) => {
            const isActive = window.location.pathname.includes(
              project.projectId
            );
            return (
              <li key={project.id}>
                <a href={`/${project.projectId}`} data-active={isActive}>
                  {isActive ? <FaRegFolderOpen /> : <FaRegFolder />}
                  {project.name}
                </a>
              </li>
            );
          })}
        </ul>

        <dialog ref={dialog}>
          <header>
            <h3>Create Project</h3>
          </header>

          <form
            method="dialog"
            onSubmit={handleCreateProject}
            id="create-project"
          >
            <label>
              Project Name:
              <input type="text" name="projectName" required />
            </label>
          </form>

          <footer>
            <button type="submit" form="create-project">
              Create
            </button>
          </footer>
        </dialog>
      </div>
    </div>
  );
}

export default Sidebar;
