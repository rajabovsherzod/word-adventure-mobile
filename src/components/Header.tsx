import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type HeaderProps = {
  title: string;
  onBack: () => void;
  coins: number;
};

const Header: React.FC<HeaderProps> = ({ title, onBack, coins }) => {
  let [fontsLoaded] = useFonts({ Lexend_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.coinsContainer}>
          <View style={styles.coins}>
            <FontAwesome5 name="bitcoin" size={18} color="#FFD700" />
            <Text style={styles.coinsText}>{coins}</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#3C5BFF",
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#3C5BFF",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontFamily: "Lexend_400Regular",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  coinsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  coins: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinsText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#3C5BFF",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    width: "0%",
    backgroundColor: "#3C5BFF",
  },
});

export default Header;
