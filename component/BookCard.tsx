import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import type { Book } from '@/model/Book';

export default function BookCard({
  book,
  onDelete,
}: {
  book: Book;
  onDelete?: (id: number) => void;
}) {
  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      const ok = window.confirm(`Supprimer "${book.name}" ?`);
      if (ok) {
        onDelete?.(book.id);
      }
      return;
    }

    Alert.alert('Supprimer', `Supprimer "${book.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(book.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        {book.cover ? (
          <Image style={styles.image} source={{ uri: book.cover }} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
      </View>

      <View style={styles.txtInCard}>
        <Text style={styles.title}>{book.name}</Text>
          <Text style={styles.idText}>ID: {book.id}</Text>
        {book.author ? <Text style={styles.author}>Auteur : {book.author}</Text> : null}
        {book.year ? <Text style={styles.year}>Année : {String(book.year)}</Text> : null}
      </View>

      <View style={styles.rightCol}>
        <TouchableOpacity
          onPress={() => confirmDelete()}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.deleteText}>Suppr</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  txtInCard: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  author: {
    marginTop: 4,
    color: '#444',
  },
  year: {
    marginTop: 6,
    color: '#666',
    fontSize: 12,
  },
  image: {
    width: 72,
    height: 108,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCol: {
    marginRight: 12,
  },
  rightCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    marginTop: 6,
    padding: 6,
  },
  menuText: {
    fontSize: 20,
    color: '#666',
    lineHeight: 20,
  },
  deleteText: {
    fontSize: 14,
    color: '#d00',
    fontWeight: '600',
  },
  idText: {
    marginTop: 4,
    color: '#888',
    fontSize: 12,
  },
});
