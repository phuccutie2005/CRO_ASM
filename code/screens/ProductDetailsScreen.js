import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventBus } from "../EventBus"; // Sử dụng EventBus để cập nhật số lượng giỏ hàng

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const { cart, addToCart, updateCartQuantity, getCartCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra nếu không có sản phẩm, quay lại màn hình trước
  useEffect(() => {
    if (!product) {
      setTimeout(() => {
        Alert.alert("Lỗi", "Không tìm thấy sản phẩm!", [{ text: "OK", onPress: () => navigation.goBack() }]);
      }, 100);
    }
  }, [product, navigation]);

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    if (!product) return;

    const checkFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        const favoriteItems = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favoriteItems.some((item) => item.id === product.id));
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      }
    };

    checkFavorite();
  }, []);

  // Thêm/Xóa sản phẩm khỏi danh sách yêu thích
  const toggleFavorite = async () => {
    if (!product) return;

    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoriteItems = favorites ? JSON.parse(favorites) : [];

      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = favoriteItems.filter(item => item.id !== product.id);
      } else {
        updatedFavorites = [...favoriteItems, product];
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);

      if (EventBus.listenerCount("updateFavorites") > 0) {
        EventBus.emit("updateFavorites");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
      Alert.alert("Lỗi", "Không thể cập nhật danh sách yêu thích.");
    }
  };

  // Tăng/Giảm số lượng sản phẩm
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  // Xử lý thêm sản phẩm vào giỏ hàng + Cập nhật số lượng trên Bottom Tab
  const handleAddToCart = useCallback(() => {
    if (isProcessing || !product) return;
    setIsProcessing(true);

    try {
      const existingItem = cart.find((item) => item.id === product.id);
      if (existingItem) {
        updateCartQuantity(product.id, existingItem.quantity + quantity);
        Alert.alert("Cập nhật giỏ hàng", `Số lượng: ${existingItem.quantity + quantity}`);
      } else {
        addToCart({ ...product, quantity });
        Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
      }

      // 🔥 Cập nhật số lượng giỏ hàng trên Bottom Tab Bar
      const newCartCount = getCartCount();
      EventBus.emit("updateCartBadge", newCartCount);

    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng.");
    } finally {
      setTimeout(() => setIsProcessing(false), 300);
    }
  }, [isProcessing, quantity, product, addToCart, updateCartQuantity, cart]);

  if (!product) {
    return <ActivityIndicator size="large" color="blue" style={styles.loading} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{product.title}</Text>
        <Image source={{ uri: product.image }} style={styles.image} />

        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Icon name={isFavorite ? "favorite" : "favorite-border"} size={30} color={isFavorite ? "red" : "gray"} />
        </TouchableOpacity>

        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Icon name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Icon name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddToCart}
            disabled={isProcessing}
          >
            <Icon name="add-shopping-cart" size={20} color="white" />
            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buyNowButton]}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Icon name="shopping-cart" size={20} color="white" />
            <Text style={styles.buttonText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  favoriteButton: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  price: {
    fontSize: 18,
    color: "#d32f2f",
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buyNowButton: {
    backgroundColor: "#FF4500",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProductDetailScreen;
