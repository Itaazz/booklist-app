import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, Alert, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteBook } from '@/service/BookService';
import BookCard from '@/component/BookCard';
import { useBooks } from '@/context/BooksContext';
import BooksFilter from '@/component/BooksFilter';

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
      <BooksFilter books={books}>
        {(list) =>
          list.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 12 }}>Aucun livre correspondant</Text>
              <Button title="Ajouter un livre" onPress={() => router.push('/books/create')} />
            </View>
          ) : (
            <FlatList
              data={list}
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
          )
        }
      </BooksFilter>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerArea: { padding: 12, backgroundColor: '#fff' },
  searchInput: { borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 8, marginBottom: 8 },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, backgroundColor: '#f5f5f5', marginRight: 8 },
  chipActive: { backgroundColor: '#0666cc' },
  chipText: { color: '#444' },
  chipTextActive: { color: '#fff' },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sortButton: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, marginRight: 8, backgroundColor: '#f5f5f5' },
  sortActive: { backgroundColor: '#0666cc' },
  sortText: { color: '#444' },
  sortTextActive: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 8 },
  cover: { width: 70, height: 100, borderRadius: 5, backgroundColor: '#ddd' },
  coverPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  meta: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  author: { marginTop: 4, color: '#555' },
  year: { marginTop: 6, color: '#888' },
});
