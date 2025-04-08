import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "login" | "signup" | "lesson";
  timestamp: Date;
  read: boolean;
};

type Props = {
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  setScreen: (screen: string) => void;
};

const NotificationsScreen: React.FC<Props> = ({
  notifications,
  markNotificationAsRead,
  setScreen,
}) => {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} kun oldin`;
    } else if (hours > 0) {
      return `${hours} soat oldin`;
    } else if (minutes > 0) {
      return `${minutes} daqiqa oldin`;
    } else {
      return "Hozirgina";
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIconContainer}>
        <FontAwesome5
          name={
            item.type === "login"
              ? "sign-in-alt"
              : item.type === "signup"
              ? "user-plus"
              : "book"
          }
          size={20}
          color="#3C5BFF"
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#3C5BFF" }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3C5BFF" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("Home")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirishnomalar</Text>
        <View style={styles.placeholder} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="bell-slash" size={50} color="#9E9E9E" />
          <Text style={styles.emptyText}>Bildirishnomalar yo'q</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedNotification?.title}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome5 name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTime}>
              {selectedNotification &&
                formatTimestamp(selectedNotification.timestamp)}
            </Text>
            <Text style={styles.modalMessage}>
              {selectedNotification?.message}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#3C5BFF",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: "white",
    fontFamily: "Lexend_400Regular",
  },
  placeholder: {
    width: 30,
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: "#F0F4FF",
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "Lexend_400Regular",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontFamily: "Lexend_400Regular",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Lexend_400Regular",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    position: "absolute",
    top: 15,
    right: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9E9E9E",
    marginTop: 10,
    fontFamily: "Lexend_400Regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    fontFamily: "Lexend_400Regular",
  },
  closeButton: {
    padding: 5,
  },
  modalTime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 15,
    fontFamily: "Lexend_400Regular",
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    fontFamily: "Lexend_400Regular",
  },
});

export default NotificationsScreen;
