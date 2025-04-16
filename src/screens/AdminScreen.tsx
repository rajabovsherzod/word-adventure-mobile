import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getAllUsers, deleteUser, getUserProgress } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  coins: number;
  level: string;
  createdAt?: string;
}

interface Progress {
  lessonId: string;
  completedPercentage: number;
}

const AdminScreen = ({ setScreen }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<Progress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalLessonsCompleted: 0,
    totalCoins: 0,
    adminUsers: 0,
    averageLevel: 0,
  });

  useEffect(() => {
    checkAdmin();
    loadUsers();
  }, []);

  const checkAdmin = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (!user.isAdmin) {
          Alert.alert("Xato", "Sizda admin huquqlari yo'q");
          setScreen("Home");
        }
      } else {
        Alert.alert("Xato", "Avval tizimga kiring");
        setScreen("Auth");
      }
    } catch (error) {
      console.error("Admin tekshirishda xato:", error);
      setScreen("Auth");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();

      // Check response format
      let usersData = [];
      if (Array.isArray(response)) {
        usersData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        usersData = response.data;
      }

      setUsers(usersData);

      // Calculate stats
      calculateStatistics(usersData);

      setError("");
    } catch (err) {
      console.error("Foydalanuvchilarni yuklashda xato:", err);
      setError("Foydalanuvchilar ma'lumotlarini yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (userData: User[]) => {
    // Umumiy foydalanuvchilar soni
    const totalUsers = userData.length;
    
    // Faol foydalanuvchilar (kamida 1 ta dars yakunlagan)
    const activeUsers = userData.filter(user => user.level !== "Beginner").length;
    
    // Barcha tugatilgan darslar soni
    const totalLessonsCompleted = userData.reduce((total, user) => 
      total + (user.level !== "Beginner" ? 1 : 0), 0);
    
    // Barcha foydalanuvchilar tangalari
    const totalCoins = userData.reduce((total, user) => total + user.coins, 0);
    
    // Admin foydalanuvchilar soni
    const adminUsers = userData.filter(user => user.isAdmin).length;
    
    // O'rtacha daraja
    const averageLevel = totalUsers > 0 
      ? parseFloat((userData.reduce((total, user) => total + parseFloat(user.level), 0) / totalUsers).toFixed(1))
      : 0;
    
    setStatistics({
      totalUsers,
      activeUsers,
      totalLessonsCompleted,
      totalCoins,
      adminUsers,
      averageLevel
    });
  };

  const loadUserProgress = async (userId: string) => {
    try {
      setProgressLoading(true);
      const response = await getUserProgress();

      // Find progress for this user
      let progressData = [];
      if (response && Array.isArray(response)) {
        progressData = response.filter((p) => p.userId === userId);
      } else if (response && response.data && Array.isArray(response.data)) {
        progressData = response.data.filter((p) => p.userId === userId);
      }

      setUserProgress(progressData);
    } catch (err) {
      console.error("Progress ma'lumotlarni yuklashda xato:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      "Foydalanuvchini o'chirish",
      "Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?",
      [
        { text: "Bekor qilish", style: "cancel" },
        {
          text: "O'chirish",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(userId);
              Alert.alert("Muvaffaqiyatli", "Foydalanuvchi o'chirildi");
              loadUsers();
              if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(null);
              }
            } catch (err) {
              console.error("Foydalanuvchini o'chirishda xato:", err);
              Alert.alert("Xato", "Foydalanuvchini o'chirib bo'lmadi");
            }
          },
        },
      ]
    );
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    loadUserProgress(user._id);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUser &&
          selectedUser._id === item._id &&
          styles.selectedUserItem,
      ]}
      onPress={() => handleUserSelect(item)}
    >
      <View style={styles.userHeader}>
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.userActions}>
          {!item.isAdmin && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteUser(item._id)}
            >
              <FontAwesome5 name="trash" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.userDetailItem}>
          <FontAwesome5 name="coins" size={14} color="#FFD700" />
          <Text style={styles.userDetailText}>{item.coins || 0}</Text>
        </View>
        <View style={styles.userDetailItem}>
          <FontAwesome5 name="graduation-cap" size={14} color="#3C5BFF" />
          <Text style={styles.userDetailText}>{item.level || "Beginner"}</Text>
        </View>
        {item.createdAt && (
          <View style={styles.userDetailItem}>
            <FontAwesome5 name="calendar" size={14} color="#666" />
            <Text style={styles.userDetailText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        {item.isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderUserDetails = () => {
    if (!selectedUser) {
      return (
        <View style={styles.noUserSelected}>
          <Text style={styles.noUserSelectedText}>Foydalanuvchini tanlang</Text>
        </View>
      );
    }

    return (
      <View style={styles.userDetailsContainer}>
        <Text style={styles.detailsTitle}>Foydalanuvchi ma'lumotlari</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>ID:</Text>
          <Text style={styles.detailsValue}>{selectedUser._id}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Ism:</Text>
          <Text style={styles.detailsValue}>{selectedUser.name}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Email:</Text>
          <Text style={styles.detailsValue}>{selectedUser.email}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Daraja:</Text>
          <Text style={styles.detailsValue}>
            {selectedUser.level || "Beginner"}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Tangalar:</Text>
          <Text style={styles.detailsValue}>{selectedUser.coins || 0}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Admin:</Text>
          <Text style={styles.detailsValue}>
            {selectedUser.isAdmin ? "Ha" : "Yo'q"}
          </Text>
        </View>

        <Text style={styles.progressTitle}>Darslar progressi</Text>
        {progressLoading ? (
          <ActivityIndicator size="small" color="#3C5BFF" />
        ) : userProgress.length === 0 ? (
          <Text style={styles.noProgressText}>Progress topilmadi</Text>
        ) : (
          <FlatList
            data={userProgress}
            keyExtractor={(item, index) => item.lessonId || index.toString()}
            renderItem={({ item }) => (
              <View style={styles.progressItem}>
                <Text style={styles.progressLesson}>Dars: {item.lessonId}</Text>
                <Text style={styles.progressPercentage}>
                  {item.completedPercentage || 0}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.completedPercentage || 0}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    );
  };

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <Text style={styles.dashboardTitle}>Statistika</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.totalUsers}</Text>
          <Text style={styles.statLabel}>Jami foydalanuvchilar</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.activeUsers}</Text>
          <Text style={styles.statLabel}>Faol foydalanuvchilar</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.totalLessonsCompleted}</Text>
          <Text style={styles.statLabel}>Tugallangan darslar</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.totalCoins}</Text>
          <Text style={styles.statLabel}>Jami tangalar</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.adminUsers}</Text>
          <Text style={styles.statLabel}>Admin foydalanuvchilar</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.averageLevel}</Text>
          <Text style={styles.statLabel}>O'rtacha daraja</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={loadUsers}>
        <FontAwesome5 name="sync" size={16} color="#FFF" />
        <Text style={styles.refreshButtonText}>Yangilash</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3C5BFF" />
        <Text style={styles.loadingText}>Ma'lumotlar yuklanmoqda...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome5 name="exclamation-circle" size={50} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
          <Text style={styles.retryButtonText}>Qayta urinish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin panel</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("Home")}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#3C5BFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <FontAwesome5
            name="users"
            size={16}
            color={activeTab === "users" ? "#3C5BFF" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "users" && styles.activeTabText,
            ]}
          >
            Foydalanuvchilar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <FontAwesome5
            name="chart-bar"
            size={16}
            color={activeTab === "dashboard" ? "#3C5BFF" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "dashboard" && styles.activeTabText,
            ]}
          >
            Statistika
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "users" ? (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <FontAwesome5
              name="search"
              size={16}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Foydalanuvchini qidirish..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <FontAwesome5 name="times" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.usersContainer}>
            <View style={styles.usersList}>
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item._id}
                renderItem={renderUserItem}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    Foydalanuvchilar topilmadi
                  </Text>
                }
              />
            </View>

            <View style={styles.userDetailsPanel}>{renderUserDetails()}</View>
          </View>
        </View>
      ) : (
        renderDashboard()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9FF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9FF",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3C5BFF",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#3C5BFF",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E9FF",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 8,
  },
  usersContainer: {
    flex: 1,
    flexDirection: "row",
  },
  usersList: {
    flex: 1,
    marginRight: 16,
  },
  userItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E9FF",
  },
  selectedUserItem: {
    borderColor: "#3C5BFF",
    backgroundColor: "#F0F3FF",
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  userActions: {
    flexDirection: "row",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },
  userDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },
  userDetailText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  adminBadge: {
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  adminBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  userDetailsPanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E9FF",
  },
  userDetailsContainer: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailsLabel: {
    width: 80,
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  detailsValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 12,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressLesson: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  progressPercentage: {
    fontSize: 12,
    color: "#666",
    marginVertical: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F0F3FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  noUserSelected: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noUserSelectedText: {
    color: "#999",
    fontSize: 16,
  },
  noProgressText: {
    color: "#999",
    fontSize: 14,
    fontStyle: "italic",
  },
  dashboardContainer: {
    flex: 1,
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E9FF",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C5BFF",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: "#3C5BFF",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3C5BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyListText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
});

export default AdminScreen;
