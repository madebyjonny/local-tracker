import Dexie, { type Table } from "dexie";

export type statusType = "to-do" | "in-progress" | "in-review" | "done";

export interface TaskItem {
  id?: number;
  columnId?: number;
  projectId?: string;
  name: string;
  description: string;
  status: statusType; // e.g., "todo", "in-progress", "done"
}
export interface TaskColumn {
  id?: number;
  name: string;
  columnId: string;
  projectId: string;
}

export interface Project {
  id?: number;
  name: string;
  projectId: string;
}

export class TasksDB extends Dexie {
  columns!: Table<TaskColumn, number>;
  tasks!: Table<TaskItem, number>;
  project!: Table<Project, number>;
  constructor() {
    super("Tasks");
    this.version(1).stores({
      columns: "++id, projectId",
      tasks: "++id, columnId, projectId",
      project: "++id, name ",
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
