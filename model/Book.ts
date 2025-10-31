export type Book = {
  id: number;
  name: string;
  editor?: string;
  author?: string;
  year?: number;
  cover?: string | null;
  rating?: number | null;
  favorite?: boolean;
  read?: boolean;
};