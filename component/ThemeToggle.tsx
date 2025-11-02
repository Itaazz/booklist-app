import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{isDark ? '🌙' : '☀️'}</Text>
      <Switch value={isDark} onValueChange={toggleTheme} thumbColor={isDark ? '#fff' : '#fff'} trackColor={{ false: '#888', true: colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  label: { marginRight: 6, fontSize: 16 },
});
