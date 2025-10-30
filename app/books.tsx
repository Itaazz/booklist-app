import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import getBooks, { deleteBook } from '@/service/BookService';
import type { Book } from '@/model/Book';
import BookCard from '@/component/BookCard';

export default function BooksScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getBooks().then((data) => setBooks(data));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      setBooks((s) => s.filter((b) => b.id !== id));
      Alert.alert('Succès', 'Livre supprimé');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Erreur suppression');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.id}`)} android_ripple={{ color: '#eee' }}>
            <BookCard book={item} onDelete={handleDelete} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 8 },
  cover: { width: 70, height: 100, borderRadius: 5, backgroundColor: '#ddd' },
  coverPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  meta: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  author: { marginTop: 4, color: '#555' },
  year: { marginTop: 6, color: '#888' },
});
