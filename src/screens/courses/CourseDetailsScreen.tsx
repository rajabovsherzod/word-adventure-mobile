import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { GrammarCourse, CourseModule, Lesson } from "../../models/CourseTypes";
import coursesService from "../../services/coursesService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Props = {
  setScreen: (screen: string) => void;
  selectedCourse: GrammarCourse;
  coins: number;
  setCoins?: (coins: number) => void;
};

const CourseDetailsScreen: React.FC<Props> = ({
  setScreen,
  selectedCourse,
  coins,
  setCoins,
}) => {
  const [course, setCourse] = useState<GrammarCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [userCoins] = useState(coins);

  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        setLoading(true);
        // Kurs ma'lumotlarini olish
        const courseDetails = await coursesService.getCourseById(
          selectedCourse.id
        );
        if (courseDetails) {
          setCourse(courseDetails);

          // Birinchi modulni ochiq holda ko'rsatish
          if (courseDetails.modules.length > 0) {
            setExpandedModules([courseDetails.modules[0].id]);
          }
        }
      } catch (error) {
        console.error("Error loading course details:", error);
        Alert.alert(
          "Xatolik",
          "Kurs ma'lumotlarini yuklashda xatolik yuz berdi"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [selectedCourse.id]);

  // Modulni yoyish/yig'ish
  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  // Darsni boshlash
  const startLesson = async (module: CourseModule, lesson: Lesson) => {
    try {
      if (!course || !course.purchased) {
        Alert.alert(
          "Kurs sotib olinmagan",
          "Darslarni ko'rish uchun avval kursni sotib oling"
        );
        return;
      }

      if (lesson.id === "beginner-mod-1-les-1") {
        // Present Simple darsiga o'tish
        // AsyncStorage'ga kerakli ma'lumotlarni saqlash
        await AsyncStorage.setItem(
          "currentLesson",
          JSON.stringify({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleTitle: module.title,
            courseId: course.id,
          })
        );

        // Darsga o'tish
        setScreen("LessonContent");
      } else {
        // Dars tugallangan sifatida belgilash
        await coursesService.updateLessonStatus(
          course.id,
          module.id,
          lesson.id,
          true
        );

        // Yangilangan kursni olish
        const updatedCourse = await coursesService.getCourseById(course.id);
        if (updatedCourse) {
          setCourse(updatedCourse);
        }

        // Foydalanuvchiga ma'lumot berish
        Alert.alert(
          "Dars tugallandi",
          `"${lesson.title}" darsi muvaffaqiyatli yakunlandi.`
        );
      }
    } catch (error) {
      console.error("Error starting lesson:", error);
      Alert.alert("Xatolik", "Darsni boshlashda xatolik yuz berdi");
    }
  };

  // Kursni sotib olish
  const purchaseCourse = async () => {
    try {
      if (!course) return;

      if (userCoins < course.price) {
        Alert.alert(
          "Yetarli tangalar mavjud emas!",
          "Ushbu kursni sotib olish uchun yetarli tangalaringiz yo'q"
        );
        return;
      }

      const success = await coursesService.purchaseCourse(course.id, userCoins);
      if (success) {
        // Foydalanuvchi balansini yangilash
        const newCoins = userCoins - course.price;

        if (setCoins) {
          setCoins(newCoins);
        }

        await AsyncStorage.setItem("coins", newCoins.toString());

        // Kursni yangilash
        const updatedCourse = await coursesService.getCourseById(course.id);
        if (updatedCourse) {
          setCourse(updatedCourse);
        }

        Alert.alert(
          "Muvaffaqiyatli!",
          `"${course.title}" kursi muvaffaqiyatli sotib olindi!`
        );
      }
    } catch (error) {
      console.error("Error purchasing course:", error);
      Alert.alert("Xatolik", "Kursni sotib olishda xatolik yuz berdi");
    }
  };

  if (loading || !course) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3C5BFF" />
        <Text style={styles.loadingText}>Kurs ma'lumotlari yuklanmoqda...</Text>
      </View>
    );
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("Courses")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kurs Tafsilotlari</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Kurs banneri */}
        <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />

        {/* Kurs ma'lumotlari */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>

            <View style={styles.ratingContainer}>
              <FontAwesome5 name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{course.rating}</Text>
            </View>

            <View style={styles.durationContainer}>
              <FontAwesome5 name="clock" size={14} color="#3C5BFF" />
              <Text style={styles.durationText}>{course.duration} soat</Text>
            </View>
          </View>

          <View style={styles.authorContainer}>
            <Image
              source={{
                uri:
                  course.authorAvatar ||
                  "https://randomuser.me/api/portraits/men/1.jpg",
              }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>{course.authorName}</Text>
          </View>

          <Text style={styles.courseDescription}>{course.description}</Text>

          {/* Teglar */}
          <View style={styles.tagsContainer}>
            {course.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Sotib olish yoki progress */}
          {course.purchased ? (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                Kurs progressi: {course.progress}%
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${course.progress}%` },
                  ]}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={purchaseCourse}
            >
              <FontAwesome5 name="coins" size={16} color="#FFD700" />
              <Text style={styles.purchaseButtonText}>
                {course.price} tanga bilan sotib olish
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Modullar va darslar */}
        <View style={styles.modulesContainer}>
          <Text style={styles.sectionTitle}>Kurs tarkibi</Text>

          {course.modules.map((module) => (
            <View key={module.id} style={styles.moduleCard}>
              <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => toggleModule(module.id)}
              >
                <View style={styles.moduleHeaderLeft}>
                  {module.completed ? (
                    <FontAwesome5
                      name="check-circle"
                      size={20}
                      color="#4CAF50"
                    />
                  ) : (
                    <FontAwesome5 name="book" size={20} color="#3C5BFF" />
                  )}
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                </View>

                <FontAwesome5
                  name={
                    expandedModules.includes(module.id)
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={16}
                  color="#666"
                />
              </TouchableOpacity>

              {expandedModules.includes(module.id) && (
                <View style={styles.lessonsContainer}>
                  {module.lessons.map((lesson, index) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={styles.lessonItem}
                      onPress={() => startLesson(module, lesson)}
                      disabled={!course.purchased}
                    >
                      <View style={styles.lessonLeft}>
                        <View
                          style={[
                            styles.lessonNumber,
                            lesson.completed && styles.lessonNumberCompleted,
                          ]}
                        >
                          <Text
                            style={[
                              styles.lessonNumberText,
                              lesson.completed &&
                                styles.lessonNumberTextCompleted,
                            ]}
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <View style={styles.lessonInfo}>
                          <Text style={styles.lessonTitle}>{lesson.title}</Text>
                          <Text style={styles.lessonDescription}>
                            {lesson.description}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.lessonRight}>
                        <Text style={styles.lessonDuration}>
                          {lesson.duration} min
                        </Text>
                        {lesson.completed ? (
                          <FontAwesome5
                            name="check-circle"
                            size={16}
                            color="#4CAF50"
                          />
                        ) : (
                          <FontAwesome5
                            name="play-circle"
                            size={16}
                            color="#3C5BFF"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
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
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    fontFamily: "Lexend_400Regular",
  },
  content: {
    flex: 1,
  },
  courseImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  courseInfo: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Lexend_400Regular",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: "#E1F5FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  levelText: {
    fontSize: 12,
    color: "#0288D1",
    fontFamily: "Lexend_400Regular",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Lexend_400Regular",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Lexend_400Regular",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  courseDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: "Lexend_400Regular",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "Lexend_400Regular",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  purchaseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3C5BFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
    fontFamily: "Lexend_400Regular",
  },
  modulesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    fontFamily: "Lexend_400Regular",
  },
  moduleCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F9F9F9",
  },
  moduleHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
    fontFamily: "Lexend_400Regular",
  },
  lessonsContainer: {
    padding: 15,
  },
  lessonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  lessonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lessonNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  lessonNumberCompleted: {
    backgroundColor: "#4CAF50",
  },
  lessonNumberText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  lessonNumberTextCompleted: {
    color: "white",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
    fontFamily: "Lexend_400Regular",
  },
  lessonDescription: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  lessonRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonDuration: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
    fontFamily: "Lexend_400Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
});

export default CourseDetailsScreen;
