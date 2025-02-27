import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user] = useState({ name: "Your Name", email: "Your Email", avatar: "https://i.pravatar.cc/150?img=3" });

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ headerShown: false });
    }, [])
  );

  const settingsOptions = [
    { icon: "time-outline", text: "Order History", screen: "OrderHistory" }, // ✅ Đúng tên màn hình
    { icon: "person-outline", text: "Personal Details", screen: "PersonalDetails" },
    { icon: "location-outline", text: "Address", screen: "Address" },
    { icon: "card-outline", text: "PaymentMethod", screen: "PaymentMethod" },
    { icon: "information-circle-outline", text: "About", screen: "About" },
    { icon: "help-circle-outline", text: "Help", screen: "Help" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <ScrollView>
        {settingsOptions.map(({ icon, text, screen }, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigation.navigate(screen)}>
            <Ionicons name={icon} size={24} color="orange" />
            <Text style={styles.menuText}>{text}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="gray" />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace("Login")}>
          <Ionicons name="log-out-outline" size={24} color="orange" />
          <Text style={styles.menuText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  profileHeader: { alignItems: "center", paddingVertical: 30, backgroundColor: "#1e1e1e" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", color: "white" },
  email: { fontSize: 14, color: "gray" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#333" },
  menuText: { flex: 1, fontSize: 16, color: "white", marginLeft: 15 },
});

export default ProfileScreen;
