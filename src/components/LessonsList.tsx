import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getUserProgress } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LessonWord {
  word: string;
  translation: string;
}

interface LessonsListProps {
  level: string;
  cardId: number;
  title: string;
  currentLesson: number;
  onLessonPress: (lessonId: number, words: LessonWord[]) => void;
}

interface LessonCardProps {
  lessonId: number;
  isLocked: boolean;
  progress: number;
  words: LessonWord[];
  onPress: () => void;
  stageStatus?: StageStatus;
}

// Stage status interface
interface StageStatus {
  memorize: boolean;
  match: boolean;
  arrange: boolean;
  write: boolean;
}

const LessonStages = ({
  currentStage = 1,
  stageStatus,
}: {
  currentStage?: number;
  stageStatus?: StageStatus;
}) => {
  // Default stages if no status provided
  const completedStages = stageStatus || {
    memorize: false,
    match: false,
    arrange: false,
    write: false,
  };

  // Har bir bosqich statusi uchun consolega chiqarish
  console.log("Stage Status in LessonStages:", completedStages);

  return (
    <View style={styles.stagesContainer}>
      {/* Stage 1 - Memorize */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              completedStages.memorize && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="book-reader"
              size={14}
              color={completedStages.memorize ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>1</Text>
        </View>
      </View>

      {/* Line between Stage 1 and 2 */}
      <View
        style={[
          styles.stageLine,
          completedStages.memorize
            ? styles.stageLineActive
            : styles.stageLineInactive,
        ]}
      />

      {/* Stage 2 - Match */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              completedStages.match && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="sync"
              size={14}
              color={completedStages.match ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>2</Text>
        </View>
      </View>

      {/* Line between Stage 2 and 3 */}
      <View
        style={[
          styles.stageLine,
          completedStages.match
            ? styles.stageLineActive
            : styles.stageLineInactive,
        ]}
      />

      {/* Stage 3 - Arrange */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              completedStages.arrange && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="check-circle"
              size={14}
              color={completedStages.arrange ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>3</Text>
        </View>
      </View>

      {/* Line between Stage 3 and 4 */}
      <View
        style={[
          styles.stageLine,
          completedStages.arrange
            ? styles.stageLineActive
            : styles.stageLineInactive,
        ]}
      />

      {/* Stage 4 - Write */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              completedStages.write && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="pencil-alt"
              size={14}
              color={completedStages.write ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>4</Text>
        </View>
      </View>
    </View>
  );
};

const LessonCard: React.FC<LessonCardProps> = ({
  lessonId,
  isLocked,
  progress,
  words,
  onPress,
  stageStatus,
}) => {
  // Keep currentStage for backwards compatibility
  const currentStage = Math.floor((progress / 100) * 4) + 1;

  // Log progress and status
  console.log(`Rendering Card for Lesson ${lessonId}:`, {
    progress,
    stageStatus,
  });

  return (
    <TouchableOpacity
      style={[
        styles.lessonCard,
        isLocked ? styles.lockedCard : styles.unlockedCard,
      ]}
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={styles.lessonHeader}>
        <View style={styles.titleProgressContainer}>
          <Text style={styles.lessonTitle}>{lessonId}-dars</Text>
          <Text
            style={[
              styles.progressPercentage,
              progress > 0 && styles.activeProgress,
            ]}
          >
            {Math.round(progress)}%
          </Text>
        </View>
        {!isLocked && (
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="bitcoin" size={12} color="#FFD700" />
            <Text style={styles.coinsText}>+5</Text>
          </View>
        )}
      </View>

      <LessonStages currentStage={currentStage} stageStatus={stageStatus} />

      {isLocked && (
        <View style={styles.lockOverlay}>
          <FontAwesome5 name="lock" size={20} color="#3C5BFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const LessonsList: React.FC<LessonsListProps> = ({
  level,
  cardId,
  title,
  currentLesson,
  onLessonPress,
}) => {
  // Test uchun so'zlar
  const lessonsWords: { [key: number]: LessonWord[] } = {
    1: [
      { word: "hello", translation: "salom" },
      { word: "world", translation: "dunyo" },
      { word: "book", translation: "kitob" },
      { word: "pen", translation: "ruchka" },
      { word: "school", translation: "maktab" },
      { word: "teacher", translation: "o'qituvchi" },
      { word: "student", translation: "o'quvchi" },
      { word: "friend", translation: "do'st" },
      { word: "family", translation: "oila" },
    ],
    2: [
      { word: "computer", translation: "kompyuter" },
      { word: "phone", translation: "telefon" },
      { word: "table", translation: "stol" },
    ],
  };

  const lessons = Array.from({ length: 5 }, (_, i) => i + 1);

  // Progress state for all lessons
  const [lessonsProgress, setLessonsProgress] = useState<{
    [key: string]: {
      completedPercentage: number;
      stageStatus: StageStatus;
    };
  }>({});

  // Load progress from backend
  const loadProgress = async () => {
    try {
      // Check if user is logged in
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("User not logged in, cannot load progress");
        return;
      }

      // Get progress from backend
      const response = await getUserProgress();
      console.log("RAW Progress response:", JSON.stringify(response, null, 2));

      // Backenddan qaytgan javobni tekshirish - har qanday formatda kelsa ham ishlaydi
      let progressData = [];

      if (response && response.data && Array.isArray(response.data)) {
        progressData = response.data;
      } else if (response && Array.isArray(response)) {
        progressData = response;
      } else if (response && response.success && Array.isArray(response.data)) {
        progressData = response.data;
      }

      console.log(
        "PROCESSED Progress Data:",
        JSON.stringify(progressData, null, 2)
      );
      console.log("Progress data lessons count:", progressData.length);
      // Lesson ID formatini tekshirish
      if (progressData.length > 0) {
        console.log("First lesson ID format:", progressData[0].lessonId);
        progressData.forEach((lesson) => {
          console.log(
            `Lesson ID in data: ${lesson.lessonId}, completion: ${lesson.completedPercentage}%, stages:`,
            lesson.stages
              ? {
                  memorize: lesson.stages.memorize?.completed || false,
                  match: lesson.stages.match?.completed || false,
                  arrange: lesson.stages.arrange?.completed || false,
                  write: lesson.stages.write?.completed || false,
                }
              : "No stages data"
          );
        });

        // Extract progress information for lessons
        const progressMap: {
          [key: string]: {
            completedPercentage: number;
            stageStatus: StageStatus;
          };
        } = {};

        // Process only lessons that are not locked
        const unlockedLessons = lessons.filter((id) => id <= currentLesson);

        console.log("Unlocked lessons:", unlockedLessons);
        console.log("Response data lessons:", progressData);

        // Find corresponding lesson data
        unlockedLessons.forEach((lessonId) => {
          // Fix: level qiymatini to'g'irlash
          // Backend lessonId formati: "1-1" (level-lesson)
          // "Beginner" emas, balki raqam kerak
          let numericLevel = level;
          if (level === "Beginner") numericLevel = "1";
          if (level === "Elementary") numericLevel = "2";
          if (level === "Pre-Intermediate") numericLevel = "3";
          if (level === "Intermediate") numericLevel = "4";
          if (level === "Upper-Intermediate") numericLevel = "5";
          if (level === "Advanced") numericLevel = "6";

          const lessonIdWithLevel = `${numericLevel}-${lessonId}`;
          console.log(
            `Searching for lesson: ${lessonIdWithLevel} (original level: ${level})`
          );

          // Har bir backend dars ma'lumotini tekshiramiz
          for (const lesson of progressData) {
            console.log(
              `Comparing ${lesson.lessonId} with ${lessonIdWithLevel}`
            );
            if (lesson.lessonId === lessonIdWithLevel) {
              console.log(
                `FOUND Lesson data for ${lessonIdWithLevel}:`,
                lesson
              );

              // Stage statuslarini aniqlaymiz
              const stageStatus = {
                memorize: false,
                match: false,
                arrange: false,
                write: false,
              };

              if (lesson.stages) {
                // Memorize stage
                if (
                  lesson.stages.memorize &&
                  lesson.stages.memorize.completed
                ) {
                  stageStatus.memorize = true;
                }

                // Match stage
                if (lesson.stages.match && lesson.stages.match.completed) {
                  stageStatus.match = true;
                }

                // Arrange stage
                if (lesson.stages.arrange && lesson.stages.arrange.completed) {
                  stageStatus.arrange = true;
                }

                // Write stage
                if (lesson.stages.write && lesson.stages.write.completed) {
                  stageStatus.write = true;
                }
              }

              // Progress ma'lumotini saqlash
              progressMap[lessonId] = {
                completedPercentage: lesson.completedPercentage || 0,
                stageStatus: stageStatus,
              };

              console.log(`Stage status for lesson ${lessonId}:`, stageStatus);
              console.log(
                `Progress percentage for lesson ${lessonId}:`,
                lesson.completedPercentage || 0
              );
              break;
            }
          }

          // Agar dars ma'lumoti topilmasa, default qiymatlar
          if (!progressMap[lessonId]) {
            progressMap[lessonId] = {
              completedPercentage: 0,
              stageStatus: {
                memorize: false,
                match: false,
                arrange: false,
                write: false,
              },
            };
          }
        });

        console.log("Final progress map:", progressMap);
        setLessonsProgress(progressMap);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  // Load progress on component mount and when data changes
  useEffect(() => {
    console.log(
      `LessonsList mounted for level:${level}, card:${cardId}, currentLesson:${currentLesson}`
    );
    loadProgress();

    // Har 2 sekundda progressni yangilash
    const interval = setInterval(() => {
      loadProgress();
    }, 2000);

    return () => clearInterval(interval);
  }, [level, cardId, currentLesson]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.levelTitle}>{title}</Text>
      {lessons.map((lessonId) => {
        // Get progress for this lesson if available
        const lessonProgress = lessonsProgress[lessonId];

        // Show actual progress from backend or default value
        const progress = lessonProgress
          ? lessonProgress.completedPercentage
          : lessonId < currentLesson
          ? 100
          : 0;

        // Show actual stage status from backend or default value
        const stageStatus = lessonProgress
          ? lessonProgress.stageStatus
          : undefined;

        console.log(`Card ${lessonId} FINAL values:`, {
          progress,
          stageStatus,
          isAvailable: lessonId <= currentLesson,
        });

        return (
          <LessonCard
            key={lessonId}
            lessonId={lessonId}
            isLocked={lessonId > currentLesson}
            progress={progress}
            stageStatus={stageStatus}
            words={lessonsWords[lessonId] || []}
            onPress={() =>
              onLessonPress(lessonId, lessonsWords[lessonId] || [])
            }
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
  },
  levelTitle: {
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    color: "#333",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.95,
    backgroundColor: "#F8F9FF",
  },
  unlockedCard: {
    backgroundColor: "#FFFFFF",
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonTitle: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#000000",
    marginRight: 8,
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#000000",
    fontWeight: "500",
  },
  activeProgress: {
    color: "#4CAF50",
    opacity: 1,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinsText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "Lexend_400Regular",
    fontWeight: "600",
  },
  stagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
    position: "relative",
  },
  stageItem: {
    alignItems: "center",
    zIndex: 2,
  },
  stageIconWrapper: {
    alignItems: "center",
  },
  stageIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  // Completed stage icon style - background green
  completedStageIcon: {
    backgroundColor: "#4CAF50",
  },
  stageIcon: {
    opacity: 1,
  },
  stageNumber: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "Lexend_400Regular",
    fontWeight: "500",
  },
  stageLine: {
    position: "absolute",
    top: 15,
    left: 40,
    right: 40,
    height: 3,
    zIndex: 1,
  },
  stageLineActive: {
    backgroundColor: "#4CAF50",
  },
  stageLineInactive: {
    backgroundColor: "#E5E9FF",
  },
  lockOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LessonsList;
