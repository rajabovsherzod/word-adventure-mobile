import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getUserProgress } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LessonCard from "./LessonCard";

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
  onLessonComplete?: (lessonId: number) => void;
}

// Stage status interface
interface StageStatus {
  memorize: boolean;
  match: boolean;
  arrange: boolean;
  write: boolean;
}

const LessonsList: React.FC<LessonsListProps> = ({
  level,
  cardId,
  title,
  currentLesson,
  onLessonPress,
  onLessonComplete,
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
        console.error("User not logged in, cannot load progress");
        return;
      }

      // Level qiymatini to'g'ri formatga o'tkazish
      let numericLevel = "1"; // Default
      if (level === "Beginner") numericLevel = "1";
      if (level === "Intermediate") numericLevel = "2"; // To'g'rilandi
      if (level === "Advanced") numericLevel = "3"; // To'g'rilandi

      console.log(
        `LessonsList loadProgress - Level: ${level}, NumericLevel: ${numericLevel}`
      );

      // Get progress from backend
      try {
        console.log("Calling getUserProgress API...");
        const response = await getUserProgress();
        console.log("getUserProgress API response received", response);

        // Backenddan qaytgan javobni tekshirish
        let progressData = [];

        if (response && response.data && Array.isArray(response.data)) {
          progressData = response.data;
          console.log("Progress data is in response.data array format");
        } else if (response && Array.isArray(response)) {
          progressData = response;
          console.log("Progress data is direct array format");
        } else if (
          response &&
          response.success &&
          Array.isArray(response.data)
        ) {
          progressData = response.data;
          console.log("Progress data is in response.success.data format");
        } else {
          console.error("Unexpected response format:", response);
        }

        console.log("Progress data lessons count:", progressData.length);

        if (progressData.length > 0) {
          // Extract progress information for lessons
          const progressMap: {
            [key: string]: {
              completedPercentage: number;
              stageStatus: StageStatus;
            };
          } = {};

          // Process only lessons that are not locked
          const unlockedLessons = lessons.filter((id) => id <= currentLesson);
          console.log(`Level ${level} - Unlocked lessons:`, unlockedLessons);

          // Progressni tekshirib olish
          const levelPrefix = `${numericLevel}-`;
          console.log(`Filtering progress for prefix: ${levelPrefix}`);

          const levelProgressData = progressData.filter((item) => {
            return item.lessonId && item.lessonId.startsWith(levelPrefix);
          });

          console.log(
            `Found ${levelProgressData.length} progress items for level ${level}`
          );

          // Yangi foydalanuvchilar uchun progress bo'lmasligi tabiiy hol

          // Find corresponding lesson data
          unlockedLessons.forEach((lessonId) => {
            const lessonIdWithLevel = `${numericLevel}-${lessonId}`;
            const lesson = levelProgressData.find(
              (p) => p.lessonId === lessonIdWithLevel
            );

            if (lesson) {
              console.log(
                `FOUND Lesson progress for ${lessonIdWithLevel}, progress: ${
                  lesson.completedPercentage || 0
                }%`
              );

              // Stage statuslarini aniqlaymiz
              const stageStatus = {
                memorize: lesson.stages?.memorize?.completed || false,
                match: lesson.stages?.match?.completed || false,
                arrange: lesson.stages?.arrange?.completed || false,
                write: lesson.stages?.write?.completed || false,
              };

              console.log(
                `Lesson ${lessonIdWithLevel} stage statuses:`,
                stageStatus
              );

              // Progress ma'lumotini saqlash
              progressMap[lessonId] = {
                completedPercentage: lesson.completedPercentage || 0,
                stageStatus: stageStatus,
              };

              // Dars 100% tugallangan bo'lsa, keyingi darsni ochib qo'yish
              if (lesson.completedPercentage === 100) {
                console.log(`Lesson ${lessonIdWithLevel} is 100% complete!`);
                // Callback orqali App.tsx ga holatni yuboramiz
                if (onLessonComplete) {
                  onLessonComplete(lessonId);
                }
              }
            } else {
              console.log(`No progress found for lesson ${lessonIdWithLevel}`);
              // Agar dars ma'lumoti topilmasa, default qiymatlar
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

          // State yangilash
          console.log("Setting progress state with data:", progressMap);
          setLessonsProgress(progressMap);
        } else {
          // Ogohlantirishni olib tashlaymiz
        }
      } catch (apiError) {
        console.error("API Error in getUserProgress:", apiError);
        console.error("API Error details:", apiError.message, apiError.stack);
      }
    } catch (error) {
      console.error("General error in loadProgress:", error);
      console.error("Error details:", error.message, error.stack);
    }
  };

  // Load progress on component mount and when data changes
  useEffect(() => {
    // Dastlab bir marta yuklaymiz
    loadProgress();

    // Har 2 sekundda progressni yangilaymiz
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
          ? lessonsProgress[lessonId].completedPercentage
          : lessonId < currentLesson
          ? 100
          : 0;

        // Agar oldingi dars 100% bo'lsa, hozirgi darsning qulfini ochish
        const isPreviousLessonComplete =
          lessonId > 1 &&
          lessonsProgress[lessonId - 1] &&
          lessonsProgress[lessonId - 1].completedPercentage === 100;

        // Unlock logic: dars agar currentLesson dan past yoki teng bo'lsa, yoki oldingi dars 100% bo'lsa
        const isLocked = lessonId > currentLesson && !isPreviousLessonComplete;

        // Show actual stage status from backend or default value
        const stageStatus = lessonProgress
          ? lessonsProgress[lessonId].stageStatus
          : {
              memorize: false,
              match: false,
              arrange: false,
              write: false,
            };

        return (
          <LessonCard
            key={lessonId}
            lessonId={lessonId}
            isLocked={isLocked}
            progress={progress}
            stageStatus={stageStatus}
            words={lessonsWords[lessonId] || []}
            onPress={() =>
              onLessonPress(lessonId, lessonsWords[lessonId] || [])
            }
            level={level}
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
});

export default LessonsList;
