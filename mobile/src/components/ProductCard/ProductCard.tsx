import React, { memo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Product } from '@/types';
import { COLORS } from '@/constants/config';
import { discountPercent } from '@/utils/dateHelpers';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onWishlist: (product: Product) => void;
}

function ProductCardBase({ product, onView, onAddToCart, onWishlist }: ProductCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [imageLoading, setImageLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = discountPercent(product.price, product.discountPrice);
  const displayPrice = product.discountPrice ?? product.price;

  const handleWishlist = () => {
    setWishlisted((prev) => !prev);
    onWishlist(product);
  };

  return (
    <Pressable
      onPress={() => onView(product)}
      style={({ pressed }) => [
        styles.card,
        isDark && styles.cardDark,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.imageWrapper}>
        {imageLoading && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            color={COLORS.primary}
          />
        )}
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
        />
       <Pressable
  style={styles.wishlistBtn}
  onPress={(e) => {
    e.stopPropagation();
    handleWishlist();
  }}
  hitSlop={8}
>
  <Text style={styles.wishlistIcon}>{wishlisted ? '♥' : '♡'}</Text>
</Pressable>
      </View>

      <View style={styles.info}>
        <Text style={[styles.brand, isDark && styles.textDark]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={[styles.name, isDark && styles.textDark]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, isDark && styles.textDark]}>₹{displayPrice}</Text>
          {product.discountPrice && (
            <Text style={styles.originalPrice}>₹{product.price}</Text>
          )}
          {discount && <Text style={styles.discount}>{discount}% OFF</Text>}
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingBadge}>{product.rating.toFixed(1)} ★</Text>
        </View>

      <View style={styles.actions}>
  <Pressable
    style={[styles.actionBtn, styles.primaryBtn]}
    onPress={(e) => {
      e.stopPropagation();
      onAddToCart(product);
    }}
  >
    <Text style={styles.primaryBtnText}>Add to Cart</Text>
  </Pressable>
  <Pressable
    style={[styles.actionBtn, styles.secondaryBtn]}
    onPress={(e) => {
      e.stopPropagation();
      onView(product);
    }}
  >
    <Text style={styles.secondaryBtnText}>View</Text>
  </Pressable>
</View>
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardBase);

const styles = StyleSheet.create({
  card: {
    width: 170,
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: COLORS.surfaceDark,
    borderColor: '#2A2A2A',
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageWrapper: {
    width: '100%',
    height: 190,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistIcon: {
    fontSize: 16,
    color: COLORS.primary,
  },
  info: {
    padding: 10,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  name: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    minHeight: 32,
  },
  textDark: {
    color: COLORS.textDark,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.muted,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 11,
    color: COLORS.discount,
    fontWeight: '700',
  },
  ratingRow: {
    marginTop: 4,
  },
  ratingBadge: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
