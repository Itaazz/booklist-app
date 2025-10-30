import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BookForm from '@/component/BookForm';
import { createBook } from '@/service/BookService';

export default function CreateBook() {
  const router = useRouter();

  const handleSubmit = async (payload: any) => {
    try {
      const created = await createBook(payload);
      router.push('/books');
      Alert.alert('Succès', `Livre créé (id: ${created.id})`);
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Erreur réseau');
    }
  };

  return <BookForm onSubmit={handleSubmit} submitLabel="Créer" />;
}