import { useRef } from "react";
import "./main.css";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import Dexie, { type Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

type statusType = "to-do" | "in-progress" | "in-review" | "done";

export interface TaskItem {
  id?: number;
  columnId?: number;
  name: string;
  description: string;
  status: statusType; // e.g., "todo", "in-progress", "done"
}
export interface TaskColumn {
  id?: number;
  name: string;
  columnId: string;
}

export class TasksDB extends Dexie {
  columns!: Table<TaskColumn, number>;
  tasks!: Table<TaskItem, number>;
  constructor() {
    super("Tasks");
    this.version(1).stores({
      columns: "++id",
      tasks: "++id, columnId",
    });
  }

  deleteList(columnId: number) {
    return this.transaction("rw", this.tasks, this.columns, () => {
      this.tasks.where({ columnId }).delete();
      this.columns.delete(columnId);
    });
  }
}

export const db = new TasksDB();

function Column({
  tasks,
  name,
  columnId,
  id,
}: TaskColumn & { tasks: TaskItem[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <div className="column">
      <header className="column-header">
        <h2>{name}</h2>
        <button onClick={() => db.columns.where({ id }).delete()}>
          Delete
        </button>
      </header>

      <div ref={setNodeRef} className="column-content" data-is-over={isOver}>
        {tasks
          .filter((task) => {
            return task.status === columnId;
          })
          .map((task) => (
            <Card
              key={task.id}
              id={task.id}
              name={task.name}
              status={task.status}
              description={task.description}
            />
          ))}
      </div>
    </div>
  );
}

function Card({ name, description, id = 0 }: TaskItem) {
  const { attributes, setNodeRef, listeners, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      {...listeners}
      className="card"
      style={style}
    >
      {name} {description}
    </div>
  );
}

function App() {
  //const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const createColumnDiaglog = useRef<HTMLDialogElement>(null);
  const createTaskDialog = useRef<HTMLDialogElement>(null);
  const columns = useLiveQuery(() => db.columns.toArray());
  const tasks = useLiveQuery(() => db.tasks.toArray());

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
      });
      if (createTaskDialog.current) {
        createTaskDialog.current.close();
      }
    }
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Projects</h2>
        <ul>
          <li>Website</li>
        </ul>
      </div>
      <div className="main-content">
        <h1>Website</h1>
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
                tasks={tasks ?? []}
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;
