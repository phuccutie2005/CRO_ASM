import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text } from "react-native";
import { CartProvider, useCart } from "./code/context/CartContext";

// Import các màn hình
import HomeScreen from "./code/HomeScreen";
import ProductDetailsScreen from "./code/screens/ProductDetailsScreen";
import LoginScreen from "./code/login";
import RegisterScreen from "./code/register";
import ProfileScreen from "./code/screens/profileScreen";
import ForgotPasswordScreen from "./code/screens/ForgotPasswordScreen";
import CheckoutScreen from "./code/screens/CheckoutScreen";
import OrderHistoryScreen from "./code/screens/OrderHistoryScreen";
import FavoritesScreen from "./code/screens/FavoriteScreen";
import CartScreen from "./code/screens/CartScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Stack điều hướng Home + Chi tiết sản phẩm
const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: "Chi Tiết Sản Phẩm" }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Thanh Toán" }} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: "Lịch Sử Đơn Hàng" }} />
  </Stack.Navigator>
);

// ✅ Custom Tab Icon để hiển thị số lượng sản phẩm trong giỏ hàng
const CartIconWithBadge = ({ color, size }) => {
  const { cart } = useCart();
  const cartCount = cart.length;

  return (
    <View>
      <Ionicons name="cart" size={size} color={color} />
      {cartCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -3,
            backgroundColor: "red",
            borderRadius: 10,
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{cartCount}</Text>
        </View>
      )}
    </View>
  );
};

// ✅ Tạo Bottom Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        if (route.name === "Cart") {
          return <CartIconWithBadge color={color} size={size} />;
        }

        let icons = {
          Home: "home",
          Favorites: "heart",
          Profile: "person",
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: "blue",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// ✅ Cấu trúc chính của App
const App = () => (
  <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  </CartProvider>
);

export default App;
