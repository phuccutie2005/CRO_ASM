import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Thư viện icon cho nút con mắt
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    const savedEmail = await AsyncStorage.getItem("savedEmail");
    const savedPassword = await AsyncStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  };

  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      console.log("Dữ liệu user từ AsyncStorage:", storedUser);
  
      if (!storedUser) {
        setErrorMessage("Tài khoản chưa được đăng ký!");
        return;
      }
  
      const { email: savedEmail, password: savedPassword } = JSON.parse(storedUser);
  
      console.log("Email nhập:", email);
      console.log("Mật khẩu nhập:", password);
  
      if (email !== savedEmail || password !== savedPassword) {
        setErrorMessage("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        return;
      }
  
      setErrorMessage("");
      console.log("Đăng nhập thành công! Điều hướng đến Home...");
      
      navigation.navigate("Main", { screen: "Home" });

    } catch (error) {
      console.error("Lỗi khi đăng nhập", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.rememberContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.rememberText}>{rememberMe ? "✅ " : "⬜ "}Lưu mật khẩu</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#DB4437" }]}>
          <Ionicons name="logo-google" size={24} color="white" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#4267B2" }]}>
          <Ionicons name="logo-facebook" size={24} color="white" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordInput: { flex: 1 },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
  rememberContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rememberText: { fontSize: 16 },
  button: { backgroundColor: "#ff6347", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  orText: { textAlign: "center", marginVertical: 15, fontSize: 16, color: "#666" },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 10 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    width: 150,
    justifyContent: "center",
  },
  socialText: { color: "white", fontSize: 16, marginLeft: 10, fontWeight: "bold" },
  link: { color: "blue", textAlign: "center", marginTop: 10 }
});

export default LoginScreen;