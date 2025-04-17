import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { GrammarCourse } from "../../models/CourseTypes";
import coursesService from "../../services/coursesService";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Props = {
  setScreen: (screen: string) => void;
  setSelectedCourse?: (course: GrammarCourse) => void;
  coins: number;
  setCoins?: (coins: number) => void;
};

const CoursesScreen: React.FC<Props> = ({
  setScreen,
  setSelectedCourse,
  coins,
  setCoins,
}) => {
  const [courses, setCourses] = useState<GrammarCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<GrammarCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(coins);

  // Kurslarni yuklash
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const allCourses = await coursesService.getAllCourses();
      const availableLevels = await coursesService.getAvailableLevels();

      setCourses(allCourses);
      setFilteredCourses(allCourses);
      setLevels(availableLevels);

      // Default bo'lib birinchi levelni tanlash
      if (availableLevels.length > 0 && !selectedLevel) {
        setSelectedLevel(availableLevels[0]);
        setFilteredCourses(
          allCourses.filter((course) => course.level === availableLevels[0])
        );
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedLevel]);

  // Level bo'yicha filtrlash
  const filterCoursesByLevel = (level: string) => {
    setSelectedLevel(level);
    setFilteredCourses(courses.filter((course) => course.level === level));
  };

  // Kursni tanlash
  const handleSelectCourse = (course: GrammarCourse) => {
    if (setSelectedCourse) {
      setSelectedCourse(course);
    }
    // Kurs detallari sahifasiga o'tish
    setScreen("CourseDetails");
  };

  // Kurs sotib olish
  const handlePurchaseCourse = async (course: GrammarCourse) => {
    try {
      if (userCoins < course.price) {
        alert("Yetarli tangalar mavjud emas!");
        return;
      }

      const success = await coursesService.purchaseCourse(course.id, userCoins);
      if (success) {
        // Foydalanuvchi balansini yangilash
        const newCoins = userCoins - course.price;
        setUserCoins(newCoins);

        if (setCoins) {
          setCoins(newCoins);
        }

        await AsyncStorage.setItem("coins", newCoins.toString());

        // Kurslarni yangilash
        loadCourses();

        alert(`"${course.title}" kursi muvaffaqiyatli sotib olindi!`);
      }
    } catch (error) {
      console.error("Error purchasing course:", error);
      alert("Kursni sotib olishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Kursni ko'rsatish uchun kartani yasash
  const renderCourseItem = ({ item }: { item: GrammarCourse }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleSelectCourse(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.courseImage} />

      <View style={styles.courseDetails}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.courseStats}>
          <View style={styles.statItem}>
            <FontAwesome5 name="clock" size={12} color="#666" />
            <Text style={styles.statText}>{item.duration} soat</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome5 name="star" size={12} color="#FFD700" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>

          {item.purchased ? (
            <View style={styles.progressWrapper}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${item.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => handlePurchaseCourse(item)}
            >
              <FontAwesome5 name="coins" size={12} color="#FFD700" />
              <Text style={styles.priceText}>{item.price}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {item.purchased && (
        <View style={styles.purchasedBadge}>
          <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Level tanlovchi
  const renderLevelSelector = () => (
    <View style={styles.levelSelector}>
      <FlatList
        horizontal
        data={levels}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.levelItem,
              selectedLevel === item && styles.selectedLevelItem,
            ]}
            onPress={() => filterCoursesByLevel(item)}
          >
            <Text
              style={[
                styles.levelItemText,
                selectedLevel === item && styles.selectedLevelItemText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

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
          <Text style={styles.headerTitle}>Grammatika Kurslari</Text>
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="coins" size={16} color="#FFD700" />
            <Text style={styles.coinsText}>{userCoins}</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3C5BFF" />
          <Text style={styles.loadingText}>Kurslar yuklanmoqda...</Text>
        </View>
      ) : (
        <>
          {renderLevelSelector()}

          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id}
            renderItem={renderCourseItem}
            contentContainerStyle={styles.coursesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="book-open" size={48} color="#CCCCCC" />
                <Text style={styles.emptyText}>
                  Ushbu darajada hech qanday kurs topilmadi
                </Text>
              </View>
            }
          />
        </>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Lexend_400Regular",
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinsText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  levelSelector: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  levelItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  selectedLevelItem: {
    backgroundColor: "#3C5BFF",
  },
  levelItemText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  selectedLevelItemText: {
    color: "white",
    fontWeight: "bold",
  },
  coursesList: {
    padding: 16,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseImage: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
  },
  courseDetails: {
    flex: 1,
    padding: 12,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    fontFamily: "Lexend_400Regular",
  },
  levelBadge: {
    backgroundColor: "#E1F5FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    color: "#0288D1",
    fontFamily: "Lexend_400Regular",
  },
  courseDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    fontFamily: "Lexend_400Regular",
  },
  courseStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Lexend_400Regular",
  },
  priceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 12,
    color: "white",
    marginLeft: 4,
    fontWeight: "bold",
    fontFamily: "Lexend_400Regular",
  },
  progressWrapper: {
    flex: 1,
    maxWidth: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Lexend_400Regular",
  },
  purchasedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
});

export default CoursesScreen;
