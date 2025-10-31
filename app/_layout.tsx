import { Stack, Link } from 'expo-router';
import { Text, View } from 'react-native';
import { BooksProvider } from '@/context/BooksContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/component/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

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
              headerRight: () => <HeaderRight />,
            }}
          />
        </Stack>
      </BooksProvider>
    </ThemeProvider>
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
