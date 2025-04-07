import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_600SemiBold,
} from "@expo-google-fonts/lexend";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { logout, getMe } from "../services/api";

type Props = {
  setScreen: (screen: string) => void;
  setIsAuthenticated: (value: boolean) => void;
  isAdmin?: boolean;
};

const ProfileScreen: React.FC<Props> = ({
  setScreen,
  setIsAuthenticated,
  isAdmin,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await getMe();
      setUserData(response.user);
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert(
        "Xatolik",
        "Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Xatolik", "Tizimdan chiqishda xatolik yuz berdi");
    }
  };

  const handleBack = () => {
    setScreen("Home");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3C5BFF" />
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3C5BFF" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shaxsiy kabinet</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/main_background.png")}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.name}</Text>
            <Text style={styles.userEmail}>{userData?.email}</Text>
            <Text style={styles.userId}>ID: {userData?.countId}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.coins || 0}</Text>
            <Text style={styles.statLabel}>Tangalar</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.level || 1}</Text>
            <Text style={styles.statLabel}>Daraja</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {userData?.completedLessons?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Darslar</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sozlamalar</Text>
          <View style={styles.settingItem}>
            <FontAwesome5 name="bell" size={20} color="#3C5BFF" />
            <Text style={styles.settingLabel}>Bildirishnomalar</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#3C5BFF" }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
          <View style={styles.settingItem}>
            <FontAwesome5 name="moon" size={20} color="#3C5BFF" />
            <Text style={styles.settingLabel}>Tungi rejim</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#767577", true: "#3C5BFF" }}
              thumbColor={darkModeEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome5 name="language" size={20} color="#3C5BFF" />
            <Text style={styles.settingLabel}>Til</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => setScreen("AdminPanel")}
          >
            <FontAwesome5 name="user-shield" size={20} color="#fff" />
            <Text style={styles.adminButtonText}>Admin Panel</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yordam</Text>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome5 name="question-circle" size={20} color="#3C5BFF" />
            <Text style={styles.menuItemText}>Qo'llanma</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome5 name="info-circle" size={20} color="#3C5BFF" />
            <Text style={styles.menuItemText}>Dastur haqida</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: "#3C5BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
    height: 120,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    marginBottom: 60,
  },
  profileSection: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#3C5BFF",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: "#999",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#3C5BFF",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  adminButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 15,
  },
});

export default ProfileScreen;
