import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Word = {
  id: string;
  english: string;
  uzbek: string;
};

type Lesson = {
  id: string;
  name: string;
  words: Word[];
};

type Props = {
  setScreen: (screen: string) => void;
  onStartGame?: (lesson: Lesson) => void;
};

const LessonsScreen: React.FC<Props> = ({ setScreen, onStartGame }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  let [fontsLoaded] = useFonts({ Lexend_400Regular });

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const savedLessons = await AsyncStorage.getItem("lessons");
      if (savedLessons) {
        setLessons(JSON.parse(savedLessons));
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
    }
  };

  const handleStartGame = (lesson: Lesson) => {
    if (onStartGame) {
      onStartGame(lesson);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("Home")}
          >
            <FontAwesome5 name="chevron-left" size={18} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Darslarim</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setScreen("CreateLesson")}
          >
            <FontAwesome5 name="plus" size={15} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Panel */}
        <View style={styles.statsPanel}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{lessons.length}</Text>
            <Text style={styles.statLabel}>Darslar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {lessons.reduce((sum, lesson) => sum + lesson.words.length, 0)}
            </Text>
            <Text style={styles.statLabel}>So'zlar</Text>
          </View>
        </View>
      </View>

      {/* Lessons List */}
      <ScrollView
        style={styles.lessonsList}
        contentContainerStyle={styles.lessonsListContent}
      >
        {lessons.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="book" size={40} color="#3C5BFF" />
            <Text style={styles.emptyStateText}>
              Hozircha darslar yo'q.{"\n"}Yangi dars qo'shish uchun yuqoridagi
              tugmani bosing
            </Text>
          </View>
        ) : (
          lessons.map((lesson) => (
            <TouchableOpacity key={lesson.id} style={styles.lessonCard}>
              <View style={styles.lessonHeader}>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonName}>{lesson.name}</Text>
                  <Text style={styles.wordsCount}>
                    {lesson.words.length} ta so'z
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartGame(lesson)}
                >
                  <FontAwesome5
                    name="play"
                    size={13}
                    color="white"
                    style={styles.playIcon}
                  />
                  <Text style={styles.startButtonText}>Boshlash</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "30%" }]} />
                </View>
                <Text style={styles.progressText}>30% tugallangan</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    backgroundColor: "#3C5BFF",
    paddingTop: STATUSBAR_HEIGHT,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#3C5BFF",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontFamily: "Lexend_400Regular",
    textAlign: "center",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsPanel: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "center",
  },
  statNumber: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    marginBottom: 2,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    fontFamily: "Lexend_400Regular",
  },
  lessonsList: {
    flex: 1,
  },
  lessonsListContent: {
    padding: 16,
    paddingBottom: 90,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
    lineHeight: 18,
  },
  lessonCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(60, 91, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonName: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Lexend_400Regular",
    marginBottom: 3,
  },
  wordsCount: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  startButton: {
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  playIcon: {
    marginRight: 4,
  },
  startButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Lexend_400Regular",
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(60, 91, 255, 0.08)",
    borderRadius: 1.5,
    marginBottom: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3C5BFF",
    borderRadius: 1.5,
  },
  progressText: {
    fontSize: 11,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(60, 91, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeNavItem: {
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3C5BFF",
  },
  navText: {
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 4,
    fontFamily: "Lexend_400Regular",
  },
  activeNavText: {
    fontSize: 12,
    color: "#3C5BFF",
    marginTop: 4,
    fontFamily: "Lexend_400Regular",
  },
});

export default LessonsScreen;
