import { Word } from "../types/lesson";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Joriy sana formatini olish
export const getCurrentDate = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? "0" + day : day}.${
    month < 10 ? "0" + month : month
  }.${year}`;
};

// Variantlar generatsiyasi
export const generateOptions = (
  correctAnswer: string,
  words: Word[]
): string[] => {
  // To'g'ri javobni qo'shish
  const options = [correctAnswer];

  // 3 ta tasodifiy noto'g'ri javob qo'shish
  const incorrectOptions = words
    .filter((word) => word.uzbek !== correctAnswer)
    .map((word) => word.uzbek)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  options.push(...incorrectOptions);

  // Variantlarni aralashtirish
  return options.sort(() => Math.random() - 0.5);
};

// So'zni tarqatib yuborish
export const shuffleWord = (word: string): string[] => {
  return word.split("").sort(() => Math.random() - 0.5);
};

// Progress va o'rganilgan so'zlarni saqlash
export const saveProgress = async (
  progress: Record<number, number>,
  completedLessons: number[],
  learnedWords: string[]
) => {
  try {
    await AsyncStorage.setItem("lessonProgress", JSON.stringify(progress));
    await AsyncStorage.setItem(
      "completedLessons",
      JSON.stringify(completedLessons)
    );
    await AsyncStorage.setItem("learnedWords", JSON.stringify(learnedWords));
  } catch (error) {
    console.error("Progressni saqlashda xatolik:", error);
  }
};

// Progressni yuklash
export const loadProgress = async (): Promise<{
  progress: Record<number, number>;
  completedLessons: number[];
  learnedWords: string[];
}> => {
  try {
    const progressStr = await AsyncStorage.getItem("lessonProgress");
    const completedLessonsStr = await AsyncStorage.getItem("completedLessons");
    const learnedWordsStr = await AsyncStorage.getItem("learnedWords");

    const progress = progressStr ? JSON.parse(progressStr) : {};
    const completedLessons = completedLessonsStr
      ? JSON.parse(completedLessonsStr)
      : [];
    const learnedWords = learnedWordsStr ? JSON.parse(learnedWordsStr) : [];

    return { progress, completedLessons, learnedWords };
  } catch (error) {
    console.error("Progressni yuklashda xatolik:", error);
    return { progress: {}, completedLessons: [], learnedWords: [] };
  }
};

// Tanga (coins) bilan ishlash
export const getCoins = async (): Promise<number> => {
  try {
    const storedCoins = await AsyncStorage.getItem("coins");
    return storedCoins ? parseInt(storedCoins) : 0;
  } catch (error) {
    console.error("Tangalarni olishda xatolik:", error);
    return 0;
  }
};

export const saveCoins = async (coins: number): Promise<void> => {
  try {
    await AsyncStorage.setItem("coins", coins.toString());
  } catch (error) {
    console.error("Tangalarni saqlashda xatolik:", error);
  }
};

export default {
  getCurrentDate,
  generateOptions,
  shuffleWord,
  saveProgress,
  loadProgress,
  getCoins,
  saveCoins,
};
