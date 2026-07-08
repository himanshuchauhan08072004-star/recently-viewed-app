import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/config';

export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, { opacity }]} />
      <Animated.View style={[styles.line, styles.lineShort, { opacity }]} />
      <Animated.View style={[styles.line, styles.lineLong, { opacity }]} />
      <Animated.View style={[styles.line, styles.lineMedium, { opacity }]} />
    </View>
  );
}

export function SkeletonRow({ count = 4 }: { count?: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    marginRight: 12,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  line: {
    height: 10,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginTop: 10,
  },
  lineShort: { width: '40%' },
  lineMedium: { width: '70%' },
  lineLong: { width: '90%' },
});
