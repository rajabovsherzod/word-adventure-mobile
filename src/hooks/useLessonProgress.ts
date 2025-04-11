import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState, GameStages, Word } from "../types/lesson";
import {
  loadProgress as loadProgressUtil,
  saveProgress,
  getCoins as getCoinsUtil,
  saveCoins,
} from "../utils/LessonUtils";

/**
 * Custom hook to manage lesson progress
 */
export const useLessonProgress = (
  cardId: number,
  initialCoins: number,
  addCoins: (amount: number) => void
) => {
  // States
  const [lessonProgress, setLessonProgress] = useState<Record<number, number>>(
    {}
  );
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  // Progressni yuklash
  const loadProgress = async () => {
    try {
      const { progress, completedLessons, learnedWords } =
        await loadProgressUtil();
      setLessonProgress(progress);
      setCompletedLessons(completedLessons);
      setLearnedWords(learnedWords);
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  // Tanga (coins) olish
  const getCoins = async () => {
    try {
      const storedCoins = await AsyncStorage.getItem("coins");
      if (storedCoins) {
        // Use addCoins instead of setCoins
        const parsedCoins = parseInt(storedCoins);
        addCoins(parsedCoins - initialCoins); // Add the difference to update to the stored value
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  // UseEffect hooks - component mount bo'lganda
  useEffect(() => {
    loadProgress();
    getCoins();
  }, []);

  // Dars tugaganmi tekshirish
  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.includes(lessonId);
  };

  // Dars mavjudmi tekshirish
  const isLessonAvailable = (lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  };

  // Dars progressini foizda olish
  const getLessonProgressPercentage = (lessonId: number) => {
    return lessonProgress[lessonId] || 0;
  };

  // Dars progressini yangilash
  const updateLessonProgress = (
    lessonId: number,
    progress: number,
    words: Word[],
    coins: number
  ) => {
    if (!lessonId) return;

    // Progressni o'rnatish
    const newProgress = {
      ...lessonProgress,
      [lessonId]: Math.max(progress, lessonProgress[lessonId] || 0),
    };

    setLessonProgress(newProgress);

    // Progress 100% ga yetganda, darsni tugatilgan deb belgilash
    if (progress === 100 && !completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);

      // O'rganilgan so'zlarni saqlash
      const newLearnedWords = [...learnedWords];
      words.forEach((word) => {
        if (!newLearnedWords.includes(word.english)) {
          newLearnedWords.push(word.english);
        }
      });
      setLearnedWords(newLearnedWords);

      // Tangalarni ko'paytirish
      const earnedCoins = 10; // Har bir dars uchun 10 tanga
      addCoins(earnedCoins);

      // Progressni saqlash
      saveProgress(newProgress, newCompletedLessons, newLearnedWords);
      saveCoins(coins + earnedCoins);

      return {
        completed: true,
        earnedCoins,
      };
    } else {
      // Progressni saqlash
      saveProgress(newProgress, completedLessons, learnedWords);
      return {
        completed: false,
      };
    }
  };

  return {
    lessonProgress,
    completedLessons,
    learnedWords,
    isLessonCompleted,
    isLessonAvailable,
    getLessonProgressPercentage,
    updateLessonProgress,
    loadProgress,
    getCoins,
  };
};
