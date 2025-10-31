import { Stack, Link } from 'expo-router';
import { Text } from 'react-native';
import { BooksProvider } from '@/context/BooksContext';

export default function RootLayout() {
  return (
    <BooksProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Bibliothèques', headerShown: true }} />
        <Stack.Screen
          name="books"
          options={{
            title: 'Livres',
            headerShown: true,
            headerRight: () => (
              <Link href="/books/create">
                <Text style={{ marginRight: 12, color: '#0a84ff', fontWeight: '600' }}>Ajouter</Text>
              </Link>
            ),
          }}
        />
      </Stack>
    </BooksProvider>
  );
};
