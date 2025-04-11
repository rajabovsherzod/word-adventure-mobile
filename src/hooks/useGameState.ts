import { useState, useCallback } from "react";
import { Word } from "../types/lesson";

// O'yin bosqichlari
export type GameStages =
  | "memorize"
  | "match"
  | "arrange"
  | "write"
  | "complete";

// O'yin holati uchun interfeys
export interface GameState {
  currentStage: GameStages;
  currentWordIndex: number;
  score: number;
  mistakes: number;
  completedWords: string[];
  matchedPairs: { english: string; uzbek: string }[];
  selectedEnglishWord: string | null;
  selectedUzbekWord: string | null;
  arrangedLetters: string[];
  shuffledLetters: string[];
  userInput: string;
  stageProgress: {
    memorize: number;
    match: number;
    arrange: number;
    write: number;
  };
  options: string[];
  showCorrectAnswer: boolean;
}

// Hook o'yin holati
export const useGameState = (words: Word[]) => {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: "memorize",
    currentWordIndex: 0,
    score: 0,
    mistakes: 0,
    completedWords: [],
    matchedPairs: [],
    selectedEnglishWord: null,
    selectedUzbekWord: null,
    arrangedLetters: [],
    shuffledLetters: [],
    userInput: "",
    stageProgress: {
      memorize: 0,
      match: 0,
      arrange: 0,
      write: 0,
    },
    options: [],
    showCorrectAnswer: false,
  });

  // So'zni aralashtirish funksiyasi
  const shuffleWord = useCallback((word: string): string[] => {
    return word.split("").sort(() => Math.random() - 0.5);
  }, []);

  // So'zlar variantlarini generatsiya qilish
  const generateOptions = useCallback(
    (correctUzbek: string, allWords: Word[]): string[] => {
      const options = [correctUzbek];
      const availableWords = allWords.filter((w) => w.uzbek !== correctUzbek);

      // 3 ta noto'g'ri variantlarni qo'shish
      for (let i = 0; i < 3 && availableWords.length > i; i++) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        options.push(availableWords[randomIndex].uzbek);
        availableWords.splice(randomIndex, 1);
      }

      // Variantlarni aralashtirish
      return options.sort(() => Math.random() - 0.5);
    },
    []
  );

  // O'yin bosqichini o'zgartirish
  const setStage = useCallback(
    (stage: GameStages) => {
      setGameState((prev) => {
        let newState = {
          ...prev,
          currentStage: stage,
          currentWordIndex: 0,
          mistakes: 0,
        };

        // Bosqich o'zgarganda kerakli ma'lumotlarni tayyorlash
        if (stage === "memorize" && words.length > 0) {
          newState.options = generateOptions(words[0].uzbek, words);
        } else if (stage === "arrange" && words.length > 0) {
          newState.arrangedLetters = shuffleWord(words[0].english);
        } else if (stage === "write") {
          newState.userInput = "";
        }

        return newState;
      });
    },
    [words, generateOptions, shuffleWord]
  );

  // O'yin bosqichini qayta ishga tushirish
  const resetStage = useCallback(() => {
    setGameState((prev) => {
      const currentStage = prev.currentStage;
      let newState = {
        ...prev,
        currentWordIndex: 0,
        mistakes: 0,
        matchedPairs: [],
        selectedEnglishWord: null,
        selectedUzbekWord: null,
        userInput: "",
        showCorrectAnswer: false,
      };

      // Bosqichga mos ma'lumotlarni tayyorlash
      if (currentStage === "memorize" && words.length > 0) {
        newState.options = generateOptions(words[0].uzbek, words);
      } else if (currentStage === "arrange" && words.length > 0) {
        newState.arrangedLetters = shuffleWord(words[0].english);
      }

      return newState;
    });
  }, [words, generateOptions, shuffleWord]);

  // To'g'ri javob uchun
  const handleCorrectAnswer = useCallback(() => {
    setGameState((prev) => {
      // Yangi holat
      let newState = {
        ...prev,
        score: prev.score + 1,
        showCorrectAnswer: true,
      };

      // So'z tugadimi?
      if (prev.currentWordIndex < words.length - 1) {
        return newState;
      } else {
        // Bosqich tugadi
        const progressUpdate = { ...prev.stageProgress };

        // Bosqich progressini 100% ga o'rnatish
        if (prev.currentStage === "memorize") {
          progressUpdate.memorize = 100;
        } else if (prev.currentStage === "match") {
          progressUpdate.match = 100;
        } else if (prev.currentStage === "arrange") {
          progressUpdate.arrange = 100;
        } else if (prev.currentStage === "write") {
          progressUpdate.write = 100;
        }

        return {
          ...newState,
          stageProgress: progressUpdate,
        };
      }
    });
  }, [words]);

  // Noto'g'ri javob uchun
  const handleWrongAnswer = useCallback(() => {
    setGameState((prev) => {
      const newMistakes = prev.mistakes + 1;

      // 3 ta xatodan ko'p qilsa, keyingi so'zga o'tish
      if (newMistakes >= 3) {
        return {
          ...prev,
          mistakes: 0,
          showCorrectAnswer: true,
        };
      }

      return {
        ...prev,
        mistakes: newMistakes,
      };
    });
  }, []);

  // Keyingi so'zga o'tish
  const nextWord = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentWordIndex + 1;

      // Agar so'zlar tugasa
      if (nextIndex >= words.length) {
        return prev;
      }

      let newState = {
        ...prev,
        currentWordIndex: nextIndex,
        mistakes: 0,
        showCorrectAnswer: false,
        userInput: "",
      };

      // Bosqichga mos ma'lumotlarni tayyorlash
      if (prev.currentStage === "memorize") {
        newState.options = generateOptions(words[nextIndex].uzbek, words);
      } else if (prev.currentStage === "arrange") {
        newState.arrangedLetters = shuffleWord(words[nextIndex].english);
      }

      return newState;
    });
  }, [words, generateOptions, shuffleWord]);

  return {
    gameState,
    setGameState,
    setStage,
    resetStage,
    handleCorrectAnswer,
    handleWrongAnswer,
    nextWord,
  };
};

export default useGameState;
