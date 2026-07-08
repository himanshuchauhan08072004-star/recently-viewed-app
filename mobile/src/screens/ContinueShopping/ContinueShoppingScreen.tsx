import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, Alert } from 'react-native';
import { useContinueShopping } from '@/hooks/useContinueShopping';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { SkeletonRow } from '@/components/SkeletonCard/SkeletonCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { COLORS } from '@/constants/config';
import { RecentlyViewedItem, Product } from '@/types';

export function ContinueShoppingScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { data: items, isLoading, error, refetch, isRefetching } = useContinueShopping();

  const handleView = useCallback((_product: Product) => {}, []);
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
      <Text style={[styles.heading, isDark && styles.headingDark]}>Continue Shopping</Text>

      {isLoading ? (
        <SkeletonRow count={4} />
      ) : error ? (
        <EmptyState
          title="Couldn't load this section"
          subtitle="Check your connection and try again"
          isError
          onRetry={refetch}
        />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="Nothing left to continue"
          subtitle="Products you've viewed but not bought will appear here"
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
