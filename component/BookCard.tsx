import React from 'react';
import { Image, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import type { Book } from '@/model/Book';
import { useRouter } from 'expo-router';
import createThemedStyles from './useThemedStyles';

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

  const styles = useStyles() as any;
  const { colors } = useTheme();

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
          <MaterialIcons name={(book as any).read ? 'check-circle' : 'check-circle-outline'} size={20} color={(book as any).read ? colors.success : colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggleFavorite ? onToggleFavorite(book.id, !Boolean((book as any).favorite)) : null}
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name={(book as any).favorite ? 'favorite' : 'favorite-border'} size={20} color={(book as any).favorite ? colors.danger : colors.muted} />
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

const useStyles = createThemedStyles((colors: any) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.card,
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
    color: colors.text,
  },
  author: {
    marginTop: 4,
    color: colors.text,
  },
  editor: {
    marginTop: 2,
    color: colors.text,
    fontSize: 13,
    opacity: 0.8,
  },
  year: {
    marginTop: 6,
    color: colors.text,
    fontSize: 12,
    opacity: 0.8,
  },
  image: {
    width: 72,
    height: 108,
    borderRadius: 6,
    backgroundColor: colors.placeholder,
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
    color: colors.text,
    lineHeight: 20,
  },
  deleteText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '600',
  },
  editText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  // idText removed — IDs are not shown in the UI anymore (only used internally)
  iconColor: { color: colors.text },
}));
