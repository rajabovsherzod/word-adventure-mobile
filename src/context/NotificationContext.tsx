import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Lexend_400Regular } from "@expo-google-fonts/lexend";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "login" | "signup" | "lesson" | "system";
  timestamp: Date;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  showToast: (
    title: string,
    message: string,
    type: Notification["type"]
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastData, setToastData] = useState<{
    title: string;
    message: string;
    type: Notification["type"];
  } | null>(null);
  const toastAnimation = React.useRef(new Animated.Value(0)).current;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const showToast = (
    title: string,
    message: string,
    type: Notification["type"]
  ) => {
    setToastData({ title, message, type });
    setToastVisible(true);

    // Add to notifications list
    addNotification({ title, message, type });

    // Animate toast
    Animated.sequence([
      Animated.timing(toastAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2700), // Show for 2.7 seconds
      Animated.timing(toastAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "login":
        return "sign-in-alt";
      case "signup":
        return "user-plus";
      case "lesson":
        return "book";
      case "system":
        return "info-circle";
      default:
        return "bell";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "login":
        return "#3C5BFF";
      case "signup":
        return "#4CAF50";
      case "lesson":
        return "#FF9800";
      case "system":
        return "#9C27B0";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        showToast,
      }}
    >
      {children}
      {toastVisible && toastData && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastAnimation,
              transform: [
                {
                  translateY: toastAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.toast,
              { borderLeftColor: getNotificationColor(toastData.type) },
            ]}
          >
            <View style={styles.toastIconContainer}>
              <FontAwesome5
                name={getNotificationIcon(toastData.type)}
                size={20}
                color={getNotificationColor(toastData.type)}
              />
            </View>
            <View style={styles.toastContent}>
              <Text style={styles.toastTitle}>{toastData.title}</Text>
              <Text style={styles.toastMessage}>{toastData.message}</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  toastIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    fontFamily: "Lexend_400Regular",
  },
  toastMessage: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
});
