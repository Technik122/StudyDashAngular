import {Subtask} from "./subtask";

export interface ToDo {
  id: number;
  description: string;
  completed: boolean;
  deadLine: string;
  priority: string;
  subtasks: Subtask[];
}
