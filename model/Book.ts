export type Book = {
  id: number;
  name: string;
  editor?: string;
  author?: string;
  year?: number;
  cover?: string | null;
};