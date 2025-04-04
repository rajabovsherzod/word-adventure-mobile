import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getAllUsers, deleteUser } from "../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  coins: number;
  level: number;
  completedLessons: string[];
  createdAt: string;
};

type Props = {
  setScreen: (screen: string) => void;
};

const AdminPanelScreen: React.FC<Props> = ({ setScreen }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert(
        "Xatolik",
        "Foydalanuvchilar ma'lumotlarini yuklashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert("O'chirish", "Foydalanuvchini o'chirishni xohlaysizmi?", [
      { text: "Yo'q", style: "cancel" },
      {
        text: "Ha",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(userId);
            setUsers(users.filter((user) => user._id !== userId));
            Alert.alert("Muvaffaqiyatli", "Foydalanuvchi o'chirildi");
          } catch (error) {
            Alert.alert(
              "Xatolik",
              "Foydalanuvchini o'chirishda xatolik yuz berdi"
            );
          }
        },
      },
    ]);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.coins}</Text>
            <Text style={styles.statLabel}>Tangalar</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.level}</Text>
            <Text style={styles.statLabel}>Daraja</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.completedLessons.length}</Text>
            <Text style={styles.statLabel}>Darslar</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item._id)}
      >
        <FontAwesome5 name="trash" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3C5BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("Home")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#3C5BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  listContainer: {
    padding: 20,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C5BFF",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    padding: 10,
  },
});

export default AdminPanelScreen;
