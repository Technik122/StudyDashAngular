export interface ToDo {
  id: string;
  description: string;
  completed: boolean;
  deadLine: string;
  priority: string;
  courseId?: string;
}
