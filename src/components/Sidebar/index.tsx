import { useRef } from "react";
import { db } from "../../model/db";
import { useLiveQuery } from "dexie-react-hooks";

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
      <span>Clarity</span>
      <header>
        <h2>Projects</h2>
        <button onClick={showCreateProjectDialog}>Create Project</button>
        <dialog ref={dialog}>
          <form method="dialog" onSubmit={handleCreateProject}>
            <label>
              Project Name:
              <input type="text" name="projectName" required />
            </label>
            <button type="submit">Create</button>
          </form>
        </dialog>
      </header>

      <ul>
        {projects?.map((project) => (
          <li key={project.id}>
            <a href={`/${project.projectId}`}>{project.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
