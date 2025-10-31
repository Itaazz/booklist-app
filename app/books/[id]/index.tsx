import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getBook, deleteBook, updateBook, createNote } from '@/service/BookService';
import BookRating from '@/component/BookRating';
import { MaterialIcons } from '@expo/vector-icons';
import type { Book } from '@/model/Book';
import { useBooks } from '@/context/BooksContext';

export default function BookDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [book, setBook] = useState<Book | null>(null);
  const [savingRating, setSavingRating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
  const { updateLocal, refresh } = useBooks();

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const ok = window.confirm(`Supprimer "${book?.name}" ?`);
      if (!ok) return;
      deleteBook(id).then(async () => { await refresh(); router.push('/books'); }).catch((e) => Alert.alert('Erreur', e?.message ?? 'Erreur suppression'));
      return;
    }

    Alert.alert('Supprimer', `Supprimer "${book?.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try {
          await deleteBook(id);
          await refresh();
          router.push('/books');
        } catch (e: any) {
          Alert.alert('Erreur', e?.message ?? 'Erreur suppression');
        }
      } },
    ]);
  };

  if (!book) return <View style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      {successMsg ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{successMsg}</Text>
        </View>
      ) : null}
      <ScrollView contentContainerStyle={styles.container}>
        {book.cover ? <Image style={styles.cover} source={{ uri: book.cover }} /> : <View style={[styles.cover, styles.coverPlaceholder]} />}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.title}>{book.name}</Text>
        <MaterialIcons
          name={book.favorite ? 'favorite' : 'favorite-border'}
          size={22}
          color={book.favorite ? '#e74c3c' : '#666'}
          style={{ marginLeft: 8 }}
          onPress={async () => {
            try {
              const updated = await updateBook(id, { favorite: !book.favorite });
              setBook(updated);
              updateLocal(updated);
            } catch (e: any) {
              Alert.alert('Erreur', e?.message ?? 'Impossible de modifier le favori');
            }
          }}
        />
        <MaterialIcons
          name={book.read ? 'check-circle' : 'check-circle-outline'}
          size={22}
          color={book.read ? '#2ecc71' : '#666'}
          style={{ marginLeft: 8 }}
          onPress={async () => {
            try {
              const updated = await updateBook(id, { read: !book.read });
              setBook(updated);
              updateLocal(updated);
            } catch (e: any) {
              Alert.alert('Erreur', e?.message ?? 'Impossible de modifier le statut lu');
            }
          }}
        />
      </View>
      <BookRating
        rating={book.rating}
        onChange={async (value) => {
          if (savingRating) return;
          setSavingRating(true);
            try {
            const updated = await updateBook(id, { rating: value });
            try { await createNote(id, `Notation: ${value}`); } catch (_) {}
              setBook(updated);
              updateLocal(updated);
            setSuccessMsg(`Note mise à jour: ${value}/5`);
            setTimeout(() => setSuccessMsg(null), 2000);
          } catch (e: any) {
            Alert.alert('Erreur', e?.message ?? 'Impossible de mettre à jour la note');
          } finally {
            setSavingRating(false);
          }
        }}
      />
      {book.author ? <Text style={styles.meta}>Auteur: {book.author}</Text> : null}
      {book.editor ? <Text style={styles.meta}>Éditeur: {book.editor}</Text> : null}
      {book.year ? <Text style={styles.meta}>Année: {String(book.year)}</Text> : null}

      <View style={styles.actions}> 
        <Button title="Avis" onPress={() => router.push(`/books/${id}/notes`)} />
        <View style={{ height: 8 }} />
        <Button title="Modifier" onPress={() => router.push(`/books/${id}/edit`)} />
        <View style={{ height: 8 }} />
        <Button color="#d00" title="Supprimer" onPress={handleDelete} />
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  cover: { width: 180, height: 270, borderRadius: 8, backgroundColor: '#eee', marginBottom: 12 },
  coverPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  meta: { fontSize: 14, color: '#444', marginBottom: 4 },
  actions: { marginTop: 18, width: '100%', maxWidth: 360 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  star: { fontSize: 18, marginHorizontal: 1 },
  starFilled: { color: '#f5a623' },
  starEmpty: { color: '#ddd' },
  ratingText: { marginLeft: 8, color: '#444', fontSize: 14 },
  toast: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2ecc71',
    borderRadius: 6,
    zIndex: 1000,
    elevation: 3,
  },
  toastText: { color: '#fff', fontWeight: '600' },
});
