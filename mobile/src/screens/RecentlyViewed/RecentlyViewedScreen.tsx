import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, Alert } from 'react-native';
import { useRecentlyViewed, useAddRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { SkeletonRow } from '@/components/SkeletonCard/SkeletonCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { COLORS } from '@/constants/config';
import { Product, RecentlyViewedItem } from '@/types';

export function RecentlyViewedScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { items, isLoading, error, refetch, isRefetching } = useRecentlyViewed();
  const addMutation = useAddRecentlyViewed();

  const handleView = useCallback((product: Product) => {
    // Re-viewing moves it to top again — same upsert flow.
    addMutation.mutate(product);
  }, [addMutation]);

  const handleAddToCart = useCallback((product: Product) => {
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  }, []);

  const handleWishlist = useCallback((product: Product) => {
    Alert.alert('Wishlist', `${product.name} has been added to your wishlist.`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: RecentlyViewedItem }) => (
      <ProductCard
        product={item.productId}
        onView={handleView}
        onAddToCart={handleAddToCart}
        onWishlist={handleWishlist}
      />
    ),
    [handleView, handleAddToCart, handleWishlist]
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.heading, isDark && styles.headingDark]}>Recently Viewed</Text>

      {isLoading ? (
        <SkeletonRow count={4} />
      ) : error ? (
        <EmptyState
          title="Couldn't load your history"
          subtitle="Check your connection and try again"
          isError
          onRetry={refetch}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No products viewed yet"
          subtitle="Products you view will show up here"
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          // Performance: fixed item width lets FlatList skip measuring.
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  containerDark: {
    backgroundColor: COLORS.backgroundDark,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headingDark: {
    color: COLORS.textDark,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
