import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

type Props = {
  title: string;
  onBack: () => void;
  coins?: number;
};

const Header: React.FC<Props> = ({ title, onBack, coins }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {coins !== undefined && (
        <View style={styles.coinsContainer}>
          <FontAwesome5 name="coins" size={16} color="#FFD700" />
          <Text style={styles.coinsText}>{coins}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinsText: {
    marginLeft: 4,
    color: "#B8860B",
    fontWeight: "600",
  },
});

export default Header;
