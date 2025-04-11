import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Platform,
  SafeAreaView,
  FlatList,
  TextInput,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getWordsByCardAndLesson, Word } from "../data/words";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Props = {
  cardId: number;
  cardTitle: string;
  setScreen: (screen: string) => void;
  onStartLesson: (cardId: number, lessonId: number) => void;
  addCoins: (amount: number) => void;
  coins: number;
};

type LessonStep = {
  id: number;
  title: string;
  completed: boolean;
};

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
  progress: number;
  steps: LessonStep[];
  wordsLearned: number;
  totalWords: number;
};

// GameState tipini qo'shish
type GameStages =
  | "memorize"
  | "match"
  | "arrange"
  | "write"
  | "complete"
  | "stages";

interface GameState {
  currentStage: GameStages;
  currentWordIndex: number;
  score: number;
  mistakes: number;
  completedWords: string[];
  matchedPairs: { english: string; uzbek: string }[];
  selectedEnglishWord: string | null;
  selectedUzbekWord: string | null;
  arrangedLetters: string[];
  stageProgress: {
    memorize: number;
    match: number;
    arrange: number;
    write: number;
  };
  shuffledLetters: string[];
  completed: boolean;
}

const SuggestedLessonsScreen: React.FC<Props> = ({
  cardId,
  cardTitle,
  setScreen,
  onStartLesson,
  addCoins,
  coins,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [lessonProgress, setLessonProgress] = useState<{
    [key: number]: number;
  }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");

  // GameState o'zgaruvchisini qo'shish
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
  });

  // Memorize bosqichi uchun so'zlar variantlari
  const [options, setOptions] = useState<string[]>([]);
  // Write bosqichi uchun input value
  const [writeAnswer, setWriteAnswer] = useState<string>("");

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  useEffect(() => {
    // Format current date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("uz-UZ", options);
    setCurrentDate(formattedDate);

    // Load initial coins
    const fetchCoins = async () => {
      try {
        const storedCoins = await AsyncStorage.getItem("coins");
        if (storedCoins) {
          const parsedCoins = parseInt(storedCoins);
          // Props dan kelgan addCoins funksiyasini ishlatamiz
          if (parsedCoins !== coins) {
            addCoins(parsedCoins - coins);
          }
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchCoins();

    // Load user progress
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem(`progress_card_${cardId}`);
      if (progress) {
        const parsedProgress = JSON.parse(progress);
        setCompletedLessons(parsedProgress.completedLessons || []);
        setLessonProgress(parsedProgress.lessonProgress || {});
      }

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

  const getLevelTitle = (cardId: number) => {
    switch (cardId) {
      case 1:
        return "Beginner";
      case 2:
        return "Medium";
      case 3:
        return "Advanced";
      default:
        return "Beginner";
    }
  };

  const handleStartLesson = (lessonId: number) => {
    if (isLessonAvailable(lessonId)) {
      onStartLesson(cardId, lessonId);
    }
  };

  const goBack = () => {
    setScreen("Home");
  };

  const handleLessonSelect = (lessonId: number) => {
    // Check if previous lessons are completed
    if (lessonId > 1 && !completedLessons.includes(lessonId - 1)) {
      alert(
        "Oldingi darsni yakunlab bo'lmaguningizcha bu darsni boshlashingiz mumkin emas!"
      );
      return;
    }

    setSelectedLesson(lessonId);
    setSelectedStep(null);
    const lessonWords = getWordsByCardAndLesson(cardId, lessonId);
    setWords(lessonWords);
  };

  const handleStepSelect = (stepId: number) => {
    setSelectedStep(stepId);

    // GameState ni boshlang'ich holatga keltirish
    setGameState({
      currentStage:
        stepId === 1
          ? "memorize"
          : stepId === 2
          ? "match"
          : stepId === 3
          ? "arrange"
          : "write",
      currentWordIndex: 0,
      score: 0,
      mistakes: 0,
      completedWords: [],
      matchedPairs: [],
      selectedEnglishWord: null,
      selectedUzbekWord: null,
      arrangedLetters: stepId === 3 ? shuffleWord(words[0]?.english || "") : [],
      stageProgress: {
        memorize: lessonProgress[selectedLesson || 1] >= 25 ? 100 : 0,
        match: lessonProgress[selectedLesson || 1] >= 50 ? 100 : 0,
        arrange: lessonProgress[selectedLesson || 1] >= 75 ? 100 : 0,
        write: lessonProgress[selectedLesson || 1] >= 100 ? 100 : 0,
      },
      shuffledLetters: [],
      completed: false,
    });

    // So'z variantlarini generatsiya qilish
    if (stepId === 1 && words.length > 0) {
      setOptions(generateOptions(words[0].uzbek, words));
    }
  };

  // So'zni tarqatib yuborish
  const shuffleWord = (word: string): string[] => {
    return word.split("").sort(() => Math.random() - 0.5);
  };

  // MemorizeStage uchun variant tanlash
  const handleOptionSelect = (selectedOption: string) => {
    const currentWord = words[gameState.currentWordIndex];

    if (currentWord && currentWord.uzbek === selectedOption) {
      // To'g'ri javob berdingiz
      handleCorrectAnswer();
    } else {
      // Noto'g'ri javob berdingiz
      handleWrongAnswer();
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
    const currentWord = words[gameState.currentWordIndex];

    // Harfni o'chirish va arranged qismiga qo'shish
    const newArrangedLetters = [...gameState.arrangedLetters];
    newArrangedLetters.splice(index, 1);

    // Tuzilgan so'zni tekshirish
    const arrangedWord = gameState.arrangedLetters.join("");

    if (arrangedWord === currentWord.english) {
      // So'z to'g'ri tuzildi
      handleCorrectAnswer();
    } else if (gameState.arrangedLetters.length === 0) {
      // Harflar tugadi, lekin so'z noto'g'ri
      handleWrongAnswer();
      // Yangi so'z uchun harflarni aralashtirish
      setGameState((prev) => ({
        ...prev,
        arrangedLetters: shuffleWord(currentWord.english),
      }));
    }
  };

  // WriteStage uchun kiritilgan javobni tekshirish
  const handleWriteSubmit = () => {
    const currentWord = words[gameState.currentWordIndex];

    if (
      writeAnswer.trim().toLowerCase() === currentWord.english.toLowerCase()
    ) {
      // To'g'ri yozildi
      handleCorrectAnswer();
      setWriteAnswer(""); // Input ni tozalash
    } else {
      // Noto'g'ri yozildi
      handleWrongAnswer();
    }
  };

  // To'g'ri javob uchun
  const handleCorrectAnswer = () => {
    setGameState((prev) => {
      // Bosqichni yangilash
      let newState = {
        ...prev,
        score: prev.score + 1,
        completedWords: [
          ...prev.completedWords,
          words[prev.currentWordIndex].id,
        ],
      };

      const availableWords = words.slice(0, 10); // Har darsda 10 ta so'z

      // So'zlar tugadimi?
      if (prev.currentWordIndex < availableWords.length - 1) {
        // Keyingi so'zga o'tish
        const nextIndex = prev.currentWordIndex + 1;

        // Keyingi so'z uchun variantlarni yangilash
        if (prev.currentStage === "memorize") {
          setOptions(
            generateOptions(availableWords[nextIndex].uzbek, availableWords)
          );
        } else if (prev.currentStage === "arrange") {
          newState.arrangedLetters = shuffleWord(
            availableWords[nextIndex].english
          );
        }

        return {
          ...newState,
          currentWordIndex: nextIndex,
          mistakes: 0,
        };
      } else {
        // Bosqich tugadi
        const progressUpdate = { ...prev.stageProgress };

        // Bosqich progressini 100% ga o'rnatish
        if (prev.currentStage === "memorize") {
          progressUpdate.memorize = 100;

          // Bosqichni yakunlash va progress saqlash
          updateLessonProgress(25);
        } else if (prev.currentStage === "match") {
          progressUpdate.match = 100;

          // Bosqichni yakunlash va progress saqlash
          updateLessonProgress(50);
        } else if (prev.currentStage === "arrange") {
          progressUpdate.arrange = 100;

          // Bosqichni yakunlash va progress saqlash
          updateLessonProgress(75);
        } else if (prev.currentStage === "write") {
          progressUpdate.write = 100;

          // Bosqichni yakunlash va progress saqlash
          updateLessonProgress(100);
        }

        return {
          ...newState,
          stageProgress: progressUpdate,
          currentStage: "stages",
          currentWordIndex: 0,
        };
      }
    });
  };

  // Dars progress foizini yangilash
  const updateLessonProgress = (percentage: number) => {
    if (selectedLesson) {
      // Agar joriy progress foizi yangi foizdan past bo'lsa, yangilash
      if (lessonProgress[selectedLesson] < percentage) {
        const newProgress = { ...lessonProgress };
        newProgress[selectedLesson] = percentage;
        setLessonProgress(newProgress);

        // Progress ni saqlash
        saveProgress();

        // Foydalanuvchiga xabar berish
        alert(`Bosqich muvaffaqiyatli yakunlandi! Progress: ${percentage}%`);

        // Bosqich ekraniga qaytish
        setSelectedStep(null);
      }
    }
  };

  // Noto'g'ri javob uchun
  const handleWrongAnswer = () => {
    setGameState((prev: GameState) => {
      const newMistakes = prev.mistakes + 1;

      // 3 ta xatodan ko'p qilsa, keyingi so'zga o'tkazamiz
      if (newMistakes >= 3) {
        const availableWords = words.slice(0, 10);

        if (prev.currentWordIndex < availableWords.length - 1) {
          // Keyingi so'zga o'tish
          const nextIndex = prev.currentWordIndex + 1;

          // Keyingi so'z uchun variantlarni yangilash
          if (prev.currentStage === "memorize") {
            setOptions(
              generateOptions(availableWords[nextIndex].uzbek, availableWords)
            );
          } else if (prev.currentStage === "arrange") {
            return {
              ...prev,
              currentWordIndex: nextIndex,
              mistakes: 0,
              arrangedLetters: shuffleWord(availableWords[nextIndex].english),
            };
          }

          return {
            ...prev,
            currentWordIndex: nextIndex,
            mistakes: 0,
          };
        } else {
          // So'zlar tugadi - bosqichni tugatish
          return {
            ...prev,
            currentStage: "stages",
            currentWordIndex: 0,
            mistakes: 0,
          };
        }
      }

      return {
        ...prev,
        mistakes: newMistakes,
      };
    });
  };

  // Bosqichlar uchun funksiyalar
  const generateOptions = (
    correctUzbek: string,
    allWords: Word[]
  ): string[] => {
    const options = [correctUzbek];
    const availableWords = allWords.filter((w) => w.uzbek !== correctUzbek);

    // 3 ta noto'g'ri variantlarni qo'shish
    for (let i = 0; i < 3 && availableWords.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      options.push(availableWords[randomIndex].uzbek);
      availableWords.splice(randomIndex, 1);
    }

    // Variantlarni aralashtirish
    return options.sort(() => Math.random() - 0.5);
  };

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);

      // Add 5 coins
      addCoins(5);

      // Update progress to 100%
      const newProgress = { ...lessonProgress };
      newProgress[lessonId] = 100;
      setLessonProgress(newProgress);

      saveProgress();

      alert(
        "Tabriklaymiz! Darsni muvaffaqiyatli yakunladingiz. +5 coins qo'shildi!"
      );
    }
  };

  const markWordLearned = (wordId: string) => {
    if (!learnedWords.includes(wordId)) {
      const newLearnedWords = [...learnedWords, wordId];
      setLearnedWords(newLearnedWords);

      // Update progress
      if (selectedLesson) {
        const lessonWordsCount = getWordsByCardAndLesson(
          cardId,
          selectedLesson
        ).length;
        const learnedWordsInLesson = newLearnedWords.filter((id) =>
          id.startsWith(`${cardId}-${selectedLesson}`)
        ).length;

        const progress = Math.floor(
          (learnedWordsInLesson / lessonWordsCount) * 100
        );
        const newProgress = { ...lessonProgress };
        newProgress[selectedLesson] = progress;
        setLessonProgress(newProgress);

        saveProgress();
      }
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem(
        `progress_card_${cardId}`,
        JSON.stringify(lessonProgress)
      );
      await AsyncStorage.setItem(
        `completed_lessons_card_${cardId}`,
        JSON.stringify(completedLessons)
      );
      await AsyncStorage.setItem(
        `learned_words_card_${cardId}`,
        JSON.stringify(learnedWords)
      );
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#3C5BFF" }} />;
  }

  // Generate lessons for the card
  const lessons = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `${i + 1}-dars`,
    words: getWordsByCardAndLesson(cardId, i + 1),
  }));

  // MemorizeStage komponenti - birinchi bosqich
  const MemorizeStage = ({ words, onComplete }) => {
    return (
      <View style={styles.gameContent}>
        <ScrollView>
          {words.map((word, index) => (
            <View key={word.id} style={styles.wordCard}>
              <Text style={styles.englishWord}>{word.english}</Text>
              <Text style={styles.transcription}>{word.transcription}</Text>
              <Text style={styles.uzbekWord}>{word.uzbek}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.nextStepButton}
          onPress={() => onComplete()}
        >
          <Text style={styles.nextStepButtonText}>
            Keyingi bosqichga o'tish
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // MatchStage komponenti - ikkinchi bosqich
  const MatchStage = ({ words, onComplete, onBack }) => {
    const [englishWords, setEnglishWords] = useState([]);
    const [uzbekWords, setUzbekWords] = useState([]);
    const [selectedEnglish, setSelectedEnglish] = useState(null);
    const [selectedUzbek, setSelectedUzbek] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);

    useEffect(() => {
      // So'zlarni shuffle qilish
      const shuffledEnglish = [...words].sort(() => Math.random() - 0.5);
      const shuffledUzbek = [...words].sort(() => Math.random() - 0.5);

      setEnglishWords(shuffledEnglish);
      setUzbekWords(shuffledUzbek);
    }, [words]);

    const handleEnglishSelect = (word) => {
      setSelectedEnglish(word);

      if (selectedUzbek) {
        // Tekshirish
        if (word.english === selectedUzbek.english) {
          // To'g'ri juftlik
          setMatchedPairs([...matchedPairs, word]);

          // Barcha so'zlar juftlashtirildi
          if (matchedPairs.length + 1 === words.length) {
            // Bosqich tugadi
            onComplete();
          }
        }

        // Resetlash
        setSelectedEnglish(null);
        setSelectedUzbek(null);
      }
    };

    const handleUzbekSelect = (word) => {
      setSelectedUzbek(word);

      if (selectedEnglish) {
        // Tekshirish
        if (word.english === selectedEnglish.english) {
          // To'g'ri juftlik
          setMatchedPairs([...matchedPairs, word]);

          // Barcha so'zlar juftlashtirildi
          if (matchedPairs.length + 1 === words.length) {
            // Bosqich tugadi
            onComplete();
          }
        }

        // Resetlash
        setSelectedEnglish(null);
        setSelectedUzbek(null);
      }
    };

    return (
      <View style={styles.gameContent}>
        <View style={styles.matchContainer}>
          <View style={styles.matchColumnsContainer}>
            <View style={styles.matchColumn}>
              <Text style={styles.matchColumnTitle}>Inglizcha</Text>
              {englishWords.map((word, index) => (
                <TouchableOpacity
                  key={`eng-${index}`}
                  style={[
                    styles.matchWord,
                    selectedEnglish === word && styles.matchWordSelected,
                    matchedPairs.includes(word) && styles.matchWordMatched,
                  ]}
                  onPress={() =>
                    !matchedPairs.includes(word) && handleEnglishSelect(word)
                  }
                  disabled={matchedPairs.includes(word)}
                >
                  <Text style={styles.matchWordText}>{word.english}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.matchColumn}>
              <Text style={styles.matchColumnTitle}>O'zbekcha</Text>
              {uzbekWords.map((word, index) => (
                <TouchableOpacity
                  key={`uzb-${index}`}
                  style={[
                    styles.matchWord,
                    selectedUzbek === word && styles.matchWordSelected,
                    matchedPairs.includes(word) && styles.matchWordMatched,
                  ]}
                  onPress={() =>
                    !matchedPairs.includes(word) && handleUzbekSelect(word)
                  }
                  disabled={matchedPairs.includes(word)}
                >
                  <Text style={styles.matchWordText}>{word.uzbek}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.nextStepButton} onPress={onBack}>
            <Text style={styles.nextStepButtonText}>Orqaga qaytish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ArrangeStage komponenti - uchinchi bosqich
  const ArrangeStage = ({ words, onComplete, onBack }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [arrangedLetters, setArrangedLetters] = useState([]);
    const [shuffledLetters, setShuffledLetters] = useState([]);

    useEffect(() => {
      if (words && words.length > 0) {
        resetWord();
      }
    }, [words, currentWordIndex]);

    const resetWord = () => {
      const currentWord = words[currentWordIndex].english;
      // So'zni harflarga ajratib, aralashtirish
      const shuffled = currentWord.split("").sort(() => Math.random() - 0.5);

      setShuffledLetters(shuffled);
      setArrangedLetters([]);
    };

    const handleSelectLetter = (letter, index) => {
      // Harfni shuffled arraydan olib tashlash
      const newShuffled = [...shuffledLetters];
      newShuffled.splice(index, 1);
      setShuffledLetters(newShuffled);

      // Harfni arranged arrayga qo'shish
      setArrangedLetters([...arrangedLetters, letter]);

      // So'z to'liq tuzilgani tekshirish
      if (newShuffled.length === 0) {
        // Tuzilgan so'z tekshirish
        const arrangedWord = [...arrangedLetters, letter].join("");
        if (arrangedWord === words[currentWordIndex].english) {
          // To'g'ri tuzildi
          if (currentWordIndex < words.length - 1) {
            // Keyingi so'zga o'tish
            setTimeout(() => {
              setCurrentWordIndex(currentWordIndex + 1);
            }, 1000);
          } else {
            // Barcha so'zlar tuzildi
            onComplete();
          }
        } else {
          // Noto'g'ri tuzildi, qayta boshlash
          resetWord();
        }
      }
    };

    const handleResetArranged = () => {
      resetWord();
    };

    if (!words || words.length === 0) {
      return (
        <View>
          <Text>So'z topilmadi</Text>
        </View>
      );
    }

    return (
      <View style={styles.gameContent}>
        <View style={styles.arrangeContainer}>
          <Text style={styles.practiceWord}>
            {words[currentWordIndex].uzbek}
          </Text>

          <View style={styles.targetWordContainer}>
            {arrangedLetters.map((letter, index) => (
              <View key={`arranged-${index}`} style={styles.wordSlot}>
                <Text style={styles.letterText}>{letter}</Text>
              </View>
            ))}

            {shuffledLetters.length > 0 &&
              Array(shuffledLetters.length)
                .fill(null)
                .map((_, index) => (
                  <View key={`empty-${index}`} style={styles.wordSlot}>
                    <Text style={styles.letterText}></Text>
                  </View>
                ))}
          </View>

          <View style={styles.lettersContainer}>
            {shuffledLetters.map((letter, index) => (
              <TouchableOpacity
                key={`letter-${index}`}
                style={styles.letterButton}
                onPress={() => handleSelectLetter(letter, index)}
              >
                <Text style={{ color: "white", fontSize: 20 }}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {arrangedLetters.length > 0 && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetArranged}
            >
              <Text style={{ color: "white" }}>Qayta boshlash</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.nextStepButton, { marginTop: 20 }]}
            onPress={onBack}
          >
            <Text style={styles.nextStepButtonText}>Orqaga qaytish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // PracticeStage komponenti - ikkinchi bosqich
  const PracticeStage = ({ words, onComplete, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);

    const handleNextWord = () => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowTranslation(false);
      } else {
        onComplete();
      }
    };

    const handlePrevWord = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowTranslation(false);
      } else {
        onBack();
      }
    };

    return (
      <View style={styles.gameContent}>
        <View style={styles.practiceCard}>
          <View style={styles.practiceProgress}>
            <Text style={styles.practiceProgressText}>
              {currentIndex + 1}/{words.length}
            </Text>
          </View>

          <Text style={styles.practiceWord}>{words[currentIndex].english}</Text>
          <Text style={styles.practiceTranscription}>
            {words[currentIndex].transcription}
          </Text>

          {showTranslation ? (
            <Text style={styles.practiceTranslation}>
              {words[currentIndex].uzbek}
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.showTranslationButton}
              onPress={() => setShowTranslation(true)}
            >
              <Text style={styles.showTranslationButtonText}>
                Tarjimasini ko'rish
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.practiceNavigation}>
            <TouchableOpacity
              style={[styles.practiceNavButton, styles.practiceNavButtonPrev]}
              onPress={handlePrevWord}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#FFF" />
              <Text style={styles.practiceNavButtonText}>Oldingi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.practiceNavButton, styles.practiceNavButtonNext]}
              onPress={handleNextWord}
            >
              <Text style={styles.practiceNavButtonText}>Keyingi</Text>
              <FontAwesome5 name="arrow-right" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // TestStage komponenti - uchunchi bosqich
  const TestStage = ({ words, onComplete, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [options, setOptions] = useState([]);

    useEffect(() => {
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const getRandomOptions = () => {
        const correctAnswer = words[currentQuestion].uzbek;
        const otherWords = words
          .filter((word) => word.uzbek !== correctAnswer)
          .map((word) => word.uzbek);
        const shuffledWords = shuffleArray(otherWords);
        const wrongOptions = shuffledWords.slice(0, 3);
        const allOptions = shuffleArray([...wrongOptions, correctAnswer]);
        return allOptions;
      };

      setOptions(getRandomOptions());
      setSelectedOption(null);
      setIsCorrect(null);
    }, [currentQuestion, words]);

    const handleAnswer = (option) => {
      setSelectedOption(option);
      const correct = option === words[currentQuestion].uzbek;
      setIsCorrect(correct);

      if (correct) {
        setScore(score + 1);
      }

      setTimeout(() => {
        if (currentQuestion < words.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          onComplete(score + (correct ? 1 : 0), words.length);
        }
      }, 1000);
    };

    return (
      <View style={styles.gameContent}>
        <View style={styles.testContainer}>
          <View style={styles.testProgress}>
            <TouchableOpacity style={styles.testBackButton} onPress={onBack}>
              <FontAwesome5 name="arrow-left" size={16} color="#3C5BFF" />
              <Text style={styles.testBackButtonText}>Orqaga</Text>
            </TouchableOpacity>
            <Text style={styles.testProgressText}>
              {currentQuestion + 1}/{words.length}
            </Text>
          </View>

          <Text style={styles.testQuestion}>
            "{words[currentQuestion].english}" so'zining tarjimasi qaysi?
          </Text>

          <View style={styles.testOptions}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.testOption,
                  selectedOption === option &&
                    (isCorrect
                      ? styles.testOptionCorrect
                      : styles.testOptionWrong),
                ]}
                onPress={() => handleAnswer(option)}
                disabled={selectedOption !== null}
              >
                <Text
                  style={[
                    styles.testOptionText,
                    selectedOption === option &&
                      isCorrect &&
                      styles.testOptionTextCorrect,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.testScore}>
            <Text style={styles.testScoreText}>
              Natija: {score}/{currentQuestion}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ResultStage komponenti - natijalar bosqichi
  const ResultStage = ({ score, onPlayAgain, onNext }) => {
    return (
      <View style={styles.gameContent}>
        <View style={styles.resultContainer}>
          <FontAwesome5 name="trophy" size={60} color="#FFD700" />
          <Text style={styles.resultTitle}>Tabriklaymiz!</Text>
          <Text style={styles.resultScore}>Siz {score} ball to'pladingiz</Text>
          <Text style={styles.resultMessage}>
            Siz bu darsni muvaffaqiyatli yakunladingiz va 5 ta yangi so'z
            o'rgandingiz!
          </Text>

          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={[styles.resultButton, styles.resultButtonSecondary]}
              onPress={onPlayAgain}
            >
              <Text style={styles.resultButtonSecondaryText}>
                Qayta o'ynash
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultButton, styles.resultButtonPrimary]}
              onPress={onNext}
            >
              <Text style={styles.resultButtonPrimaryText}>Davom etish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // O'yin bosqichlarini render qilish
  const renderGameStage = () => {
    if (gameState.currentStage === "memorize") {
      return (
        <MemorizeStage
          words={words}
          onComplete={() => {
            setGameState({
              ...gameState,
              currentStage: "match",
              currentWordIndex: 0,
              stageProgress: {
                ...gameState.stageProgress,
                memorize: 100,
              },
            });
            // Bosqichni yakunlash va progress saqlash
            updateLessonProgress(25);
          }}
        />
      );
    } else if (gameState.currentStage === "match") {
      return (
        <MatchStage
          words={words}
          onComplete={() => {
            setGameState({
              ...gameState,
              currentStage: "arrange",
              currentWordIndex: 0,
              stageProgress: {
                ...gameState.stageProgress,
                match: 100,
              },
            });
            // Bosqichni yakunlash va progress saqlash
            updateLessonProgress(50);
          }}
          onBack={() => {
            setGameState({
              ...gameState,
              currentStage: "memorize",
              currentWordIndex: 0,
            });
          }}
        />
      );
    } else if (gameState.currentStage === "arrange") {
      return (
        <ArrangeStage
          words={words}
          onComplete={() => {
            setGameState({
              ...gameState,
              currentStage: "write",
              currentWordIndex: 0,
              stageProgress: {
                ...gameState.stageProgress,
                arrange: 100,
              },
            });
            // Bosqichni yakunlash va progress saqlash
            updateLessonProgress(75);
          }}
          onBack={() => {
            setGameState({
              ...gameState,
              currentStage: "match",
              currentWordIndex: 0,
            });
          }}
        />
      );
    } else if (gameState.currentStage === "write") {
      return (
        <WriteStage
          words={words}
          onComplete={() => {
            setGameState({
              ...gameState,
              currentStage: "complete",
              currentWordIndex: 0,
              stageProgress: {
                ...gameState.stageProgress,
                write: 100,
              },
            });
            // Bosqichni yakunlash va progress saqlash
            updateLessonProgress(100);
            // Darsni yakunlash
            if (selectedLesson) {
              markLessonComplete(selectedLesson);
            }
          }}
          onBack={() => {
            setGameState({
              ...gameState,
              currentStage: "arrange",
              currentWordIndex: 0,
            });
          }}
        />
      );
    } else {
      return (
        <ResultStage
          score={gameState.score}
          onPlayAgain={() => {
            setGameState({
              ...gameState,
              currentStage: "memorize",
              currentWordIndex: 0,
              score: 0,
              mistakes: 0,
              completedWords: [],
              matchedPairs: [],
              selectedEnglishWord: null,
              selectedUzbekWord: null,
              arrangedLetters: [],
            });
          }}
          onNext={() => setSelectedStep(null)}
        />
      );
    }
  };

  // WriteStage komponenti - to'rtinchi bosqich
  const WriteStage = ({ words, onComplete, onBack }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [mistakes, setMistakes] = useState(0);

    const handleSubmit = () => {
      if (
        inputValue.trim().toLowerCase() ===
        words[currentWordIndex].english.toLowerCase()
      ) {
        // To'g'ri javob
        if (currentWordIndex < words.length - 1) {
          // Keyingi so'zga o'tish
          setCurrentWordIndex(currentWordIndex + 1);
          setInputValue("");
          setMistakes(0);
        } else {
          // Barcha so'zlar to'g'ri yozildi
          onComplete();
        }
      } else {
        // Noto'g'ri javob
        setMistakes(mistakes + 1);

        if (mistakes >= 2) {
          // 3 marta xato qilindi, javobni ko'rsatish
          setInputValue(words[currentWordIndex].english);

          // 2 soniya kutib, keyingi so'zga o'tish
          setTimeout(() => {
            if (currentWordIndex < words.length - 1) {
              setCurrentWordIndex(currentWordIndex + 1);
              setInputValue("");
              setMistakes(0);
            } else {
              onComplete();
            }
          }, 2000);
        }
      }
    };

    if (!words || words.length === 0) {
      return (
        <View>
          <Text>So'z topilmadi</Text>
        </View>
      );
    }

    return (
      <View style={styles.gameContent}>
        <View style={styles.writeContainer}>
          <Text style={styles.practiceWord}>
            {words[currentWordIndex].uzbek}
          </Text>
          <Text style={styles.transcription}>
            {words[currentWordIndex].transcription}
          </Text>

          <View style={styles.writeInputContainer}>
            <TextInput
              style={styles.writeInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="So'zni ingliz tilida yozing..."
              placeholderTextColor="#999"
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <FontAwesome5 name="check" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.mistakesContainer}>
            {[0, 1, 2].map((_, index) => (
              <View
                key={`mistake-${index}`}
                style={[
                  styles.mistakeIndicator,
                  index < mistakes && styles.mistakeActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.nextStepButton, { marginTop: 30 }]}
            onPress={onBack}
          >
            <Text style={styles.nextStepButtonText}>Orqaga qaytish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.levelTitle}>{getLevelTitle(cardId)}</Text>
            <Text style={styles.dateText}>Bu kun: {currentDate}</Text>
          </View>
        </View>
        <View style={styles.coinsContainer}>
          <FontAwesome5 name="bitcoin" size={20} color="#FFD700" />
          <Text style={styles.coinsText}>{coins}</Text>
        </View>
      </View>

      {selectedLesson !== null ? (
        <View style={styles.lessonContainer}>
          <View style={styles.lessonHeader}>
            <TouchableOpacity
              style={styles.backToLessons}
              onPress={() => setSelectedLesson(null)}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#3C5BFF" />
              <Text style={styles.backToLessonsText}>Darslar</Text>
            </TouchableOpacity>
            <Text style={styles.lessonHeaderTitle}>{selectedLesson}-dars</Text>
          </View>

          {/* LessonGame style stage cards */}
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.stageCardsList}>
              <TouchableOpacity
                style={styles.stageCardItem}
                onPress={() => handleStepSelect(1)}
              >
                <View style={styles.stageIconContainer}>
                  <FontAwesome5 name="brain" size={18} color="#3C5BFF" />
                </View>
                <Text style={styles.stageCardTitle}>So'zlarni yodlash</Text>
                <Text style={styles.stageCardCounter}>0/20</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stageCardItem}
                onPress={() => handleStepSelect(2)}
              >
                <View style={styles.stageIconContainer}>
                  <FontAwesome5 name="sync" size={18} color="#3C5BFF" />
                </View>
                <Text style={styles.stageCardTitle}>So'zlarni takrorlash</Text>
                <Text style={styles.stageCardCounter}>0/20</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stageCardItem}
                onPress={() => handleStepSelect(3)}
              >
                <View style={styles.stageIconContainer}>
                  <FontAwesome5 name="exchange-alt" size={18} color="#3C5BFF" />
                </View>
                <Text style={styles.stageCardTitle}>
                  So'zlarni mustahkamlash
                </Text>
                <Text style={styles.stageCardCounter}>0/20</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stageCardItem}
                onPress={() => handleStepSelect(4)}
              >
                <View style={styles.stageIconContainer}>
                  <FontAwesome5 name="pen" size={18} color="#3C5BFF" />
                </View>
                <Text style={styles.stageCardTitle}>So'zlarni yozish</Text>
                <Text style={styles.stageCardCounter}>0/20</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wordsListContainer}>
              <Text style={styles.wordsListTitle}>O'rganiladigan so'zlar</Text>
              {words.map((word, index) => (
                <View key={word.id} style={styles.wordListItem}>
                  <Text style={styles.wordIndex}>{index + 1}.</Text>
                  <Text style={styles.wordEnglish}>{word.english}</Text>
                  <Text style={styles.wordUzbek}>{word.uzbek}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : selectedStep !== null ? (
        <View style={styles.stepContentContainer}>
          <View style={styles.stepHeader}>
            <TouchableOpacity
              style={styles.backToLessons}
              onPress={() => setSelectedStep(null)}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#3C5BFF" />
              <Text style={styles.backToLessonsText}>
                {selectedLesson}-dars
              </Text>
            </TouchableOpacity>
            <Text style={styles.stepHeaderTitle}>
              {selectedStep === 1
                ? "O'rganish"
                : selectedStep === 2
                ? "Mustahkamlash"
                : selectedStep === 3
                ? "Test"
                : "Natijalar"}
            </Text>
          </View>

          <View style={styles.stepContent}>{renderGameStage()}</View>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.lessonCardsContainer}>
            {lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonCard,
                  !isLessonAvailable(lesson.id) && styles.disabledCard,
                ]}
                onPress={() => handleLessonSelect(lesson.id)}
                disabled={!isLessonAvailable(lesson.id)}
              >
                {!isLessonAvailable(lesson.id) && (
                  <View style={styles.lockedBadge}>
                    <FontAwesome5 name="lock" size={14} color="white" />
                  </View>
                )}

                <View style={styles.lessonCardContent}>
                  <View style={styles.lessonHeader}>
                    <View style={styles.lessonTitleContainer}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonProgress}>
                        {getLessonProgressPercentage(lesson.id)}%
                      </Text>
                    </View>

                    {isLessonCompleted(lesson.id) && (
                      <View style={styles.completedBadge}>
                        <FontAwesome5 name="check" size={14} color="white" />
                      </View>
                    )}
                  </View>

                  {isLessonAvailable(lesson.id) && (
                    <View style={styles.lessonCoinsBadge}>
                      <FontAwesome5 name="bitcoin" size={14} color="#FFD700" />
                      <Text style={styles.lessonCoinsText}>+5</Text>
                    </View>
                  )}

                  {/* Learning Stages */}
                  <View style={styles.stagesContainer}>
                    <View style={styles.stagesRow}>
                      <View style={styles.stageItem}>
                        <View
                          style={[
                            styles.stageCircle,
                            getLessonProgressPercentage(lesson.id) >= 25 &&
                              styles.completedStage,
                            !isLessonAvailable(lesson.id) &&
                              styles.lockedStageCircle,
                          ]}
                        >
                          <FontAwesome5
                            name="book-reader"
                            size={14}
                            color={
                              !isLessonAvailable(lesson.id)
                                ? "#9E9E9E"
                                : "white"
                            }
                          />
                        </View>
                        <Text style={styles.stageText}>1</Text>
                      </View>
                      <View
                        style={[
                          styles.stageLine,
                          !isLessonAvailable(lesson.id) &&
                            styles.lockedStageLine,
                        ]}
                      />
                      <View style={styles.stageItem}>
                        <View
                          style={[
                            styles.stageCircle,
                            getLessonProgressPercentage(lesson.id) >= 50 &&
                              styles.completedStage,
                            !isLessonAvailable(lesson.id) &&
                              styles.lockedStageCircle,
                          ]}
                        >
                          <FontAwesome5
                            name="sync"
                            size={14}
                            color={
                              !isLessonAvailable(lesson.id)
                                ? "#9E9E9E"
                                : "white"
                            }
                          />
                        </View>
                        <Text style={styles.stageText}>2</Text>
                      </View>
                      <View
                        style={[
                          styles.stageLine,
                          !isLessonAvailable(lesson.id) &&
                            styles.lockedStageLine,
                        ]}
                      />
                      <View style={styles.stageItem}>
                        <View
                          style={[
                            styles.stageCircle,
                            getLessonProgressPercentage(lesson.id) >= 75 &&
                              styles.completedStage,
                            !isLessonAvailable(lesson.id) &&
                              styles.lockedStageCircle,
                          ]}
                        >
                          <FontAwesome5
                            name="check-square"
                            size={14}
                            color={
                              !isLessonAvailable(lesson.id)
                                ? "#9E9E9E"
                                : "white"
                            }
                          />
                        </View>
                        <Text style={styles.stageText}>3</Text>
                      </View>
                      <View
                        style={[
                          styles.stageLine,
                          !isLessonAvailable(lesson.id) &&
                            styles.lockedStageLine,
                        ]}
                      />
                      <View style={styles.stageItem}>
                        <View
                          style={[
                            styles.stageCircle,
                            getLessonProgressPercentage(lesson.id) >= 100 &&
                              styles.completedStage,
                            !isLessonAvailable(lesson.id) &&
                              styles.lockedStageCircle,
                          ]}
                        >
                          <FontAwesome5
                            name="pen"
                            size={14}
                            color={
                              !isLessonAvailable(lesson.id)
                                ? "#9E9E9E"
                                : "white"
                            }
                          />
                        </View>
                        <Text style={styles.stageText}>4</Text>
                      </View>
                    </View>
                  </View>

                  {/* Words Progress */}
                  <View style={styles.wordsContainer}>
                    <Text style={styles.wordsTitle}>
                      O'rganiladigan so'zlar
                    </Text>
                    <View style={styles.wordsProgressContainer}>
                      <Text style={styles.wordsProgressText}>
                        {Math.floor(
                          (lesson.words.length *
                            getLessonProgressPercentage(lesson.id)) /
                            100
                        )}
                        /{lesson.words.length}
                      </Text>
                      <View style={styles.wordsProgressBar}>
                        <View
                          style={[
                            styles.wordsProgressFill,
                            {
                              width: `${getLessonProgressPercentage(
                                lesson.id
                              )}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setScreen("Home")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5 name="home" size={22} color="#9E9E9E" />
          </View>
          <Text style={styles.navText}>Asosiy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setScreen("Lessons")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5 name="book-reader" size={22} color="#9E9E9E" />
          </View>
          <Text style={styles.navText}>Darslarim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <FontAwesome5 name="graduation-cap" size={22} color="#9E9E9E" />
          </View>
          <Text style={styles.navText}>Kurslar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setScreen("Dictionary")}
        >
          <View style={styles.navIconContainer}>
            <FontAwesome5 name="book" size={22} color="#9E9E9E" />
          </View>
          <Text style={styles.navText}>Lug'at</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flexDirection: "column",
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Lexend_400Regular",
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
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
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Lexend_400Regular",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lessonCardsContainer: {
    marginBottom: 20,
  },
  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  disabledCard: {
    opacity: 0.8,
  },
  lessonCardContent: {
    padding: 20,
  },
  lockedBadge: {
    backgroundColor: "#9E9E9E",
    borderRadius: 12,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  lessonTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Lexend_400Regular",
    marginRight: 10,
  },
  lessonProgress: {
    fontSize: 14,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
  },
  completedBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 4,
    marginLeft: "auto",
  },
  lessonCoinsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  lessonCoinsText: {
    color: "#FFFFFF",
    marginLeft: 3,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Lexend_400Regular",
  },
  stagesContainer: {
    marginBottom: 20,
  },
  stagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageCards: {
    marginBottom: 20,
  },
  stageItem: {
    alignItems: "center",
  },
  stageCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E6DEF5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  completedStage: {
    backgroundColor: "#4CAF50",
  },
  stageText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E6DEF5",
    alignSelf: "center",
    marginTop: -15,
  },
  wordsContainer: {
    marginTop: 20,
  },
  wordsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Lexend_400Regular",
  },
  wordsProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordsProgressText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  wordsProgressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E6DEF5",
    borderRadius: 5,
    marginLeft: 10,
  },
  wordsProgressFill: {
    height: "100%",
    backgroundColor: "#4C2A86",
    borderRadius: 5,
  },
  wordsList: {
    marginBottom: 20,
  },
  wordItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  wordNumber: {
    fontSize: 14,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
    marginRight: 10,
  },
  wordEnglish: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  wordUzbek: {
    width: 100,
    fontSize: 16,
    color: "#666",
    textAlign: "right",
    fontFamily: "Lexend_400Regular",
  },
  stepContentContainer: {
    flex: 1,
    padding: 20,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
    fontFamily: "Lexend_400Regular",
  },
  stepContent: {
    flex: 1,
  },
  learnStepContainer: {
    flex: 1,
  },
  learnStepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "Lexend_400Regular",
  },
  wordCard: {
    backgroundColor: "#F0EAFB",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  englishWord: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4C2A86",
    marginBottom: 10,
  },
  transcription: {
    fontSize: 16,
    color: "#8661C1",
    marginBottom: 10,
  },
  uzbekWord: {
    fontSize: 20,
    color: "#333",
    fontWeight: "500",
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#4C2A86",
    backgroundColor: "#E6DEF5",
  },
  correctOption: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  wrongOption: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  nextStepButton: {
    backgroundColor: "#4C2A86",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  nextStepButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Match bosqichi uchun stillar
  matchContainer: {
    flex: 1,
    padding: 20,
  },
  matchColumnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  matchColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  matchColumnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  matchWord: {
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  matchWordSelected: {
    borderColor: "#6200EE",
  },
  matchWordMatched: {
    backgroundColor: "#D1F5D3",
    borderColor: "#4CAF50",
  },
  matchWordText: {
    fontSize: 16,
    color: "#333",
  },
  matchNextButton: {
    backgroundColor: "#6200EE",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  matchNextButtonDisabled: {
    backgroundColor: "#B39DDB",
  },
  matchNextButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  matchProgress: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },

  // Arrange bosqichi uchun stillar
  arrangeContainer: {
    marginTop: 20,
  },
  targetWordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
  },
  wordSlot: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E6DEF5",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "#8661C1",
  },
  letterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4C2A86",
  },
  lettersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4C2A86",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  usedLetterButton: {
    backgroundColor: "#BBBBBB",
  },
  resetButton: {
    backgroundColor: "#8661C1",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Write bosqichi uchun stillar
  writeContainer: {
    marginTop: 20,
  },
  writeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  writeInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#8661C1",
  },
  submitButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#4C2A86",
    alignItems: "center",
    justifyContent: "center",
  },
  mistakesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  mistakeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E6DEF5",
    marginHorizontal: 5,
  },
  mistakeActive: {
    backgroundColor: "#F44336",
  },

  // Progress indicator
  progressIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#F5F5F5",
  },
  progressStep: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6DEF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#8661C1",
  },
  progressStepCompleted: {
    backgroundColor: "#4C2A86",
    borderColor: "#4C2A86",
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#E6DEF5",
  },
  progressLineCompleted: {
    backgroundColor: "#4C2A86",
  },

  // QuizStage uchun stillar
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  quizProgress: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  quizQuestion: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  quizOptions: {
    marginBottom: 30,
  },
  quizOption: {
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 15,
  },
  quizOptionText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  quizScoreContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  quizScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200EE",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  navIconContainer: {
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: "#9E9E9E",
    fontFamily: "Lexend_400Regular",
  },
  lessonContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },

  backToLessons: {
    flexDirection: "row",
    alignItems: "center",
  },
  backToLessonsText: {
    marginLeft: 8,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
  },
  lessonHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Lexend_400Regular",
    marginLeft: "auto",
  },
  lockedStageCircle: {
    backgroundColor: "#E6DEF5",
    borderColor: "#E6DEF5",
  },
  lockedStageLine: {
    backgroundColor: "#E6DEF5",
  },

  // Game stages related styles
  gameContent: {
    flex: 1,
    padding: 16,
  },

  // PracticeStage stillar
  practiceCard: {
    backgroundColor: "#F0EAFB",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  practiceProgress: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  practiceProgressText: {
    fontSize: 16,
    color: "#4C2A86",
    fontWeight: "bold",
  },
  practiceWord: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4C2A86",
    textAlign: "center",
    marginBottom: 10,
  },
  practiceTranscription: {
    fontSize: 18,
    color: "#8661C1",
    textAlign: "center",
    marginBottom: 30,
  },
  practiceTranslation: {
    fontSize: 22,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  showTranslationButton: {
    backgroundColor: "#4C2A86",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  showTranslationButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  practiceNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  practiceNavButton: {
    backgroundColor: "#4C2A86",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  practiceNavButtonPrev: {
    backgroundColor: "#8661C1",
  },
  practiceNavButtonNext: {
    backgroundColor: "#4C2A86",
  },
  practiceNavButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },

  // TestStage stillar
  testContainer: {
    flex: 1,
  },
  testProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  testBackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  testBackButtonText: {
    fontSize: 16,
    color: "#3C5BFF",
    marginLeft: 8,
  },
  testProgressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4C2A86",
  },
  testQuestion: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  testOptions: {
    marginBottom: 30,
  },
  testOption: {
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  testOptionCorrect: {
    backgroundColor: "#D1F5D3",
    borderColor: "#4CAF50",
  },
  testOptionWrong: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  testOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  testOptionTextCorrect: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  testScore: {
    alignItems: "center",
    marginTop: 20,
  },
  testScoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4C2A86",
  },

  // ResultStage stillar
  resultContainer: {
    flex: 1,
    backgroundColor: "#F0EAFB",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4C2A86",
    marginTop: 20,
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 22,
    color: "#333",
    marginBottom: 15,
    fontWeight: "bold",
  },
  resultMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  resultButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  resultButton: {
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    minWidth: 140,
  },
  resultButtonPrimary: {
    backgroundColor: "#4C2A86",
  },
  resultButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4C2A86",
  },
  resultButtonPrimaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultButtonSecondaryText: {
    color: "#4C2A86",
    fontSize: 16,
    fontWeight: "bold",
  },

  // New styles for the new layout
  stageCardsList: {
    padding: 16,
  },
  stageCardItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stageIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stageCardTitle: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend_400Regular",
    fontWeight: "500",
  },
  stageCardCounter: {
    fontSize: 14,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
  },
  wordsListContainer: {
    padding: 16,
    paddingTop: 0,
  },
  wordsListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    fontFamily: "Lexend_400Regular",
  },
  wordListItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  wordIndex: {
    width: 30,
    fontSize: 16,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
});

export default SuggestedLessonsScreen;
