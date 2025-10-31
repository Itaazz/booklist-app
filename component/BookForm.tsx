import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import pickImageFromLibrary from '@/component/ImagePickerHelper';
import type { Book } from '@/model/Book';
import BookRating from '@/component/BookRating';

type BookPayload = {
  name?: string;
  author?: string;
  editor?: string;
  year?: number | string;
  rating?: number | null;
  cover?: string;
};

type Props = {
  initial?: Partial<Book & { editor?: string }>;
  onSubmit: (payload: Partial<BookPayload>) => Promise<void> | void;
  submitLabel?: string;
  allowPartial?: boolean;
};

export default function BookForm({ initial, onSubmit, submitLabel = 'Enregistrer', allowPartial = false }: Props) {
  const [name, setName] = useState(String(initial?.name ?? ''));
  const [author, setAuthor] = useState(String(initial?.author ?? ''));
  const [editor, setEditor] = useState(String(initial?.editor ?? ''));
  const [year, setYear] = useState(initial?.year != null ? String(initial.year) : '');
  const [cover, setCover] = useState(String(initial?.cover ?? ''));
  const [rating, setRating] = useState<number | null>(
    initial?.rating != null ? Number(initial.rating) : (allowPartial ? null : 0),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleSubmit = async () => {
    if (!allowPartial) {
      const nextErrors: Record<string, string> = {};
      if (!name || !name.trim()) nextErrors.name = 'Champ obligatoire';
      if (!author || !author.trim()) nextErrors.author = 'Champ obligatoire';
      if (!editor || !editor.trim()) nextErrors.editor = 'Champ obligatoire';
      if (!year || !String(year).trim()) nextErrors.year = 'Champ obligatoire';
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      const payload: BookPayload = {
        name,
        author,
        editor,
        year: Number(year),
        cover: cover || undefined,
        rating: rating != null ? Number(rating) : 0,
      };

      try {
        setSubmitting(true);
        await onSubmit(payload);
        setErrors({});
      } catch (e: any) {
        if (Platform.OS === 'web') window.alert(`Erreur\n\n${e?.message ?? 'Erreur lors de la création'}`);
        else Alert.alert('Erreur', e?.message ?? 'Erreur lors de la création');
      } finally {
        setSubmitting(false);
      }

      return;
    }

    const changed: Partial<BookPayload> = {};

    const initialName = String(initial?.name ?? '');
    const initialAuthor = String(initial?.author ?? '');
    const initialEditor = String(initial?.editor ?? '');
    const initialYear = initial?.year != null ? String(initial.year) : '';
    const initialCover = String(initial?.cover ?? '');
  const initialRating = initial?.rating != null ? Number(initial.rating) : null;

    if (name !== initialName) changed.name = name;
    if (author !== initialAuthor) changed.author = author;
    if (editor !== initialEditor) changed.editor = editor;
    if (year !== initialYear && year !== '') changed.year = Number(year);
    if (cover !== initialCover) changed.cover = cover || undefined;
  if (rating !== initialRating) changed.rating = rating != null ? Number(rating) : null;

        if (Object.keys(changed).length === 0) {
            Alert.alert('Aucune modification', "Vous n'avez modifié aucun champ");
            return;
        }

    try {
      setSubmitting(true);
      await onSubmit(changed);
      setErrors({});
    } catch (e: any) {
      if (Platform.OS === 'web') window.alert(`Erreur\n\n${e?.message ?? 'Erreur lors de la sauvegarde'}`);
      else Alert.alert('Erreur', e?.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const pickImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setCover(uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={[styles.input, errors.name ? { borderColor: '#d00' } : null]}
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (errors.name) setErrors((s) => ({ ...s, name: undefined }));
        }}
        placeholder="Nom du livre"
      />
      {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}

      <Text style={styles.label}>Auteur</Text>
      <TextInput
        style={[styles.input, errors.author ? { borderColor: '#d00' } : null]}
        value={author}
        onChangeText={(v) => {
          setAuthor(v);
          if (errors.author) setErrors((s) => ({ ...s, author: undefined }));
        }}
        placeholder="Auteur"
      />
      {errors.author ? <Text style={styles.fieldError}>{errors.author}</Text> : null}

      <Text style={styles.label}>Éditeur</Text>
      <TextInput
        style={[styles.input, errors.editor ? { borderColor: '#d00' } : null]}
        value={editor}
        onChangeText={(v) => {
          setEditor(v);
          if (errors.editor) setErrors((s) => ({ ...s, editor: undefined }));
        }}
        placeholder="Éditeur"
      />
      {errors.editor ? <Text style={styles.fieldError}>{errors.editor}</Text> : null}

      <Text style={styles.label}>Année</Text>
      <TextInput
        style={[styles.input, errors.year ? { borderColor: '#d00' } : null]}
        value={year}
        onChangeText={(v) => {
          setYear(v);
          if (errors.year) setErrors((s) => ({ ...s, year: undefined }));
        }}
        placeholder="1999"
        keyboardType="numeric"
      />
      {errors.year ? <Text style={styles.fieldError}>{errors.year}</Text> : null}

      <Text style={styles.label}>Cover (URL ou galerie)</Text>
      <View style={styles.coverRow}>
        <TextInput style={[styles.input, { flex: 1 }]} value={cover} onChangeText={setCover} placeholder="https://..." />
        <TouchableOpacity onPress={pickImage} style={styles.fileButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="attach-file" size={20} color="#0666cc" />
        </TouchableOpacity>
      </View>

      {cover ? (
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <Image source={{ uri: cover }} style={{ width: 120, height: 180, borderRadius: 6 }} />
          <TouchableOpacity onPress={() => setCover('')} style={styles.imageRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={styles.label}>Note</Text>
      <BookRating rating={rating} onChange={setRating} />

      <View style={styles.button}>
        <Button title={submitting ? 'Envoi...' : submitLabel} onPress={handleSubmit} disabled={submitting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  coverRow: { flexDirection: 'row', alignItems: 'center' },
  fileButton: { padding: 8, marginLeft: 8 },
  imageRemove: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6 },
  button: { marginTop: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  star: { fontSize: 18, marginHorizontal: 1 },
  starFilled: { color: '#f5a623' },
  starEmpty: { color: '#ddd' },
  ratingText: { marginLeft: 8, color: '#444', fontSize: 14 },
  fieldError: { color: '#d00', marginTop: 6, fontSize: 13 },
});
