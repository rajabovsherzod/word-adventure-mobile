import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  AppState,
  Animated,
  Easing,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";
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
import { Word } from "./src/data/words";
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
  const timeoutRef = useRef<NodeJS.Timeout>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authData = await checkAuth();
        if (authData && authData.user) {
          setIsAuthenticated(true);
          setIsAdmin(authData.user.isAdmin || false);

          // Add login notification
          const loginNotification: Notification = {
            id: Date.now().toString(),
            title: "Xush kelibsiz!",
            message:
              "Tizimga muvaffaqiyatli kirdingiz. O'rganishni davom eting!",
            type: "login",
            timestamp: new Date(),
            read: false,
          };

          setNotifications((prevNotifications) => [
            loginNotification,
            ...prevNotifications,
          ]);
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

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleScreenChange = useCallback(
    (screen: string) => {
      if (currentScreen === screen) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsLoading(true);
      fadeAnim.setValue(0);
      spinAnim.setValue(0);
      scaleAnim.setValue(0.3);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start(() => {
        Animated.loop(
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();

        setTimeout(() => {
          setCurrentScreen(screen);

          requestAnimationFrame(() => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.in(Easing.cubic),
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.3,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.in(Easing.cubic),
              }),
            ]).start(() => {
              setIsLoading(false);
            });
          });
        }, 100);
      });
    },
    [currentScreen, fadeAnim, spinAnim, scaleAnim]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsLoading(false);
        fadeAnim.setValue(0);
        spinAnim.setValue(0);
        scaleAnim.setValue(0.3);
      }
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.remove();
    };
  }, [fadeAnim, spinAnim, scaleAnim]);

  const handleStartGame = useCallback(
    (lesson: Lesson) => {
      setCurrentLesson(lesson);
      handleScreenChange("Game");
    },
    [handleScreenChange]
  );

  const handleSignUp = useCallback(() => {
    handleScreenChange("SignUp");
  }, [handleScreenChange]);

  const handleWordSelect = useCallback(
    (word: Word) => {
      setSelectedWord(word);
      handleScreenChange("Dictionary");
    },
    [handleScreenChange]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <StatusBar
          backgroundColor="#3C5BFF"
          barStyle="light-content"
          translucent={true}
        />
        <Animated.View
          style={[
            styles.loader,
            {
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <View style={styles.spinnerOuter}>
            <View style={styles.spinnerInner}>
              <View style={styles.centerDot} />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  const renderScreen = () => {
    if (!isAuthenticated) {
      if (currentScreen === "SignUp") {
        return (
          <SignUpScreen
            onLogin={() => handleScreenChange("Auth")}
            setIsAuthenticated={setIsAuthenticated}
            setScreen={handleScreenChange}
          />
        );
      }
      return (
        <AuthScreen
          onSignUp={() => handleScreenChange("SignUp")}
          setIsAuthenticated={setIsAuthenticated}
          setScreen={handleScreenChange}
        />
      );
    }

    switch (currentScreen) {
      case "Home":
        return (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={handleScreenChange}
            onWordSelect={handleWordSelect}
            unreadNotificationsCount={
              notifications.filter((n) => !n.read).length
            }
          />
        );
      case "Lessons":
        return (
          <LessonsScreen
            setScreen={handleScreenChange}
            onStartGame={handleStartGame}
          />
        );
      case "CreateLesson":
        return <CreateLessonScreen setScreen={handleScreenChange} />;
      case "Dictionary":
        return (
          <DictionaryScreen
            setScreen={handleScreenChange}
            selectedWord={selectedWord}
            onWordSelect={handleWordSelect}
          />
        );
      case "Profile":
        return (
          <ProfileScreen
            setScreen={handleScreenChange}
            setIsAuthenticated={setIsAuthenticated}
            isAdmin={isAdmin}
          />
        );
      case "Game":
        return currentLesson ? (
          <LessonGameScreen
            setScreen={handleScreenChange}
            lesson={currentLesson}
          />
        ) : (
          <LessonsScreen
            setScreen={handleScreenChange}
            onStartGame={handleStartGame}
          />
        );
      case "AdminPanel":
        return isAdmin ? (
          <AdminPanelScreen setScreen={handleScreenChange} />
        ) : (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={handleScreenChange}
            onWordSelect={handleWordSelect}
            unreadNotificationsCount={
              notifications.filter((n) => !n.read).length
            }
          />
        );
      case "Notifications":
        return (
          <NotificationsScreen
            setScreen={handleScreenChange}
            notifications={notifications}
            markNotificationAsRead={markNotificationAsRead}
          />
        );
      default:
        return (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={handleScreenChange}
            onWordSelect={handleWordSelect}
            unreadNotificationsCount={
              notifications.filter((n) => !n.read).length
            }
          />
        );
    }
  };

  const renderBottomNavigation = () => {
    if (!isAuthenticated) return null;

    return (
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleScreenChange("Home")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5
              name="home"
              size={22}
              color={currentScreen === "Home" ? "#3C5BFF" : "#9E9E9E"}
            />
            {currentScreen === "Home" && (
              <View style={styles.activeIndicator} />
            )}
          </View>
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
          onPress={() => handleScreenChange("Lessons")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5
              name="book-reader"
              size={22}
              color={currentScreen === "Lessons" ? "#3C5BFF" : "#9E9E9E"}
            />
            {currentScreen === "Lessons" && (
              <View style={styles.activeIndicator} />
            )}
          </View>
          <Text
            style={[
              styles.navText,
              currentScreen === "Lessons" && styles.activeNavText,
            ]}
          >
            Darslarim
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <FontAwesome5 name="graduation-cap" size={22} color="#9E9E9E" />
          </View>
          <Text style={styles.navText}>Kurslar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleScreenChange("Dictionary")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5
              name="book"
              size={22}
              color={currentScreen === "Dictionary" ? "#3C5BFF" : "#9E9E9E"}
            />
            {currentScreen === "Dictionary" && (
              <View style={styles.activeIndicator} />
            )}
          </View>
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
          onPress={() => handleScreenChange("Profile")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5
              name="user"
              size={22}
              color={currentScreen === "Profile" ? "#3C5BFF" : "#9E9E9E"}
            />
            {currentScreen === "Profile" && (
              <View style={styles.activeIndicator} />
            )}
          </View>
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
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      {renderScreen()}
      {renderBottomNavigation()}
      {isLoading && (
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.loader,
              {
                transform: [{ scale: scaleAnim }, { rotate: spin }],
              },
            ]}
          >
            <View style={styles.spinnerOuter}>
              <View style={styles.spinnerInner}>
                <View style={styles.centerDot} />
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 999,
    zIndex: 999999,
  },
  loader: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerOuter: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
    borderWidth: 6,
    borderColor: "#3C5BFF",
    borderTopColor: "#3C5BFF",
    borderRightColor: "#3C5BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerInner: {
    width: "70%",
    height: "70%",
    borderRadius: 52.5,
    borderWidth: 6,
    borderColor: "#3C5BFF",
    borderTopColor: "#3C5BFF",
    borderRightColor: "#3C5BFF",
    position: "relative",
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3C5BFF",
    position: "absolute",
    top: -13,
    left: "50%",
    marginLeft: -10,
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingBottom: 20,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  navText: {
    fontSize: 11,
    color: "#9E9E9E",
    marginTop: 4,
    fontFamily: "Lexend_400Regular",
  },
  activeNavText: {
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#3C5BFF",
  },
});

export default App;
