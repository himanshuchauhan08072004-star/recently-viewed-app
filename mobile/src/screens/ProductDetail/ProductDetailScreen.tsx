import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAddRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { COLORS } from '@/constants/config';
import { Product } from '@/types';

// In a real app this would come from a product-details API call.
// For this project's scope, the product is passed via navigation params.
export function ProductDetailScreen() {
  const route = useRoute<{ key: string; name: string; params: { product: Product } }>();
  const { product } = route.params;
  const addMutation = useAddRecentlyViewed();

  useEffect(() => {
    // Fire once when the product detail page opens — this is the
    // single entry point for "recently viewed" tracking system-wide.
    addMutation.mutate(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.discountPrice ?? product.price}</Text>
        {product.discountPrice && (
          <Text style={styles.originalPrice}>MRP ₹{product.price}</Text>
        )}
        <Text style={styles.rating}>{product.rating.toFixed(1)} ★ Rating</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 380,
  },
  content: {
    padding: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.muted,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
  },
  originalPrice: {
    fontSize: 13,
    color: COLORS.muted,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  rating: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '700',
    marginTop: 10,
  },
});
