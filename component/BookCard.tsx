import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Book } from '@/model/Book';
import { useRouter } from 'expo-router';

export default function BookCard({
  book,
  onDelete,
  onToggleFavorite,
  onToggleRead,
  onPress,
}: {
  book: Book;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number, next: boolean) => void;
  onToggleRead?: (id: number, next: boolean) => void;
  onPress?: () => void;
}) {
  const router = useRouter();
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
      <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
          {book.editor ? <Text style={styles.editor}>Editeur : {book.editor}</Text> : null}
          {book.year ? <Text style={styles.year}>Année : {String(book.year)}</Text> : null}
        </View>
      </TouchableOpacity>

      <View style={styles.rightCol}>
        <TouchableOpacity
          onPress={() => onToggleRead ? onToggleRead(book.id, !Boolean((book as any).read)) : null}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name={(book as any).read ? 'check-circle' : 'check-circle-outline'} size={20} color={(book as any).read ? '#2ecc71' : '#666'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggleFavorite ? onToggleFavorite(book.id, !Boolean((book as any).favorite)) : null}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name={(book as any).favorite ? 'favorite' : 'favorite-border'} size={20} color={(book as any).favorite ? '#e74c3c' : '#666'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/books/${book.id}/edit`)}
          style={styles.editButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

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
  editor: {
    marginTop: 2,
    color: '#666',
    fontSize: 13,
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
  editButton: {
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
  editText: {
    fontSize: 14,
    color: '#0666cc',
    fontWeight: '600',
    marginBottom: 6,
  },
  idText: {
    marginTop: 4,
    color: '#888',
    fontSize: 12,
  },
  
});
