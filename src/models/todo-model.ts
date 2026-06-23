export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  userId: string;
  tagIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}