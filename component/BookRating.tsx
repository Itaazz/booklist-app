import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  rating?: number | null;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: number;
};

export default function BookRating({ rating = null, onChange, disabled = false, size = 24 }: Props) {
  const interactive = typeof onChange === 'function' && !disabled;
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const i = idx + 1;
        const display = rating != null ? Math.round(Number(rating)) : 0;
        const iconName = display >= i ? 'star' : 'star-border';
        const color = display >= i ? colors.gold : colors.placeholder;

        return (
          <Pressable
            key={i}
            style={[styles.starWrapper, { width: size + 6, height: size }]}
            onPress={() => interactive && onChange && onChange(i)}
            testID={`star-${i}`}
          >
            <MaterialIcons name={iconName as any} size={size} color={color} />
          </Pressable>
        );
      })}

      <Text style={[styles.text, { marginLeft: 8, color: colors.text }]}>{rating != null ? String(Math.round(Number(rating))) : '—'}/5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  starWrapper: { marginHorizontal: 2, justifyContent: 'center' },
  text: { color: '#444', fontSize: 14 },
});
