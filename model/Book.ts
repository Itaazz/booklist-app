export type Book = {
  id: number;
  name: string;
  author?: string;
  year?: number;
  cover?: string | null;
};