import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import getBooks from '@/service/BookService';
import type { Book } from '@/model/Book';
import BookCard from '@/component/BookCard';

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getBooks().then((data) => setBooks(data));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <BookCard book={item} />}
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
