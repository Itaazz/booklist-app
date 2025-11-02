import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function createThemedStyles<T extends { [k: string]: any }>(factory: (colors: any) => T) {
  return function useThemedStyles() {
    const { colors } = useTheme();
    const styles = useMemo(() => StyleSheet.create(factory(colors)), [colors]);
    return styles as T;
  };
}

export default createThemedStyles;
