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

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type HeaderProps = {
  title: string;
  onBack: () => void;
  coins: number;
};

const Header: React.FC<HeaderProps> = ({ title, onBack, coins }) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <FontAwesome5 name="chevron-left" size={18} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.coinsContainer}>
          <FontAwesome5 name="coins" size={14} color="#FFD700" />
          <Text style={styles.coinsText}>{coins}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#3C5BFF",
    paddingTop: STATUSBAR_HEIGHT,
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  coinsText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Header;
