import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";
import { register } from "../services/api";

type Props = {
  onLogin: () => void;
  setIsAuthenticated: (value: boolean) => void;
  setScreen: (screen: string) => void;
};

const SignUpScreen: React.FC<Props> = ({
  onLogin,
  setIsAuthenticated,
  setScreen,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Xatolik", "Barcha maydonlarni to'ldiring");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Xatolik", "Parollar mos kelmadi");
      return;
    }

    try {
      setLoading(true);
      console.log("Ro'yxatdan o'tish so'rovi yuborilmoqda...");
      const { user } = await register(name, email, password);
      console.log("Ro'yxatdan o'tish muvaffaqiyatli:", user);
      setIsAuthenticated(true);
      setScreen("Home");
    } catch (error: any) {
      console.error("Ro'yxatdan o'tish xatosi:", error);
      console.error("Xatolik tafsilotlari:", error.response?.data);
      Alert.alert(
        "Xatolik",
        error.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onLogin}
          disabled={loading}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/main_background.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Ro'yxatdan o'tish</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Ismingiz"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email manzilingiz"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Parol"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Parolni tasdiqlang"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Ro'yxatdan o'tish</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>Akkauntingiz bormi? Kirish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C5BFF",
  },
  header: {
    alignItems: "center",
    paddingVertical: 50,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
    fontFamily: "Lexend_400Regular",
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },
  button: {
    backgroundColor: "#3C5BFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Lexend_400Regular",
  },
  loginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#3C5BFF",
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
});

export default SignUpScreen;
