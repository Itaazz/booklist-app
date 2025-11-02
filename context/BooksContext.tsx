import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Book } from '@/model/Book';
import getBooks, { updateBook as apiUpdateBook } from '@/service/BookService';
import { Alert } from 'react-native';

type ContextType = {
  books: Book[];
  refresh: () => Promise<void>;
  toggleFavorite: (id: number, next: boolean) => Promise<void>;
  toggleRead: (id: number, next: boolean) => Promise<void>;
  updateLocal: (b: Book) => void;
};

const BooksContext = createContext<ContextType | null>(null);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);

  const refresh = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (e: any) {
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggleFavorite = async (id: number, next: boolean) => {
    setBooks((s) => s.map((b) => (b.id === id ? { ...b, favorite: next } : b)));
    try {
      const updated = await apiUpdateBook(id, { favorite: next } as any);
      setBooks((s) => s.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      Alert.alert('Succès', next ? 'Ajouté aux favoris' : 'Retiré des favoris');
    } catch (e: any) {
      setBooks((s) => s.map((b) => (b.id === id ? { ...b, favorite: !next } : b)));
      Alert.alert('Erreur', e?.message ?? 'Impossible de modifier le favori');
    }
  };

  const toggleRead = async (id: number, next: boolean) => {
    setBooks((s) => s.map((b) => (b.id === id ? { ...b, read: next } : b)));
    try {
      const updated = await apiUpdateBook(id, { read: next } as any);
      setBooks((s) => s.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      Alert.alert('Succès', next ? 'Marqué comme lu' : 'Marqué comme non lu');
    } catch (e: any) {
      setBooks((s) => s.map((b) => (b.id === id ? { ...b, read: !next } : b)));
      Alert.alert('Erreur', e?.message ?? 'Impossible de modifier le statut lu');
    }
  };

  const updateLocal = (b: Book) => {
    setBooks((s) => s.map((it) => (it.id === b.id ? { ...it, ...b } : it)));
  };

  return <BooksContext.Provider value={{ books, refresh, toggleFavorite, toggleRead, updateLocal }}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooks must be used inside BooksProvider');
  return ctx;
}

export default BooksContext;
