import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  AppState,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import LessonsScreen from "./src/screens/LessonsScreen";
import CreateLessonScreen from "./src/screens/CreateLessonScreen";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LessonGameScreen from "./src/screens/LessonGameScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import DictionaryScreen from "./src/screens/DictionaryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { Word } from "./src/data/words";

type Lesson = {
  id: string;
  name: string;
  words: {
    id: string;
    english: string;
    uzbek: string;
  }[];
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<string>("Home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

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

  const renderScreen = () => {
    if (!isAuthenticated) {
      if (currentScreen === "SignUp") {
        return <SignUpScreen setScreen={handleScreenChange} />;
      }
      return (
        <AuthScreen
          setIsAuthenticated={setIsAuthenticated}
          onSignUp={handleSignUp}
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
      default:
        return (
          <HomeScreen
            setIsAuthenticated={setIsAuthenticated}
            setScreen={handleScreenChange}
            onWordSelect={handleWordSelect}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      {renderScreen()}
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
});

export default App;
