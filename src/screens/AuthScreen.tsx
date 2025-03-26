import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Auth: undefined;
  SignUp: undefined;
  Home: undefined;
};

type Props = {
  onSignUp: () => void;
  setIsAuthenticated: (value: boolean) => void;
};

const AuthScreen: React.FC<Props> = ({ onSignUp, setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login:", email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/main_background.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Xush kelibsiz!</Text>
        <Text style={styles.subtitle}>
          O'rganishni davom ettirish uchun tizimga kiring
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email manzilingiz"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Parolingiz"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirish</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={onSignUp}>
          <Text style={styles.signupText}>
            Akkauntingiz yo'qmi? Ro'yxatdan o'tish
          </Text>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    paddingHorizontal: 40,
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
  },
  button: {
    backgroundColor: "#3C5BFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#3C5BFF",
    fontSize: 14,
  },
});

export default AuthScreen;
