import { useDraggable } from "@dnd-kit/core";
import type { TaskItem } from "../../model/db";
import { db } from "../../model/db";
import Dialog from "../Dialog";
import { useRef } from "react";

function Card({ name, description, id = 0 }: TaskItem) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { attributes, setNodeRef, listeners, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <>
      <div
        {...attributes}
        ref={setNodeRef}
        className="card"
        style={style}
        onClick={(e) => {
          e.preventDefault();
          if (dialog.current) {
            dialog.current.showModal();
          }
        }}
      >
        <div
          {...listeners}
          style={{
            cursor: "grab",
          }}
        >
          <h3>{name}</h3>
        </div>
        <p>{description}</p>
      </div>
      <Dialog
        ref={dialog}
        title={"Task Details"}
        buttonLabel="Delete"
        formName="delete-task-form"
      >
        <h2>Task Details</h2>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <form
          method="dialog"
          id="delete-task-form"
          name="delete-task-form"
          style={{ display: "none" }}
          onSubmit={() => {
            // Handle delete logic here
            db.tasks.where({ id }).delete();
          }}
        ></form>
      </Dialog>
    </>
  );
}

export default Card;
