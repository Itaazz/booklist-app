import { Stack, Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBooks } from '@/context/BooksContext';
import { BooksProvider } from '@/context/BooksContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/component/ThemeToggle';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BooksProvider>
        <ThemedStack />
      </BooksProvider>
    </ThemeProvider>
  );
}

function ThemedStack() {
  const { colors } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Bibliothèques',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="books"
        options={{
          title: 'Livres',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerRight: () => <HeaderRight />,
        }}
      />
        <Stack.Screen
        name="books/create"
        options={{
          title: 'Ajouter un livre',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="books/[id]/index"
        options={{
          title: 'Détail',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="books/[id]/notes"
        options={{
          title: 'Avis',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />
        <Stack.Screen
        name="books/[id]/edit"
        options={{
          title: 'Modification',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />
    </Stack>
  );
}

function HeaderRight() {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ThemeToggle />
      <Link href="/books/create">
        <Text style={{ marginRight: 12, color: colors.primary, fontWeight: '600' }}>Ajouter</Text>
      </Link>
    </View>
  );
}

function BookHeaderTitle() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { books } = useBooks();
  const { colors } = useTheme();
  const book = books.find((b) => b.id === id);

  return <Text style={{ color: colors.text, fontWeight: '600' }}>{book?.name ?? 'Détail'}</Text>;
}
