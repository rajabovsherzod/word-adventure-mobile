import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Import screens
import LessonsScreen from "./src/screens/LessonsScreen";
import CreateLessonScreen from "./src/screens/CreateLessonScreen";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LessonGameScreen from "./src/screens/LessonGameScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import DictionaryScreen from "./src/screens/DictionaryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AdminPanelScreen from "./src/screens/AdminPanelScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import SuggestedLessonsScreen from "./src/screens/SuggestedLessonsScreen";
import CoursesScreen from "./src/screens/courses/CoursesScreen";
import CourseDetailsScreen from "./src/screens/courses/CourseDetailsScreen";
import LessonContentScreen from "./src/screens/LessonContentScreen";

import { Word, getWordById, getWordsByCardAndLesson } from "./src/data/words";
import { checkAuth, logout } from "./src/services/api";
import { GrammarCourse } from "./src/models/CourseTypes";

type Lesson = {
  id: string;
  name: string;
  words: {
    id: string;
    english: string;
    uzbek: string;
  }[];
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "login" | "signup" | "lesson";
  timestamp: Date;
  read: boolean;
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<string>("Home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [coins, setCoins] = useState<number>(100);
  const [selectedDictionaryWord, setSelectedDictionaryWord] =
    useState<Word | null>(null);
  const [selectedCardTitle, setSelectedCardTitle] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<GrammarCourse | null>(
    null
  );

  // Har bir level uchun currentLesson qiymati - bu darslar progressini saqlash uchun
  // Keylar level nomlari, qiymatlar esa shu level uchun ochilgan eng katta dars raqami
  const [levelProgress, setLevelProgress] = useState<{ [key: string]: number }>(
    {
      Beginner: 1,
      Elementary: 1,
      "Pre-Intermediate": 1,
      Intermediate: 1,
      "Upper-Intermediate": 1,
      Advanced: 1,
    }
  );

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  const addLoginNotification = () => {
    const loginNotification: Notification = {
      id: Date.now().toString(),
      title: "Xush kelibsiz!",
      message: "Tizimga muvaffaqiyatli kirdingiz. O'rganishni davom eting!",
      type: "login",
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [loginNotification, ...prev]);
  };

  const renderScreen = () => {
    console.log("--- RENDER SCREEN ---");
    console.log(
      "Admin state:",
      isAdmin === true ? "TRUE ADMIN" : "NOT ADMIN",
      typeof isAdmin
    );
    console.log("Current screen:", currentScreen);

    // Auth bo'lmagan holatda login/signup ekranlari
    if (!isAuthenticated) {
      if (currentScreen === "SignUp") {
        return (
          <SignUpScreen
            setIsAuthenticated={(value) => {
              setIsAuthenticated(value);
              if (value) addLoginNotification();
            }}
            setScreen={setCurrentScreen}
            onLogin={() => setCurrentScreen("Auth")}
          />
        );
      }
      return (
        <AuthScreen
          setIsAuthenticated={(value) => {
            setIsAuthenticated(value);
            if (value) addLoginNotification();
          }}
          setScreen={setCurrentScreen}
          onSignUp={() => setCurrentScreen("SignUp")}
          setIsAdmin={setIsAdmin}
        />
      );
    }

    // HARD OVERRIDE: Admin foydalanuvchi uchun FAQAT admin ekranlarini ko'rsatish
    if (isAdmin === true) {
      console.log("ADMIN USER - Only showing admin screens");
      // Admin faqat Profile ko'rishi mumkin, boshqa barcha holatlarda AdminPanel
      if (currentScreen === "Profile") {
        return (
          <ProfileScreen
            setScreen={setCurrentScreen}
            setIsAuthenticated={setIsAuthenticated}
            isAdmin={true}
            handleLogout={handleLogout}
          />
        );
      }
      // Barcha boshqa holatlarda AdminPanel ko'rsatiladi
      return <AdminPanelScreen setScreen={setCurrentScreen} />;
    }

    // Regular user ekranlari
    console.log("REGULAR USER - Showing user interface");
    switch (currentScreen) {
      case "Home":
        return (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={setCurrentScreen}
            onWordSelect={handleWordSelect}
            unreadNotificationsCount={
              notifications.filter((n) => !n.read).length
            }
            onCardSelect={handleCardSelect}
          />
        );
      case "MyLessons":
        return (
          <LessonsScreen
            setScreen={setCurrentScreen}
            onStartGame={handleStartGame}
          />
        );
      case "Courses":
        return (
          <CoursesScreen
            setScreen={setCurrentScreen}
            setSelectedCourse={setSelectedCourse}
            coins={coins}
            setCoins={setCoins}
          />
        );
      case "CourseDetails":
        return selectedCourse ? (
          <CourseDetailsScreen
            setScreen={setCurrentScreen}
            selectedCourse={selectedCourse}
            coins={coins}
            setCoins={setCoins}
          />
        ) : (
          <CoursesScreen
            setScreen={setCurrentScreen}
            setSelectedCourse={setSelectedCourse}
            coins={coins}
            setCoins={setCoins}
          />
        );
      case "CreateLesson":
        return <CreateLessonScreen setScreen={setCurrentScreen} />;
      case "Dictionary":
        return (
          <DictionaryScreen
            setScreen={setCurrentScreen}
            selectedWord={selectedDictionaryWord}
            onWordSelect={handleWordSelect}
          />
        );
      case "Profile":
        return (
          <ProfileScreen
            setScreen={setCurrentScreen}
            setIsAuthenticated={setIsAuthenticated}
            isAdmin={isAdmin}
            handleLogout={handleLogout}
          />
        );
      case "Game":
        return currentLesson ? (
          <LessonGameScreen
            setScreen={setCurrentScreen}
            lesson={currentLesson}
          />
        ) : (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={setCurrentScreen}
            onWordSelect={handleWordSelect}
            unreadNotificationsCount={
              notifications.filter((n) => !n.read).length
            }
            onCardSelect={handleCardSelect}
          />
        );
      case "Notifications":
        return (
          <NotificationsScreen
            setScreen={setCurrentScreen}
            notifications={notifications}
            markNotificationAsRead={markNotificationAsRead}
          />
        );
      case "SuggestedLessons":
        return (
          <SuggestedLessonsScreen
            setScreen={setCurrentScreen}
            cardId={selectedCardId}
            cardTitle={selectedCardTitle}
            onStartLesson={handleStartLesson}
            coins={coins}
            currentLesson={levelProgress[selectedCardTitle] || 1}
            onLessonComplete={unlockNextLesson}
          />
        );
      case "LessonContent":
        return <LessonContentScreen setScreen={setCurrentScreen} />;
      default:
        return (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={setCurrentScreen}
            onWordSelect={handleWordSelect}
            unreadNotificationsCount={
              notifications.filter((n) => !n.read).length
            }
            onCardSelect={handleCardSelect}
          />
        );
    }
  };

  const shouldShowBottomNav = () => {
    if (!isAuthenticated) return false;

    if (isAdmin) return false;

    return currentScreen !== "Game";
  };

  // Logout funksiyasini to'g'rilash - to'liq barcha state larni tozalash
  const handleLogout = useCallback(async () => {
    console.log("COMPLETE LOGOUT - Clearing all state values");
    setIsLoading(true);

    try {
      await logout();

      // To'liq tozalash
      setCurrentScreen("Auth");
      setCurrentLesson(null);
      setSelectedWord(null);
      setNotifications([]);
      setSelectedCardId(1);
      setSelectedLessonId(1);
      setSelectedDictionaryWord(null);
      setSelectedCardTitle("");
      setSelectedCourse(null);

      // Eng oxirida auth state o'zgartirish
      setIsAdmin(false);
      setIsAuthenticated(false);

      console.log("Logout complete");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Xatolik", "Tizimdan chiqishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login jarayonida ham state-larni to'g'ri o'rnatish
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking authentication status...");
        setIsLoading(true);

        // Avval barcha state larni tozalash
        setCurrentScreen("Auth");
        setCurrentLesson(null);
        setSelectedWord(null);
        setNotifications([]);
        setSelectedCardId(1);
        setSelectedLessonId(1);
        setSelectedDictionaryWord(null);
        setSelectedCardTitle("");
        setSelectedCourse(null);
        setIsAdmin(false);
        setIsAuthenticated(false);

        const authData = await checkAuth();
        console.log(
          "Auth data:",
          authData ? JSON.stringify(authData) : "No auth data"
        );

        if (authData && authData.user) {
          // User ma'lumotlarini sozlash
          const isUserAdmin = authData.user.isAdmin === true;
          console.log(
            "User is admin:",
            isUserAdmin,
            typeof authData.user.isAdmin
          );

          // Auth state larni o'rnatish
          setIsAuthenticated(true);
          setIsAdmin(isUserAdmin);

          // Admin uchun AdminPanel, oddiy foydalanuvchi uchun Home ekranini ko'rsatish
          const targetScreen = isUserAdmin ? "AdminPanel" : "Home";
          console.log(`Setting screen to ${targetScreen}`);
          setCurrentScreen(targetScreen);

          addLoginNotification();
        } else {
          console.log("Not authenticated, showing Auth screen");
          setCurrentScreen("Auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setCurrentScreen("Auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleStartGame = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentScreen("Game");
  }, []);

  const handleWordSelect = (word: Word) => {
    const fullWord = getWordById(word.id);
    setSelectedDictionaryWord(fullWord);
  };

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const handleCardSelect = (cardId: number, level: string) => {
    setSelectedCardId(cardId);
    setSelectedCardTitle(level);
    setCurrentScreen("SuggestedLessons");
  };

  // Progress 100% bo'lganda, keyingi darsni ochish funksiyasi
  const unlockNextLesson = useCallback(
    (level: string, lessonId: number) => {
      console.log(
        `Unlocking next lesson for level ${level}, current lesson: ${lessonId}`
      );

      // Agar hozirgi dars ochilgan eng katta dars bo'lsa, keyingi darsni ochish
      if (levelProgress[level] === lessonId) {
        setLevelProgress((prev) => ({
          ...prev,
          [level]: lessonId + 1,
        }));

        // Coins qo'shish
        addCoins(10);

        // Notification qo'shish
        const newLessonNotification: Notification = {
          id: Date.now().toString(),
          title: "Yangi dars ochildi!",
          message: `${level} darajasida ${
            lessonId + 1
          }-dars uchun ruxsat berildi. +10 tanga qo'shildi!`,
          type: "lesson",
          timestamp: new Date(),
          read: false,
        };

        setNotifications((prev) => [newLessonNotification, ...prev]);
      }
    },
    [levelProgress, addCoins]
  );

  const handleStartLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    // Get words for this lesson from words.ts
    const lessonWords = getWordsByCardAndLesson(selectedCardId, lessonId);
    setCurrentLesson({
      id: `${selectedCardId}-${lessonId}`,
      name: `${selectedCardTitle} - Dars ${lessonId}`,
      words: lessonWords,
    });
    setCurrentScreen("Game");
  };

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3C5BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3C5BFF" barStyle="light-content" />
      <View style={styles.content}>{renderScreen()}</View>
      {shouldShowBottomNav() && (
        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen("Home")}
          >
            <FontAwesome5
              name="home"
              size={24}
              color={currentScreen === "Home" ? "#3C5BFF" : "#9E9E9E"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Home" && styles.activeNavText,
              ]}
            >
              Asosiy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen("MyLessons")}
          >
            <FontAwesome5
              name="book"
              size={24}
              color={currentScreen === "MyLessons" ? "#3C5BFF" : "#9E9E9E"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "MyLessons" && styles.activeNavText,
              ]}
            >
              Darslarim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen("Courses")}
          >
            <FontAwesome5
              name="graduation-cap"
              size={24}
              color={currentScreen === "Courses" ? "#3C5BFF" : "#9E9E9E"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Courses" && styles.activeNavText,
              ]}
            >
              Kurslar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen("Dictionary")}
          >
            <FontAwesome5
              name="book-open"
              size={24}
              color={currentScreen === "Dictionary" ? "#3C5BFF" : "#9E9E9E"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Dictionary" && styles.activeNavText,
              ]}
            >
              Lug'at
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen("Profile")}
          >
            <FontAwesome5
              name="user"
              size={24}
              color={currentScreen === "Profile" ? "#3C5BFF" : "#9E9E9E"}
            />
            <Text
              style={[
                styles.navText,
                currentScreen === "Profile" && styles.activeNavText,
              ]}
            >
              Profil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    fontFamily: "Lexend_400Regular",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  navText: {
    fontSize: 12,
    color: "#9E9E9E",
    fontFamily: "Lexend_400Regular",
  },
  activeNavText: {
    color: "#3C5BFF",
  },
});

export default App;
