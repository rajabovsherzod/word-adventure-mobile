import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getAllUsers, deleteUser, getUserProgress } from "../services/api";
import { api } from "../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  coins: number;
  level: number;
  completedLessons: string[];
  createdAt: string;
  isAdmin: boolean;
};

type Props = {
  setScreen: (screen: string) => void;
};

const AdminPanelScreen: React.FC<Props> = ({ setScreen }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalLessonsCompleted: 0,
    totalCoins: 0,
    adminUsers: 0,
    averageLevel: 0,
  });

  const loadUsers = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      console.log("Loading all users from API...");

      const response = await api.get("/users");
      console.log("API response status:", response.status);
      console.log("API response data type:", typeof response.data);
      console.log(
        "API response data length:",
        Array.isArray(response.data) ? response.data.length : "not an array"
      );

      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
        calculateStatistics(response.data);
        console.log(`Loaded ${response.data.length} users successfully`);
      } else {
        console.error("Invalid response format:", response.data);
        setError("Ma'lumotlar formati noto'g'ri");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Foydalanuvchilar ma'lumotlarini yuklashda xatolik yuz berdi");
      Alert.alert(
        "Xatolik",
        "Foydalanuvchilar ma'lumotlarini yuklashda xatolik yuz berdi"
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Component mount bo'lganda foydalanuvchilarni yuklash
  useEffect(() => {
    console.log("AdminPanelScreen mounted - loading users");
    loadUsers();

    // 30 sekundda bir ma'lumotlarni yangilash
    const interval = setInterval(() => {
      console.log("Auto refreshing user data");
      loadUsers(false); // loading ko'rsatmasdan yangilash
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const calculateStatistics = (userData: User[]) => {
    // Umumiy foydalanuvchilar soni
    const totalUsers = userData.length;

    // Faol foydalanuvchilar (kamida 1 ta dars yakunlagan)
    const activeUsers = userData.filter(
      (user) => user.completedLessons?.length > 0
    ).length;

    // Barcha tugatilgan darslar soni
    const totalLessonsCompleted = userData.reduce(
      (total, user) => total + (user.completedLessons?.length || 0),
      0
    );

    // Barcha foydalanuvchilar tangalari
    const totalCoins = userData.reduce(
      (total, user) => total + (user.coins || 0),
      0
    );

    // Admin foydalanuvchilar soni
    const adminUsers = userData.filter((user) => user.isAdmin).length;

    // O'rtacha daraja
    const averageLevel =
      totalUsers > 0
        ? parseFloat(
            (
              userData.reduce((total, user) => total + (user.level || 1), 0) /
              totalUsers
            ).toFixed(1)
          )
        : 0;

    setStatistics({
      totalUsers,
      activeUsers,
      totalLessonsCompleted,
      totalCoins,
      adminUsers,
      averageLevel,
    });
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
            const updatedUsers = users.filter((user) => user._id !== userId);
            setUsers(updatedUsers);
            calculateStatistics(updatedUsers);
            Alert.alert("Muvaffaqiyatli", "Foydalanuvchi o'chirildi");
          } catch (error) {
            console.error("Error deleting user:", error);
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
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userCreated}>
          Ro'yxatdan o'tgan: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.coins || 0}</Text>
            <Text style={styles.statLabel}>Tangalar</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.level || 1}</Text>
            <Text style={styles.statLabel}>Daraja</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {item.completedLessons?.length || 0}
            </Text>
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
          onPress={() => setScreen("Profile")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Boshqaruv Paneli</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-circle" size={40} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadUsers()}
            >
              <Text style={styles.retryButtonText}>Qayta urinish</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.statsOverview}>
              <Text style={styles.sectionTitle}>Umumiy Statistika</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {statistics.totalUsers}
                  </Text>
                  <Text style={styles.statBoxLabel}>Jami Foydalanuvchilar</Text>
                  <FontAwesome5
                    name="users"
                    size={24}
                    color="#3C5BFF"
                    style={styles.statIcon}
                  />
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {statistics.activeUsers}
                  </Text>
                  <Text style={styles.statBoxLabel}>Faol Foydalanuvchilar</Text>
                  <FontAwesome5
                    name="user-check"
                    size={24}
                    color="#4CAF50"
                    style={styles.statIcon}
                  />
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {statistics.totalLessonsCompleted}
                  </Text>
                  <Text style={styles.statBoxLabel}>Tugatilgan Darslar</Text>
                  <FontAwesome5
                    name="book"
                    size={24}
                    color="#FF9800"
                    style={styles.statIcon}
                  />
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {statistics.totalCoins}
                  </Text>
                  <Text style={styles.statBoxLabel}>Jami Tangalar</Text>
                  <FontAwesome5
                    name="coins"
                    size={24}
                    color="#FFC107"
                    style={styles.statIcon}
                  />
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {statistics.adminUsers}
                  </Text>
                  <Text style={styles.statBoxLabel}>
                    Admin Foydalanuvchilar
                  </Text>
                  <FontAwesome5
                    name="user-shield"
                    size={24}
                    color="#F44336"
                    style={styles.statIcon}
                  />
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statBoxValue}>
                    {statistics.averageLevel}
                  </Text>
                  <Text style={styles.statBoxLabel}>O'rtacha Daraja</Text>
                  <FontAwesome5
                    name="signal"
                    size={24}
                    color="#2196F3"
                    style={styles.statIcon}
                  />
                </View>
              </View>
            </View>

            <View style={styles.usersSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Foydalanuvchilar Ro'yxati
                </Text>
                <TouchableOpacity
                  onPress={() => loadUsers()}
                  style={styles.refreshButton}
                >
                  <FontAwesome5 name="sync" size={16} color="#3C5BFF" />
                </TouchableOpacity>
              </View>

              {users.length > 0 ? (
                users.map((user) => (
                  <React.Fragment key={user._id}>
                    {renderUser({ item: user })}
                  </React.Fragment>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="users-slash" size={50} color="#DDD" />
                  <Text style={styles.emptyStateText}>
                    Foydalanuvchilar topilmadi
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#3C5BFF",
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
    color: "#FFF",
  },
  statsOverview: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  refreshButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statBoxLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginRight: 40,
  },
  statIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  usersSection: {
    padding: 20,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  adminBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  adminBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  userCreated: {
    fontSize: 12,
    color: "#999",
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default AdminPanelScreen;
