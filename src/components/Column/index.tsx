import Card from "../Card";
import { useDroppable } from "@dnd-kit/core";
import { db, type TaskColumn, type TaskItem } from "../../model/db";
import { FaTrashCan } from "react-icons/fa6";

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
        <button
          onClick={() => db.columns.where({ id }).delete()}
          aria-label="Delete Column"
          className="icon"
        >
          <FaTrashCan />
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

export default Column;
