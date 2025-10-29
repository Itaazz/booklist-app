import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
      <Stack.Screen name="index" options={{ title: 'Bibliothèques', headerShown: true }} />
      <Stack.Screen name="books" options={{ title: 'Books', headerShown: true }} />
    </Stack>
  );
};
