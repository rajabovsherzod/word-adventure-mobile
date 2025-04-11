import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState, GameStages, Word } from "../types/lesson";
import {
  loadProgress as loadProgressUtil,
  saveProgress,
  getCoins as getCoinsUtil,
  saveCoins,
} from "../utils/LessonUtils";

export type LessonProgressType = {
  [key: number]: number;
};

/**
 * Custom hook to manage lesson progress
 */
export const useLessonProgress = (cardId: number) => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressType>({});
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  const loadProgress = async () => {
    try {
      // Load progress data
      const progress = await AsyncStorage.getItem(`progress_card_${cardId}`);
      if (progress) {
        const parsedProgress = JSON.parse(progress);
        setCompletedLessons(parsedProgress.completedLessons || []);
        setLessonProgress(parsedProgress.lessonProgress || {});
      }

      // Load learned words data
      const learned = await AsyncStorage.getItem(
        `learned_words_card_${cardId}`
      );
      if (learned) {
        setLearnedWords(JSON.parse(learned));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const saveProgress = async () => {
    try {
      // Save progress to AsyncStorage
      const progressData = {
        completedLessons,
        lessonProgress,
      };

      await AsyncStorage.setItem(
        `progress_card_${cardId}`,
        JSON.stringify(progressData)
      );

      // Save learned words
      await AsyncStorage.setItem(
        `learned_words_card_${cardId}`,
        JSON.stringify(learnedWords)
      );
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const updateProgress = (lessonId: number, percentage: number) => {
    if (lessonProgress[lessonId] < percentage) {
      const newProgress = { ...lessonProgress };
      newProgress[lessonId] = percentage;
      setLessonProgress(newProgress);
      saveProgress();
      return true; // Progress was updated
    }
    return false; // No update needed
  };

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);

      // Set progress to 100%
      const newProgress = { ...lessonProgress };
      newProgress[lessonId] = 100;
      setLessonProgress(newProgress);

      saveProgress();
      return true; // Lesson was marked as complete
    }
    return false; // Lesson was already complete
  };

  const markWordLearned = (wordId: string) => {
    if (!learnedWords.includes(wordId)) {
      const newLearnedWords = [...learnedWords, wordId];
      setLearnedWords(newLearnedWords);
      saveProgress();
      return true; // Word was marked as learned
    }
    return false; // Word was already learned
  };

  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.includes(lessonId);
  };

  const isLessonAvailable = (lessonId: number) => {
    // First lesson is always available
    if (lessonId === 1) return true;

    // Other lessons are available if the previous lesson is completed
    return isLessonCompleted(lessonId - 1);
  };

  const getLessonProgressPercentage = (lessonId: number) => {
    return lessonProgress[lessonId] || 0;
  };

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [cardId]);

  return {
    completedLessons,
    lessonProgress,
    learnedWords,
    loadProgress,
    saveProgress,
    updateProgress,
    markLessonComplete,
    markWordLearned,
    isLessonCompleted,
    isLessonAvailable,
    getLessonProgressPercentage,
  };
};

export default useLessonProgress;
