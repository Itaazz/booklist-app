import type { Book } from '@/model/Book';

export default async function getBooks(): Promise<Book[]> {
  try {
    const res = await fetch('http://localhost:3000/books');
    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((b: any) => ({
      id: Number(b.id),
      name: String(b.name ?? ''),
      author: b.author ?? undefined,
      year: b.year != null ? Number(b.year) : undefined,
      cover: b.cover ?? null,
    }));
  } catch (err) {
    return [];
  }
}   

export async function createBook(payload: Partial<Book> & { editor?: string }) {
  try {
    const res = await fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data as Book;
  } catch (e: any) {
    throw new Error(e?.message ?? 'Network error');
  }
}