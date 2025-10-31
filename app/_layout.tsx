import { Stack, Link } from 'expo-router';
import { Text, View } from 'react-native';
import { BooksProvider } from '@/context/BooksContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/component/ThemeToggle';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BooksProvider>
        <Stack>
        <Stack.Screen name="index" options={{ title: 'Bibliothèques', headerShown: true }} />
        <Stack.Screen
          name="books"
          options={{
            title: 'Livres',
            headerShown: true,
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemeToggle />
                <Link href="/books/create">
                  <Text style={{ marginRight: 12, color: '#0a84ff', fontWeight: '600' }}>Ajouter</Text>
                </Link>
              </View>
            ),
          }}
        />
        </Stack>
      </BooksProvider>
    </ThemeProvider>
  );
};
