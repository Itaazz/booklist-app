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
      editor: b.editor ?? undefined,
      author: b.author ?? undefined,
      year: b.year != null ? Number(b.year) : undefined,
      cover: b.cover ?? null,
      rating: b.rating != null ? Number(b.rating) : null,
      favorite: !!b.favorite,
      read: !!b.read,
    }));
  } catch (err) {
    return [];
  }
}   

export async function createBook(payload: Partial<Book> & { editor?: string }) {
  try {
    const body = {
      ...payload,
      rating: payload.rating != null ? payload.rating : 0,
      favorite: payload.favorite != null ? Boolean(payload.favorite) : false,
      read: payload.read != null ? Boolean(payload.read) : false,
    } as any;

    const res = await fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

export async function deleteBook(id: number) {
  try {
    const res = await fetch(`http://localhost:3000/books/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return true;
  } catch (e: any) {
    throw new Error(e?.message ?? 'Network error');
  }
}

export async function getBook(id: number) {
  try {
    const res = await fetch(`http://localhost:3000/books/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const b = await res.json();
    return {
      id: Number(b.id),
      name: String(b.name ?? ''),
      editor: b.editor ?? undefined,
      author: b.author ?? undefined,
      year: b.year != null ? Number(b.year) : undefined,
      cover: b.cover ?? null,
      rating: b.rating != null ? Number(b.rating) : null,
      favorite: !!b.favorite,
      read: !!b.read,
    } as Book;
  } catch (e: any) {
    throw new Error(e?.message ?? 'Network error');
  }
}

export async function updateBook(id: number, payload: Partial<Book> & { editor?: string }) {
  try {
    const res = await fetch(`http://localhost:3000/books/${id}`, {
      method: 'PUT',
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

export async function createNote(bookId: number, content: string) {
  try {
    const res = await fetch(`http://localhost:3000/books/${bookId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (e: any) {
    throw new Error(e?.message ?? 'Network error');
  }
}

export async function getNotes(bookId: number) {
  try {
    const res = await fetch(`http://localhost:3000/books/${bookId}/notes`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((n: any) => ({
      id: Number(n.id),
      bookId: Number(n.bookId),
      content: String(n.content || ''),
      dateISO: n.dateISO ?? null,
    }));
  } catch (e: any) {
    throw new Error(e?.message ?? 'Network error');
  }
}