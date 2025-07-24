import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import Column from "../Column";
import { db, type statusType } from "../../model/db";
import { useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";

function Project() {
  const createColumnDiaglog = useRef<HTMLDialogElement>(null);
  const createTaskDialog = useRef<HTMLDialogElement>(null);
  const { projectId } = useParams<{ projectId: string }>();

  const columns = useLiveQuery(() => db.columns.where({ projectId }).toArray());
  const tasks = useLiveQuery(() => db.tasks.where({ projectId }).toArray());
  const project = useLiveQuery(() => db.projects.where({ projectId }).first());

  if (project === undefined) {
    return <div>Loading...</div>;
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) {
      return;
    }

    const taskId = event.active.id;
    const newStatus = event.over.id as string;

    db.transaction("rw", db.tasks, () => {
      db.tasks.update(taskId as number, { status: newStatus as statusType });
    }).catch((error) => {
      console.error("Failed to update task status:", error);
    });
  }

  function showCreateColumnDialog() {
    if (createColumnDiaglog.current) {
      createColumnDiaglog.current.showModal();
    }
  }

  function handleCreateColumn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const columnName = formData.get("columnName") as string;
    if (columnName) {
      db.columns.add({
        name: columnName,
        columnId: columnName.toLowerCase().replace(/\s+/g, "-"),
        projectId: project!.projectId,
      });
      if (createColumnDiaglog.current) {
        createColumnDiaglog.current.close();
      }
    }
  }

  function showCreateTaskDialog() {
    if (createTaskDialog.current) {
      createTaskDialog.current.showModal();
    }
  }

  function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const taskName = formData.get("taskName") as string;
    const status = formData.get("status") as string;
    const taskDescription = formData.get("taskDescription") as string;

    if (taskName && taskDescription) {
      db.tasks.add({
        name: taskName,
        description: taskDescription,
        status: status as statusType,
        projectId: project!.projectId,
      });
      if (createTaskDialog.current) {
        createTaskDialog.current.close();
      }
    }
  }

  return (
    <>
      <h1>{project.name}</h1>
      <button onClick={showCreateColumnDialog}>Create Column</button>
      <button onClick={showCreateTaskDialog}>create task</button>
      <dialog ref={createTaskDialog}>
        <form method="dialog" onSubmit={handleCreateTask}>
          <label>
            Task Name:
            <input type="text" name="taskName" required />
          </label>
          <label>
            Task Description:
            <input type="text" name="taskDescription" required />
          </label>
          <label>
            Status:
            <select name="status" required>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <button type="submit">Create</button>
        </form>
      </dialog>
      <dialog ref={createColumnDiaglog}>
        <form method="dialog" onSubmit={handleCreateColumn}>
          <label>
            Column Name:
            <input type="text" name="columnName" required />
          </label>
          <button type="submit">Create</button>
        </form>
      </dialog>

      <div className="columns">
        <DndContext onDragEnd={handleDragEnd}>
          {columns?.map((column) => (
            <Column
              id={column.id}
              key={column.id}
              name={column.name}
              columnId={column.columnId}
              projectId={column.projectId}
              tasks={tasks ?? []}
            />
          ))}
        </DndContext>
      </div>
    </>
  );
}

export default Project;
