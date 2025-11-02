import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getNotes, createNote, getBook } from '@/service/BookService';

export default function BookNotes() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [notes, setNotes] = useState<Array<{ id: number; bookId: number; content: string; dateISO: string | null }>>([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const b = await getBook(id);
        if (mounted) setTitle(b.name);
      } catch (_) {
        if (mounted) setTitle(null);
      }
      try {
        const n = await getNotes(id);
        if (mounted) setNotes(n);
      } catch (e: any) {
        if (mounted) setNotes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleAdd = async () => {
    if (!newNote.trim()) return Alert.alert('Erreur', 'Le contenu est vide');
    setSubmitting(true);
    try {
      const created = await createNote(id, newNote.trim());
      setNotes((s) => [created, ...s]);
      setNewNote('');
      Alert.alert('Succès', 'Avis ajouté');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible d\'ajouter la note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.header, { color: colors.text }]}>{title ? `Avis — ${title}` : 'Avis'}</Text>
      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ padding: 12 }}>
        {loading ? (
          <Text style={[styles.empty, { color: colors.muted }]}>Chargement des notes…</Text>
        ) : notes.length === 0 ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.empty, { color: colors.muted }]}>Aucune note</Text>
          </View>
        ) : (
          notes.map((n) => (
            <View key={String(n.id)} style={[styles.noteRow, { borderBottomColor: colors.border }]}> 
              <Text style={[styles.noteText, { color: colors.text }]}>{n.content}</Text>
              {n.dateISO ? <Text style={[styles.noteDate, { color: colors.muted }]}>{new Date(n.dateISO).toLocaleString()}</Text> : null}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.form}>
        <TextInput
          placeholder="Écrire un avis..."
          value={newNote}
          onChangeText={setNewNote}
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
          multiline
        />
        <Button color={colors.primary} title={submitting ? 'Envoi...' : 'Ajouter'} onPress={handleAdd} disabled={submitting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff', alignItems: 'center' },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  empty: { color: '#666', textAlign: 'center', marginTop: 12 },
  noteRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  noteText: { color: '#222' },
  noteDate: { color: '#888', fontSize: 12, marginTop: 6 },
  form: { width: '100%', maxWidth: 760, paddingTop: 8 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 8, minHeight: 60, marginBottom: 8 },
});
