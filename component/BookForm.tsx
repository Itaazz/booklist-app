import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Book } from '@/model/Book';

type BookPayload = {
  name: string;
  author: string;
  editor: string;
  year: number | string;
  cover?: string;
};

type Props = {
  initial?: Partial<Book & { editor?: string }>;
  onSubmit: (payload: BookPayload) => Promise<void> | void;
  submitLabel?: string;
};

export default function BookForm({ initial, onSubmit, submitLabel = 'Enregistrer' }: Props) {
  const [name, setName] = useState(String(initial?.name ?? ''));
  const [author, setAuthor] = useState(String(initial?.author ?? ''));
  const [editor, setEditor] = useState(String(initial?.editor ?? ''));
  const [year, setYear] = useState(initial?.year != null ? String(initial.year) : '');
  const [cover, setCover] = useState(String(initial?.cover ?? ''));

  const handleSubmit = () => {
    if (!name || !author || !editor || !year) return;

    const payload: BookPayload = {
      name,
      author,
      editor,
      year: Number(year),
      cover: cover || undefined,
    };

    return onSubmit(payload);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom du livre" />

      <Text style={styles.label}>Auteur</Text>
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Auteur" />

      <Text style={styles.label}>Éditeur</Text>
      <TextInput style={styles.input} value={editor} onChangeText={setEditor} placeholder="Éditeur" />

      <Text style={styles.label}>Année</Text>
      <TextInput style={styles.input} value={year} onChangeText={setYear} placeholder="1999" keyboardType="numeric" />

      <Text style={styles.label}>Cover (URL)</Text>
      <TextInput style={styles.input} value={cover} onChangeText={setCover} placeholder="https://..." />

      <View style={styles.button}>
        <Button title={submitLabel} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6 },
  button: { marginTop: 20 },
});
