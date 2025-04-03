import React, { useState } from "react";
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
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_600SemiBold,
} from "@expo-google-fonts/lexend";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

type Props = {
  setScreen: (screen: string) => void;
  setIsAuthenticated: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ setScreen, setIsAuthenticated }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
  });

  const handleBack = () => {
    console.log("Orqaga qaytish");
    setScreen("Home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3C5BFF" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/images/profile_img.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <FontAwesome5 name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Sherzod</Text>
          <Text style={styles.userId}>ID: 1111</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>120</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#3C5BFF" }]}>
                <FontAwesome5 name="user" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#FF9500" }]}>
                <FontAwesome5 name="lock" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#34C759" }]}>
                <FontAwesome5 name="language" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>English</Text>
              <FontAwesome5 name="chevron-right" size={16} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#FF3B30" }]}>
                <FontAwesome5 name="bell" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D1D6", true: "#3C5BFF" }}
              thumbColor="white"
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#5856D6" }]}>
                <FontAwesome5 name="moon" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#D1D1D6", true: "#3C5BFF" }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#007AFF" }]}>
                <FontAwesome5 name="question-circle" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#FF9500" }]}>
                <FontAwesome5 name="star" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>Rate App</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#5856D6" }]}>
                <FontAwesome5 name="info-circle" size={18} color="white" />
              </View>
              <Text style={styles.menuItemText}>About</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
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
  header: {
    backgroundColor: "#3C5BFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lexend_600SemiBold",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3C5BFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  userId: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#eee",
  },
  section: {
    backgroundColor: "white",
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#333",
  },
  menuItemValue: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#999",
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 16,
    marginBottom: 32,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "Lexend_600SemiBold",
    color: "#FF3B30",
    marginLeft: 8,
  },
});

export default ProfileScreen;
