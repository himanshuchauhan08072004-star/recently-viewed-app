import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/config';
import { RetryButton } from '@/components/RetryButton/RetryButton';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  isError?: boolean;
  onRetry?: () => void;
}

export function EmptyState({ title, subtitle, isError, onRetry }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{isError ? '⚠️' : '🕓'}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {onRetry && <RetryButton onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 32,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 6,
    textAlign: 'center',
  },
});
