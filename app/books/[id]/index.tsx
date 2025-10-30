import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getBook, deleteBook } from '@/service/BookService';
import type { Book } from '@/model/Book';

export default function BookDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getBook(id)
      .then((b) => mounted && setBook(b))
      .catch((e) => Alert.alert('Erreur', e?.message ?? 'Livre introuvable'));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const ok = window.confirm(`Supprimer "${book?.name}" ?`);
      if (!ok) return;
      deleteBook(id).then(() => router.push('/books')).catch((e) => Alert.alert('Erreur', e?.message ?? 'Erreur suppression'));
      return;
    }

    Alert.alert('Supprimer', `Supprimer "${book?.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try {
          await deleteBook(id);
          router.push('/books');
        } catch (e: any) {
          Alert.alert('Erreur', e?.message ?? 'Erreur suppression');
        }
      } },
    ]);
  };

  if (!book) return <View style={{ flex: 1 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {book.cover ? <Image style={styles.cover} source={{ uri: book.cover }} /> : <View style={[styles.cover, styles.coverPlaceholder]} />}
      <Text style={styles.title}>{book.name}</Text>
      {book.author ? <Text style={styles.meta}>Auteur: {book.author}</Text> : null}
      {book.editor ? <Text style={styles.meta}>Éditeur: {book.editor}</Text> : null}
      {book.year ? <Text style={styles.meta}>Année: {String(book.year)}</Text> : null}

      <View style={styles.actions}>
        <Button title="Modifier" onPress={() => router.push(`/books/${id}/edit`)} />
        <View style={{ height: 8 }} />
        <Button color="#d00" title="Supprimer" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  cover: { width: 180, height: 270, borderRadius: 8, backgroundColor: '#eee', marginBottom: 12 },
  coverPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  meta: { fontSize: 14, color: '#444', marginBottom: 4 },
  actions: { marginTop: 18, width: '100%', maxWidth: 360 },
});
