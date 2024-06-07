export interface Course {
  id: string;
  name: string;
  semester: number;
  exam: string;
  examDate: string;
  grade?: number;
  completed: boolean;
  course: string;
}
