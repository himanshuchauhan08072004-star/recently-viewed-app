import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { productsService } from '@/services/products.service';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { COLORS } from '@/constants/config';
import { Product } from '@/types';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProductListScreen() {
  const navigation = useNavigation<Nav>();

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  const handlePress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { product });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <Pressable style={styles.row} onPress={() => handlePress(item)}>
        <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
        <View style={styles.rowInfo}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>₹{item.discountPrice ?? item.price}</Text>
        </View>
      </Pressable>
    ),
    [handlePress]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Couldn't load products"
        subtitle="Check your connection and try again"
        isError
        onRetry={refetch}
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState title="No products in catalog" subtitle="Run the seed script on the backend" />
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  rowInfo: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
  },
  brand: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
});
