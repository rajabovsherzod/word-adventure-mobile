import { useState } from "react";
import { GameState, Word, GameStages, ModalContent } from "../types/lesson";
import { generateOptions, shuffleWord } from "../utils/LessonUtils";

/**
 * Custom hook to manage game state
 */
export const useGameState = (
  words: Word[],
  updateProgress: (progress: number) => void,
  setModalContent: (content: ModalContent) => void,
  setModalVisible: (visible: boolean) => void,
  setSelectedStep: (step: number | null) => void
) => {
  // O'yin holati
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
    stageProgress: {
      memorize: 0,
      match: 0,
      arrange: 0,
      write: 0,
    },
    shuffledLetters: [],
    completed: false,
    lastSelectedOption: undefined,
    showCorrectAnswer: false,
  });

  // Memorize bosqichi uchun variantlar
  const [options, setOptions] = useState<string[]>([]);

  // Write bosqichi uchun javob
  const [writeAnswer, setWriteAnswer] = useState<string>("");

  // Bosqichni tanlash
  const handleStepSelect = (stepIndex: number, lessonProgressValue: number) => {
    // Bosqich ochiq yoki yopiqligini tekshirish
    const previousStepUnlocked =
      stepIndex === 1 ||
      (stepIndex > 1 && lessonProgressValue >= (stepIndex - 1) * 25);

    if (previousStepUnlocked) {
      setSelectedStep(stepIndex);

      // Bosqichga qarab kerakli ma'lumotlarni o'rnatish
      const availableWords = words.slice(0, 10); // Har darsda 10 ta so'z

      if (stepIndex === 1) {
        // So'zlarni yodlash bosqichi uchun variantlarni tayyorlash
        setOptions(generateOptions(availableWords[0].uzbek, availableWords));

        // GameState ni qayta o'rnatish
        setGameState({
          currentStage: "memorize",
          currentWordIndex: 0,
          score: 0,
          mistakes: 0,
          completedWords: [],
          matchedPairs: [],
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          arrangedLetters: [],
          stageProgress: {
            memorize: 0,
            match: 0,
            arrange: 0,
            write: 0,
          },
          shuffledLetters: [],
          completed: false,
          lastSelectedOption: undefined,
          showCorrectAnswer: false,
        });
      } else if (stepIndex === 2) {
        // So'zlarni takrorlash (match) bosqichi
        setGameState({
          currentStage: "match",
          currentWordIndex: 0,
          score: 0,
          mistakes: 0,
          completedWords: [],
          matchedPairs: [],
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          arrangedLetters: [],
          stageProgress: {
            memorize: lessonProgressValue >= 25 ? 100 : 0,
            match: 0,
            arrange: 0,
            write: 0,
          },
          shuffledLetters: [],
          completed: false,
          lastSelectedOption: undefined,
          showCorrectAnswer: false,
        });
      } else if (stepIndex === 3) {
        // So'zlarni mustahkamlash (arrange) bosqichi
        const shuffledLetters = shuffleWord(availableWords[0].english);
        setGameState({
          currentStage: "arrange",
          currentWordIndex: 0,
          score: 0,
          mistakes: 0,
          completedWords: [],
          matchedPairs: [],
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          arrangedLetters: shuffledLetters,
          stageProgress: {
            memorize: lessonProgressValue >= 25 ? 100 : 0,
            match: lessonProgressValue >= 50 ? 100 : 0,
            arrange: 0,
            write: 0,
          },
          shuffledLetters: shuffledLetters,
          completed: false,
          lastSelectedOption: undefined,
          showCorrectAnswer: false,
        });
      } else if (stepIndex === 4) {
        // So'zlarni yozish (write) bosqichi
        setWriteAnswer(""); // Input ni tozalash
        setGameState({
          currentStage: "write",
          currentWordIndex: 0,
          score: 0,
          mistakes: 0,
          completedWords: [],
          matchedPairs: [],
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          arrangedLetters: [],
          stageProgress: {
            memorize: lessonProgressValue >= 25 ? 100 : 0,
            match: lessonProgressValue >= 50 ? 100 : 0,
            arrange: lessonProgressValue >= 75 ? 100 : 0,
            write: 0,
          },
          shuffledLetters: [],
          completed: false,
          lastSelectedOption: undefined,
          showCorrectAnswer: false,
        });
      }

      return true;
    } else {
      return false;
    }
  };

  // To'g'ri javob uchun qayta ishlash funksiyasi
  const handleCorrectAnswer = () => {
    const availableWords = words.slice(0, 10);

    if (gameState.currentWordIndex < availableWords.length - 1) {
      // Keyingi so'zga o'tish
      const nextIndex = gameState.currentWordIndex + 1;

      // Yangi variantlarni yaratish (memorize bosqichi uchun)
      if (gameState.currentStage === "memorize") {
        setOptions(
          generateOptions(availableWords[nextIndex].uzbek, availableWords)
        );
      }

      // Game state ni yangilash
      setGameState((prev) => ({
        ...prev,
        currentWordIndex: nextIndex,
        score: prev.score + 1,
        lastSelectedOption: undefined,
        showCorrectAnswer: false,
        mistakes: 0,
        // Shuffle bosqichiga qarab
        ...(prev.currentStage === "arrange" && {
          arrangedLetters: shuffleWord(availableWords[nextIndex].english),
        }),
      }));
    } else {
      // Barcha so'zlar tugadi - bosqichni tugatish
      const progressUpdate = { ...gameState.stageProgress };

      // Bosqichga qarab progress ni yangilash
      switch (gameState.currentStage) {
        case "memorize":
          progressUpdate.memorize = 100;
          updateProgress(25);
          break;
        case "match":
          progressUpdate.match = 100;
          updateProgress(50);
          break;
        case "arrange":
          progressUpdate.arrange = 100;
          updateProgress(75);
          break;
        case "write":
          progressUpdate.write = 100;
          updateProgress(100);
          break;
      }

      // Modal ni ko'rsatish
      setModalContent({
        title: `${
          gameState.currentStage.charAt(0).toUpperCase() +
          gameState.currentStage.slice(1)
        } bosqichi tugadi!`,
        message: "Keyingi bosqichga o'tishga tayyormisiz?",
        buttonText: "Davom etish",
        onPress: () => {
          setModalVisible(false);
          setSelectedStep(null);
        },
      });

      setModalVisible(true);

      setGameState((prev) => ({
        ...prev,
        stageProgress: progressUpdate,
        currentStage: "stages",
        completed: true,
        lastSelectedOption: undefined,
        showCorrectAnswer: false,
      }));
    }
  };

  // MemorizeStage uchun variant tanlash
  const handleOptionSelect = (selectedOption: string) => {
    // Agar variant allaqachon tanlangan bo'lsa, bo'sh return
    if (gameState.lastSelectedOption) {
      return;
    }

    const currentWord = words[gameState.currentWordIndex];

    // Javob to'g'rimi yoki yo'qligini tekshirish
    const isCorrect = currentWord && currentWord.uzbek === selectedOption;

    // Tanlangan variantni saqlash - to'g'ri javobda darhol ko'rsatish
    setGameState((prev) => ({
      ...prev,
      lastSelectedOption: selectedOption,
      showCorrectAnswer: true,
    }));

    if (isCorrect) {
      // To'g'ri javob darhol ko'rsatiladi
      handleCorrectAnswer();
    } else {
      // Noto'g'ri javob - 3 sekunddan so'ng keyingi so'zga o'tadi
      setTimeout(() => {
        const availableWords = words.slice(0, 10);

        if (gameState.currentWordIndex < availableWords.length - 1) {
          // Keyingi so'zga o'tish
          const nextIndex = gameState.currentWordIndex + 1;

          // Yangi so'z uchun variantlarni yangilash
          setOptions(
            generateOptions(availableWords[nextIndex].uzbek, availableWords)
          );

          setGameState((prev) => ({
            ...prev,
            currentWordIndex: nextIndex,
            mistakes: 0,
            lastSelectedOption: undefined,
            showCorrectAnswer: false,
          }));
        } else {
          // Barcha so'zlar tugadi - bosqichni tugatish
          const progressUpdate = { ...gameState.stageProgress };
          progressUpdate.memorize = 100;

          // Professional modal chiqarish
          setModalContent({
            title: "Yodlash bosqichi tugadi!",
            message: "Takrorlash bosqichiga o'tishga tayyormisiz?",
            buttonText: "Davom etish",
            onPress: () => {
              updateProgress(25);
              setModalVisible(false);
              setSelectedStep(null);
            },
          });

          setModalVisible(true);

          setGameState((prev) => ({
            ...prev,
            stageProgress: progressUpdate,
            currentStage: "stages",
            currentWordIndex: 0,
            lastSelectedOption: undefined, // Modal ko'rsatishdan oldin tanlangan variantni tushirib qoldiramiz
            showCorrectAnswer: false, // Ko'rsatish holatini ham tushiramiz
          }));
        }
      }, 3000); // 3 sekund kechikish
    }
  };

  // MatchStage uchun inglizcha so'z tanlash
  const handleSelectEnglish = (english: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedEnglishWord: english,
    }));
  };

  // MatchStage uchun o'zbekcha so'z tanlash
  const handleSelectUzbek = (uzbek: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedUzbekWord: uzbek,
    }));

    // Agar inglizcha so'z tanlangan bo'lsa, tekshirish
    if (gameState.selectedEnglishWord) {
      const matchedWord = words.find(
        (w) => w.english === gameState.selectedEnglishWord
      );

      if (matchedWord && matchedWord.uzbek === uzbek) {
        // Match topildi
        const newPair = { english: gameState.selectedEnglishWord, uzbek };
        setGameState((prev) => ({
          ...prev,
          matchedPairs: [...prev.matchedPairs, newPair],
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          score: prev.score + 1,
        }));

        // Barcha so'zlar topildimi
        if (gameState.matchedPairs.length + 1 >= words.length) {
          // Match bosqichi tugadi
          handleCorrectAnswer();
        }
      } else {
        // Match topilmadi
        setGameState((prev) => ({
          ...prev,
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          mistakes: prev.mistakes + 1,
        }));
      }
    }
  };

  // ArrangeStage uchun harflarni tanlash
  const handleArrangeLetter = (letter: string, index: number) => {
    // Joriy so'z harflari
    const newArrangedLetters = [...gameState.arrangedLetters];
    // Tanlangan harfni o'chirish
    newArrangedLetters.splice(index, 1);

    // Yangi state ni saqlash
    setGameState((prev) => ({
      ...prev,
      arrangedLetters: newArrangedLetters,
    }));

    // Barcha harflar ishlatilganda tekshirish
    if (newArrangedLetters.length === 0) {
      // Bu bosqich tugadi, keyingi so'zga o'tish
      const availableWords = words.slice(0, 10);

      if (gameState.currentWordIndex < availableWords.length - 1) {
        // Keyingi so'zga o'tish
        const nextIndex = gameState.currentWordIndex + 1;
        setGameState((prev) => ({
          ...prev,
          currentWordIndex: nextIndex,
          score: prev.score + 1,
          arrangedLetters: shuffleWord(availableWords[nextIndex].english),
          mistakes: 0,
        }));
      } else {
        // Barcha so'zlar bitdi, bosqich tugadi
        setGameState((prev) => {
          const progressUpdate = { ...prev.stageProgress };
          progressUpdate.arrange = 100;

          // Bosqich progressini saqlash
          updateProgress(75);

          return {
            ...prev,
            stageProgress: progressUpdate,
            score: prev.score + 1,
            currentWordIndex: 0,
            arrangedLetters: [],
            completed: true,
          };
        });
      }
    }
  };

  // O'yin bosqichlari
  const gameStages: Record<string, any> = {
    memorize: {
      options,
      handleOptionSelect,
    },
    match: {
      handleSelectEnglish,
      handleSelectUzbek,
    },
    arrange: {
      handleArrangeLetter,
    },
    write: {
      writeAnswer,
      setWriteAnswer,
    },
  };

  return {
    gameState,
    setGameState,
    handleStepSelect,
    handleCorrectAnswer,
    handleOptionSelect,
    handleSelectEnglish,
    handleSelectUzbek,
    handleArrangeLetter,
    options,
    setOptions,
    writeAnswer,
    setWriteAnswer,
    gameStages,
  };
};
