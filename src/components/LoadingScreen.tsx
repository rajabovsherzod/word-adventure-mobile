import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Modal,
  Platform,
} from "react-native";

type Props = {
  color?: string;
};

const LoadingScreen: React.FC<Props> = ({
  color = "#3C5BFF",
}) => {
  // StatusBar ni nazorat qilish
  useEffect(() => {
    // StatusBar ni oq rangga o'zgartirish
    StatusBar.setBackgroundColor("#ffffff");
    StatusBar.setBarStyle("dark-content");

    // iOS da statusbar ni yashirish
    if (Platform.OS === "ios") {
      StatusBar.setHidden(true);
    }

    // Component yo'q bo'lganda oldingi holatiga qaytarish
    return () => {
      if (Platform.OS === "ios") {
        StatusBar.setHidden(false);
      }
    };
  }, []);

  return (
    <Modal
      transparent={false}
      animationType="none"
      visible={true}
      onRequestClose={() => {}}
      statusBarTranslucent={true}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={color} />
          <Text style={styles.text}>Yuklanmoqda...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  activityIndicatorWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});

export default LoadingScreen;
