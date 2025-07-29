import { useDraggable } from "@dnd-kit/core";
import type { TaskItem } from "../../model/db";

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
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Card;
