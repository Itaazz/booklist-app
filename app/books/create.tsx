import React from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import BookForm from '@/component/BookForm';
import { createBook } from '@/service/BookService';
import { useTheme } from '@/context/ThemeContext';

export default function CreateBook() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleSubmit = async (payload: any) => {
    try {
      const created = await createBook(payload);
  router.push('/books');
  Alert.alert('Succès', 'Livre créé');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Erreur réseau');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BookForm onSubmit={handleSubmit} submitLabel="Créer" />
    </View>
  );
}