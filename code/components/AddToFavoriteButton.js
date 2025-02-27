import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventBus } from "../EventBus";

const AddToFavoriteButton = ({ product }) => {
    const handleAddToFavorites = async () => {
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            let favoriteList = favorites ? JSON.parse(favorites) : [];

            // Kiểm tra xem sản phẩm đã tồn tại trong danh sách yêu thích chưa
            const isFavorite = favoriteList.some((item) => item.id === product.id);

            if (!isFavorite) {
                favoriteList.push(product);
                await AsyncStorage.setItem("favorites", JSON.stringify(favoriteList));

                // Gửi sự kiện cập nhật danh sách yêu thích
                EventBus.emit("updateFavorites");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào danh sách yêu thích:", error);
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}>
            <Text style={styles.text}>Thêm vào yêu thích</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    text: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default AddToFavoriteButton;
