import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, Alert, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteBook } from '@/service/BookService';
import BookCard from '@/component/BookCard';
import { useBooks } from '@/context/BooksContext';

export default function BooksScreen() {
  const router = useRouter();
  const { books, toggleFavorite, refresh, toggleRead } = useBooks();

  useEffect(() => {
    refresh();
  }, []);
  

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      await refresh();
      Alert.alert('Succès', 'Livre supprimé');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Erreur suppression');
    }
  };

  const handleToggleFavorite = async (id: number, next: boolean) => {
    return toggleFavorite(id, next);
  };

  const handleToggleRead = async (id: number, next: boolean) => {
    return toggleRead(id, next);
  };

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 12 }}>Aucun livre</Text>
          <Button title="Ajouter un livre" onPress={() => router.push('/books/create')} />
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onToggleRead={handleToggleRead}
              onPress={() => router.push(`/books/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
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
