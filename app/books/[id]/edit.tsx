import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BookForm from '@/component/BookForm';
import { getBook, updateBook } from '@/service/BookService';
import type { Book } from '@/model/Book';

export default function EditBook() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [book, setBook] = useState<Partial<Book> | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getBook(id)
      .then((b) => mounted && setBook(b))
      .catch((e) => {
        mounted && Alert.alert('Erreur', e?.message ?? 'Impossible de charger');
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (payload: any) => {
    try {
      const updated = await updateBook(id, payload);
  router.push('/books');
  Alert.alert('Succès', 'Livre mis à jour');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Erreur réseau');
    }
  };

  if (!book) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BookForm initial={book} onSubmit={handleSubmit} submitLabel="Mettre à jour" allowPartial />
    </View>
  );
}
