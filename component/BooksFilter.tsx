import React, { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Book } from '@/model/Book';

export default function BooksFilter({
  books,
  children,
}: {
  books: Book[];
  children: (filtered: Book[]) => React.ReactNode;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread' | 'favorite'>('all');
  const [sortKey, setSortKey] = useState<'title' | 'author' | 'theme'>('title');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books.slice();
    if (q) {
      list = list.filter((b) => (b.name || '').toLowerCase().includes(q) || ((b.author || '').toLowerCase().includes(q)));
    }
    if (filter === 'read') list = list.filter((b) => Boolean((b as any).read));
    if (filter === 'unread') list = list.filter((b) => !Boolean((b as any).read));
    if (filter === 'favorite') list = list.filter((b) => Boolean((b as any).favorite));

    list.sort((a, b) => {
      const key = sortKey === 'title' ? 'name' : sortKey;
      const va = ((a as any)[key] || '').toString();
      const vb = ((b as any)[key] || '').toString();
      return va.localeCompare(vb, 'fr', { sensitivity: 'base' });
    });

    return list;
  }, [books, query, filter, sortKey]);

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TextInput placeholder="Recherche par titre ou auteur..." value={query} onChangeText={setQuery} style={styles.searchInput} />

        <View style={styles.chipsRow}>
          <TouchableOpacity onPress={() => setFilter('all')} style={[styles.chip, filter === 'all' && styles.chipActive]}>
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('read')} style={[styles.chip, filter === 'read' && styles.chipActive]}>
            <Text style={[styles.chipText, filter === 'read' && styles.chipTextActive]}>Lus</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('unread')} style={[styles.chip, filter === 'unread' && styles.chipActive]}>
            <Text style={[styles.chipText, filter === 'unread' && styles.chipTextActive]}>Non lus</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('favorite')} style={[styles.chip, filter === 'favorite' && styles.chipActive]}>
            <Text style={[styles.chipText, filter === 'favorite' && styles.chipTextActive]}>Favoris</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sortRow}>
          <Text style={{ color: '#444', marginRight: 8 }}>Trier :</Text>
          <TouchableOpacity onPress={() => setSortKey('title')} style={[styles.sortButton, sortKey === 'title' && styles.sortActive]}>
            <Text style={sortKey === 'title' ? styles.sortTextActive : styles.sortText}>Titre</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortKey('author')} style={[styles.sortButton, sortKey === 'author' && styles.sortActive]}>
            <Text style={sortKey === 'author' ? styles.sortTextActive : styles.sortText}>Auteur</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortKey('theme')} style={[styles.sortButton, sortKey === 'theme' && styles.sortActive]}>
            <Text style={sortKey === 'theme' ? styles.sortTextActive : styles.sortText}>Thème</Text>
          </TouchableOpacity>
        </View>
      </View>

      {children(filtered)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
});
