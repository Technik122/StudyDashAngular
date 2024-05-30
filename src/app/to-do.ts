import {Subtask} from "./subtask";

export interface ToDo {
  id: string;
  description: string;
  completed: boolean;
  deadLine: string;
  priority: string;
  subtasks?: Subtask[];
}
