import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/config';

interface RetryButtonProps {
  onPress: () => void;
  label?: string;
}

export function RetryButton({ onPress, label = 'Retry' }: RetryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
