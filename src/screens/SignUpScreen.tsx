import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";

type Props = {
  onBack: () => void;
};

const SignUpScreen: React.FC<Props> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    console.log("SignUp:", email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
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
          placeholder="Email manzilingiz"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Parol"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Parolni tasdiqlang"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Ro'yxatdan o'tish</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={onBack}>
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
