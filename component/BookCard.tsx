import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Book } from '@/model/Book';

export default function BookCard({ book }: { book: Book }) {
  return (
    <View style={styles.card}>
      <View style={styles.txtInCard}>
        <Text style={styles.title}>{book.name}</Text>
        {book.author ? <Text style={styles.author}>Auteur : {book.author}</Text> : null}
        {book.year ? <Text style={styles.year}>Année : {String(book.year)}</Text> : null}
      </View>
      {book.cover ? (
        <Image style={styles.image} source={{ uri: book.cover }} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
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
});
