import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FavoriteScreen = ({ navigation }) => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm tải danh sách yêu thích từ AsyncStorage
    const loadFavorites = async () => {
        setLoading(true);
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            setFavoriteProducts(favorites ? JSON.parse(favorites) : []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách yêu thích:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách yêu thích.");
            setFavoriteProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật danh sách mỗi khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    // Xóa sản phẩm khỏi danh sách yêu thích
    const removeFavorite = async (id) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const updatedFavorites = favoriteProducts.filter((item) => item.id !== id);
                            await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                            setFavoriteProducts(updatedFavorites);
                        } catch (error) {
                            console.error("Lỗi khi xóa sản phẩm yêu thích:", error);
                            Alert.alert("Lỗi", "Không thể xóa sản phẩm khỏi danh sách yêu thích.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="blue" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách sản phẩm yêu thích</Text>
            {favoriteProducts.length === 0 ? (
                <Text style={styles.emptyText}>Không có sản phẩm yêu thích nào.</Text>
            ) : (
                <FlatList
                    data={favoriteProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <TouchableOpacity
                                style={styles.imageContainer}
                                onPress={() => navigation.navigate("ProductDetail", { product: item })}
                            >
                                <Image source={{ uri: item.image }} style={styles.productImage} />
                            </TouchableOpacity>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.productPrice}>${item.price}</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                                <Icon name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
        color: "gray",
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    imageContainer: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    productImage: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productPrice: {
        fontSize: 14,
        color: "#d32f2f",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default FavoriteScreen;
