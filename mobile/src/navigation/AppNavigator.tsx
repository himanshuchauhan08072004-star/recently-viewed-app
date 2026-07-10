import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginScreen } from '@/screens/Auth/LoginScreen';
import { RegisterScreen } from '@/screens/Auth/RegisterScreen';
import { RecentlyViewedScreen } from '@/screens/RecentlyViewed/RecentlyViewedScreen';
import { ContinueShoppingScreen } from '@/screens/ContinueShopping/ContinueShoppingScreen';
import { ProductDetailScreen } from '@/screens/ProductDetail/ProductDetailScreen';
import { ProductListScreen } from '@/screens/ProductList/ProductListScreen';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS } from '@/constants/config';
import { Product } from '@/types';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Browse: undefined;
  ProductDetail: { product: Product };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type Nav = NativeStackNavigationProp<RootStackParamList>;

// Composite "Home" screen: quick nav bar + Recently Viewed + Continue Shopping,
// matching the requirement that both sections live together on the main screen.
function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const isGuest = useAuthStore((s) => s.isGuest);
  const logout = useAuthStore((s) => s.logout);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarBtn}
          onPress={() => navigation.navigate('Browse')}
        >
          <Text style={styles.topBarBtnText}>Browse Products</Text>
        </Pressable>

        {isGuest ? (
          <Pressable
            style={[styles.topBarBtn, styles.topBarBtnOutline]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.topBarBtnOutlineText}>Log In</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.topBarBtn, styles.topBarBtnOutline]} onPress={logout}>
            <Text style={styles.topBarBtnOutlineText}>Log Out</Text>
          </Pressable>
        )}
      </View>

      <RecentlyViewedScreen />
      <ContinueShoppingScreen />
    </ScrollView>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Shop' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
   <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Browse" component={ProductListScreen} options={{ title: 'All Products' }} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Product' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  topBarBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  topBarBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  topBarBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  topBarBtnOutlineText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
