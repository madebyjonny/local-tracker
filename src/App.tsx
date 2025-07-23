import { useState } from "react";
import "./main.css";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";

function Column({
  tasks,
  id,
  title,
}: {
  tasks: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
  }>;
  title: string;
  id: string;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="column">
      <h2>{title}</h2>
      <div ref={setNodeRef} className="column-content">
        {tasks
          .filter((task) => {
            return task.status === id;
          })
          .map((task) => (
            <Card
              key={task.id}
              id={task.id}
              name={task.name}
              description={task.description}
            />
          ))}
      </div>
    </div>
  );
}

function Card({
  name,
  description,
  id,
}: {
  name: string;
  description: string;
  id: string;
}) {
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

const initialTasks = [
  {
    id: "1",
    name: "Task 1",
    description: "Description for Task 1",
    status: "todo",
  },
  {
    id: "2",
    name: "Task 2",
    description: "Description for Task 2",
    status: "in-progress",
  },
];

function App() {
  const [tasks, setTasks] =
    useState<
      { id: string; name: string; description: string; status: string }[]
    >(initialTasks);

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) {
      return;
    }

    const taskId = event.active.id;
    const newStatus = event.over.id as string;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
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
        <div className="columns">
          <DndContext onDragEnd={handleDragEnd}>
            <Column title="To Do" id="todo" tasks={tasks} />
            <Column title="In Progress" id="in-progress" tasks={tasks} />
            <Column title="In Review" id="in-review" tasks={tasks} />
            <Column title="Done" id="done" tasks={tasks} />
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;
