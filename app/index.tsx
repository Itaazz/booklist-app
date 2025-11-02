import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
  
export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.text }]}>Bienvenue dans ta bibliothèque</Text>
      <Text style={[styles.description, { color: colors.muted }] }>
        Consulte tes livres et notes les comme tu le souhaites !
      </Text>

      <Button onPress={()=>router.push("/books")} 
      title="Liste des livres"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
    lineHeight: 20,
  },
  link: {
    color: '#0a84ff',
    fontWeight: '600',
    fontSize: 16,
  },
});
