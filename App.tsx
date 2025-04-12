import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
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

import { Word, getWordById, getWordsByCardAndLesson } from "./src/data/words";
import { checkAuth } from "./src/services/api";

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
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [coins, setCoins] = useState<number>(100);
  const [selectedDictionaryWord, setSelectedDictionaryWord] =
    useState<Word | null>(null);
  const [selectedCardTitle, setSelectedCardTitle] = useState<string>("");

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

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authData = await checkAuth();
        if (authData && authData.user) {
          setIsAuthenticated(true);
          setIsAdmin(authData.user.isAdmin || false);
          addLoginNotification();
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
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

  const renderScreen = () => {
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
        />
      );
    }

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
      case "AdminPanel":
        return isAdmin ? (
          <AdminPanelScreen setScreen={setCurrentScreen} />
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
          />
        );
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
    return (
      isAuthenticated && currentScreen !== "Auth" && currentScreen !== "SignUp"
    );
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
