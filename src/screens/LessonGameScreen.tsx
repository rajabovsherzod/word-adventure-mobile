import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";
import progressService from "../services/progressService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Word = {
  id: string;
  english: string;
  uzbek: string;
};

const MAX_WORDS_PER_LESSON = 10;
const MAX_MISTAKES = 3;

// LessonId formatini to'g'irlash uchun helper funksiya
const formatLessonId = (lesson: any): string => {
  // Agar lessonId to'g'ri formatda bo'lsa qaytarish
  if (typeof lesson.id === "string" && lesson.id.includes("-")) {
    console.log("Lesson ID is already in correct format:", lesson.id);
    return lesson.id;
  }

  // Aks holda, to'g'ri formatga o'tkazish
  const level = lesson.level || 1;
  const lessonId = lesson.id || 1;
  const formattedId = `${level}-${lessonId}`;
  console.log(`Converting lesson ID from ${lesson.id} to ${formattedId}`);
  return formattedId;
};

type GameStage = "stages" | "memorize" | "match" | "arrange" | "write";

interface GameState {
  currentStage: GameStage;
  currentWordIndex: number;
  score: number;
  mistakes: number;
  completedWords: string[];
  matchedPairs: { english: string; uzbek: string }[];
  selectedEnglishWord: string | null;
  selectedUzbekWord: string | null;
  arrangedLetters: string[];
  selectedOption: string | null;
  overallProgress?: number;
  stageProgress: {
    memorize: {
      completed: boolean;
      completedWords: string[];
      remainingWords: string[];
    };
    match: {
      completed: boolean;
      progress: number;
    };
    arrange: {
      completed: boolean;
      completedWords: string[];
      remainingWords: string[];
    };
    write: {
      completed: boolean;
      completedWords: string[];
      remainingWords: string[];
    };
  };
}

type Props = {
  setScreen: (screen: string) => void;
  lesson: {
    id: string;
    name: string;
    words: Word[];
  };
};

const MOCK_WORDS: Word[] = [
  { id: "1", english: "hello", uzbek: "salom" },
  { id: "2", english: "world", uzbek: "dunyo" },
  { id: "3", english: "book", uzbek: "kitob" },
  { id: "4", english: "pen", uzbek: "ruchka" },
  { id: "5", english: "school", uzbek: "maktab" },
  { id: "6", english: "teacher", uzbek: "o'qituvchi" },
  { id: "7", english: "student", uzbek: "o'quvchi" },
  { id: "8", english: "friend", uzbek: "do'st" },
  { id: "9", english: "family", uzbek: "oila" },
  { id: "10", english: "house", uzbek: "uy" },
  { id: "11", english: "car", uzbek: "mashina" },
  { id: "12", english: "phone", uzbek: "telefon" },
  { id: "13", english: "computer", uzbek: "kompyuter" },
  { id: "14", english: "water", uzbek: "suv" },
  { id: "15", english: "food", uzbek: "ovqat" },
  { id: "16", english: "time", uzbek: "vaqt" },
  { id: "17", english: "day", uzbek: "kun" },
  { id: "18", english: "night", uzbek: "tun" },
  { id: "19", english: "sun", uzbek: "quyosh" },
  { id: "20", english: "moon", uzbek: "oy" },
];

// Memorize Stage Component
const MemorizeStage = ({
  word,
  options,
  onSelect,
  onNext,
  selectedOption,
}: {
  word: Word;
  options: string[];
  onSelect: (option: string) => void;
  onNext: () => void;
  selectedOption: string | null;
}) => {
  const isCorrect = selectedOption === word.uzbek;

  const getOptionStyle = (option: string) => {
    const isSelected = selectedOption === option;
    const isCorrectOption = option === word.uzbek;
    const showCorrect = selectedOption && isCorrectOption;

    const baseStyle = [
      styles.optionButton,
      { backgroundColor: "#F5F5F5", borderColor: "#E0E0E0" },
    ];

    if (isSelected && !isCorrect) {
      return [
        ...baseStyle,
        { backgroundColor: "#FF4D4D", borderColor: "#FF0000" },
      ];
    }
    if (showCorrect) {
      return [
        ...baseStyle,
        { backgroundColor: "#4CAF50", borderColor: "#45A049" },
      ];
    }
    return baseStyle;
  };

  const getTextStyle = (option: string) => {
    const isSelected = selectedOption === option;
    const isCorrectOption = option === word.uzbek;
    const showCorrect = selectedOption && isCorrectOption;

    const baseStyle = [styles.optionText, { color: "#333" }];

    if (isSelected && !isCorrect) {
      return [...baseStyle, { color: "white" }];
    }
    if (showCorrect) {
      return [...baseStyle, { color: "white" }];
    }
    return baseStyle;
  };

  return (
    <View style={styles.gameContent}>
      <Text style={styles.englishWord}>{word.english}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              ...getOptionStyle(option),
              index % 2 === 0 ? { marginRight: 10 } : {},
            ]}
            onPress={() => !selectedOption && onSelect(option)}
            disabled={selectedOption !== null}
          >
            <Text style={getTextStyle(option)}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedOption && styles.nextButtonDisabled,
        ]}
        onPress={onNext}
        disabled={!selectedOption}
      >
        <Text
          style={[
            styles.nextButtonText,
            !selectedOption && styles.nextButtonTextDisabled,
          ]}
        >
          Keyingi
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Match Stage Component
const MatchStage = ({
  words,
  matchedPairs,
  selectedEnglish,
  selectedUzbek,
  onSelectEnglish,
  onSelectUzbek,
  onMatch,
  onMismatch,
}: {
  words: Word[];
  matchedPairs: { english: string; uzbek: string }[];
  selectedEnglish: string | null;
  selectedUzbek: string | null;
  onSelectEnglish: (word: string) => void;
  onSelectUzbek: (word: string) => void;
  onMatch: (english: string, uzbek: string) => void;
  onMismatch: () => void;
}) => {
  const [isWrongMatch, setIsWrongMatch] = useState(false);
  const [shuffledEnglishWords, setShuffledEnglishWords] = useState<string[]>(
    []
  );
  const [shuffledUzbekWords, setShuffledUzbekWords] = useState<string[]>([]);

  useEffect(() => {
    if (shuffledEnglishWords.length === 0 && shuffledUzbekWords.length === 0) {
      const englishWords = words
        .map((w) => w.english)
        .sort(() => Math.random() - 0.5);
      const uzbekWords = words
        .map((w) => w.uzbek)
        .sort(() => Math.random() - 0.5);

      setShuffledEnglishWords(englishWords);
      setShuffledUzbekWords(uzbekWords);
    }
  }, []);

  useEffect(() => {
    if (selectedEnglish && selectedUzbek) {
      const matchedWord = words.find((w) => w.english === selectedEnglish);
      if (matchedWord && matchedWord.uzbek === selectedUzbek) {
        onMatch(selectedEnglish, selectedUzbek);
        setIsWrongMatch(false);
      } else {
        setIsWrongMatch(true);
        onMismatch();
        setTimeout(() => {
          setIsWrongMatch(false);
          onSelectEnglish(null);
          onSelectUzbek(null);
        }, 1000);
      }
    }
  }, [selectedEnglish, selectedUzbek]);

  return (
    <View style={styles.gameContent}>
      <View style={styles.matchContainer}>
        <View style={styles.englishWords}>
          {shuffledEnglishWords.map((english) => (
            <TouchableOpacity
              key={english}
              style={[
                styles.matchWord,
                selectedEnglish === english &&
                  !isWrongMatch &&
                  styles.selectedWord,
                matchedPairs.some((pair) => pair.english === english) &&
                  styles.matchedWord,
                isWrongMatch &&
                  selectedEnglish === english &&
                  styles.mismatchWord,
              ]}
              onPress={() =>
                !matchedPairs.some((pair) => pair.english === english) &&
                onSelectEnglish(english)
              }
              disabled={matchedPairs.some((pair) => pair.english === english)}
            >
              <Text
                style={[
                  styles.matchWordText,
                  selectedEnglish === english &&
                    !isWrongMatch &&
                    styles.selectedWordText,
                  matchedPairs.some((pair) => pair.english === english) &&
                    styles.matchedWordText,
                  isWrongMatch &&
                    selectedEnglish === english &&
                    styles.mismatchWordText,
                ]}
              >
                {english}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.uzbekWords}>
          {shuffledUzbekWords.map((uzbek) => (
            <TouchableOpacity
              key={uzbek}
              style={[
                styles.matchWord,
                selectedUzbek === uzbek && !isWrongMatch && styles.selectedWord,
                matchedPairs.some((pair) => pair.uzbek === uzbek) &&
                  styles.matchedWord,
                isWrongMatch && selectedUzbek === uzbek && styles.mismatchWord,
              ]}
              onPress={() =>
                !matchedPairs.some((pair) => pair.uzbek === uzbek) &&
                onSelectUzbek(uzbek)
              }
              disabled={matchedPairs.some((pair) => pair.uzbek === uzbek)}
            >
              <Text
                style={[
                  styles.matchWordText,
                  selectedUzbek === uzbek &&
                    !isWrongMatch &&
                    styles.selectedWordText,
                  matchedPairs.some((pair) => pair.uzbek === uzbek) &&
                    styles.matchedWordText,
                  isWrongMatch &&
                    selectedUzbek === uzbek &&
                    styles.mismatchWordText,
                ]}
              >
                {uzbek}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Arrange Stage Component
const ArrangeStage = ({
  word,
  arrangedLetters,
  onSelectLetter,
  onReset,
}: {
  word: Word;
  arrangedLetters: string[];
  onSelectLetter: (letter: string, index: number) => void;
  onReset: () => void;
}) => {
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [isWrongSelection, setIsWrongSelection] = useState(false);

  useEffect(() => {
    const letters = word.english.split("").sort(() => Math.random() - 0.5);
    setShuffledLetters(letters);
    setUsedIndices([]);
    setIsWrongSelection(false);
  }, [word]);

  const handleLetterSelect = (letter: string, index: number) => {
    if (usedIndices.includes(index) || isWrongSelection) return;

    const nextPosition = arrangedLetters.length;
    if (letter === word.english[nextPosition]) {
      setUsedIndices([...usedIndices, index]);
      onSelectLetter(letter, nextPosition);
      setIsWrongSelection(false);
    } else {
      setIsWrongSelection(true);
      setTimeout(() => setIsWrongSelection(false), 1000);
    }
  };

  const handleReset = () => {
    setUsedIndices([]);
    setIsWrongSelection(false);
    onReset();
  };

  return (
    <View style={styles.gameContent}>
      <Text style={styles.uzbekWord}>{word.uzbek}</Text>
      <View style={styles.arrangeContainer}>
        <View style={styles.arrangedWord}>
          {word.english.split("").map((_, index) => (
            <View
              key={index}
              style={[
                styles.letterBox,
                arrangedLetters[index] && styles.correctLetter,
                isWrongSelection &&
                  index === arrangedLetters.length &&
                  styles.wrongLetter,
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  arrangedLetters[index] && styles.correctLetterText,
                  isWrongSelection &&
                    index === arrangedLetters.length &&
                    styles.wrongLetterText,
                ]}
              >
                {arrangedLetters[index] || ""}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <FontAwesome5 name="redo" size={20} color="#3C5BFF" />
        </TouchableOpacity>
        <View style={styles.shuffledLetters}>
          {shuffledLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.letterButton,
                usedIndices.includes(index) && styles.usedLetterButton,
              ]}
              onPress={() => handleLetterSelect(letter, index)}
              disabled={usedIndices.includes(index) || isWrongSelection}
            >
              <Text
                style={[
                  styles.letterText,
                  usedIndices.includes(index) && styles.usedLetterText,
                ]}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Write Stage Component
const WriteStage = ({
  word,
  mistakes,
  onSubmit,
}: {
  word: Word;
  mistakes: number;
  onSubmit: (answer: string) => void;
}) => {
  const [answer, setAnswer] = useState("");

  return (
    <View style={styles.gameContent}>
      <Text style={styles.uzbekWord}>{word.uzbek}</Text>
      <View style={styles.writeContainer}>
        <View style={styles.mistakesContainer}>
          {[...Array(MAX_MISTAKES)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.mistakeIndicator,
                index < mistakes && styles.mistakeIndicatorActive,
              ]}
            />
          ))}
        </View>
        <TextInput
          style={styles.writeInput}
          value={answer}
          onChangeText={setAnswer}
          onSubmitEditing={() => {
            onSubmit(answer);
            setAnswer("");
          }}
          placeholder="Inglizcha so'zni yozing..."
          placeholderTextColor="#666"
          autoCapitalize="none"
          returnKeyType="done"
        />
      </View>
    </View>
  );
};

const LessonGameScreen: React.FC<Props> = ({ setScreen, lesson }) => {
  const [userCoins, setUserCoins] = useState<number>(0);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);
  const [words] = useState<Word[]>(
    lesson.words.length > 0 ? lesson.words : MOCK_WORDS
  );
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentStage: "stages",
    currentWordIndex: 0,
    score: 0,
    mistakes: 0,
    completedWords: [],
    matchedPairs: [],
    selectedEnglishWord: null,
    selectedUzbekWord: null,
    arrangedLetters: [],
    selectedOption: null,
    stageProgress: {
      memorize: {
        completed: false,
        completedWords: [],
        remainingWords: [],
      },
      match: {
        completed: false,
        progress: 0,
      },
      arrange: {
        completed: false,
        completedWords: [],
        remainingWords: [],
      },
      write: {
        completed: false,
        completedWords: [],
        remainingWords: [],
      },
    },
  });

  let [fontsLoaded] = useFonts({ Lexend_400Regular });

  // Calculate progress
  const progress = useCallback(() => {
    const total = 4; // 4 stages
    let completed = 0;

    if (gameState.stageProgress.memorize.completed) completed++;
    if (gameState.stageProgress.match.completed) completed++;
    if (gameState.stageProgress.arrange.completed) completed++;
    if (gameState.stageProgress.write.completed) completed++;

    return Math.round((completed / total) * 100);
  }, [gameState.stageProgress]);

  // Check if all stages are completed
  const allStagesCompleted =
    gameState.stageProgress.memorize.completed &&
    gameState.stageProgress.match.completed &&
    gameState.stageProgress.arrange.completed &&
    gameState.stageProgress.write.completed;

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("user");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUserCoins(userData.coins || 0);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  // Check if the lesson has been previously completed
  useEffect(() => {
    const checkLessonCompletion = async () => {
      try {
        const completedLessonsStr = await AsyncStorage.getItem(
          "completedLessons"
        );
        const completedLessons = completedLessonsStr
          ? JSON.parse(completedLessonsStr)
          : [];

        // Lesson ID format should match what's stored
        const formattedLessonId = formatLessonId(lesson);
        setLessonCompleted(completedLessons.includes(formattedLessonId));
      } catch (error) {
        console.error("Error checking lesson completion:", error);
      }
    };

    checkLessonCompletion();
  }, [lesson]);

  // Handle lesson completion and award coins only the first time
  useEffect(() => {
    if (allStagesCompleted && !lessonCompleted) {
      const markLessonAsCompleted = async () => {
        try {
          // Update user coins
          await updateUserCoins(10);

          // Mark this lesson as completed
          const formattedLessonId = formatLessonId(lesson);
          const completedLessonsStr = await AsyncStorage.getItem(
            "completedLessons"
          );
          const completedLessons = completedLessonsStr
            ? JSON.parse(completedLessonsStr)
            : [];

          if (!completedLessons.includes(formattedLessonId)) {
            completedLessons.push(formattedLessonId);
            await AsyncStorage.setItem(
              "completedLessons",
              JSON.stringify(completedLessons)
            );
            setLessonCompleted(true);

            // Show success alert
            Alert.alert(
              "Ajoyib!",
              "Dars muvaffaqiyatli tugatildi!",
              [
                {
                  text: "OK",
                  onPress: () => setScreen("SuggestedLessons"),
                  style: "default",
                },
              ],
              {
                cancelable: false,
                // Custom styling is not directly supported in Alert.alert,
                // but you can inform the user about the coins in the message
              }
            );
          }
        } catch (error) {
          console.error("Error marking lesson as completed:", error);
        }
      };

      markLessonAsCompleted();
    }
  }, [allStagesCompleted, lessonCompleted, lesson, setScreen]);

  // Function to update user coins
  const updateUserCoins = async (amount: number) => {
    try {
      // Get current user data
      const userDataStr = await AsyncStorage.getItem("user");
      if (!userDataStr) return;

      const userData = JSON.parse(userDataStr);
      const currentCoins = userData.coins || 0;
      const newCoins = currentCoins + amount;

      // Update local state
      setUserCoins(newCoins);

      // Update AsyncStorage
      userData.coins = newCoins;
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      console.log(
        `User coins updated: ${currentCoins} -> ${newCoins} (+${amount})`
      );
    } catch (error) {
      console.error("Error updating user coins:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("Token topilmadi, Auth ekraniga yo'naltirilmoqda");
          setScreen("Auth");
          return;
        }

        // Log lesson details for debugging
        console.log("LESSON DETAILS:", {
          id: lesson.id,
          words: lesson.words
            .map((w) => ({ english: w.english, id: w.id }))
            .slice(0, 3), // Show first 3 words only
        });

        // Check if lesson ID format is correct
        const formattedId = formatLessonId(lesson);
        console.log(`Lesson ID format check: ${lesson.id} -> ${formattedId}`);

        console.log("Dars progressini boshlash: ", {
          lessonId: lesson.id,
          formattedLessonId: formattedId,
          words: lesson.words
            .slice(0, MAX_WORDS_PER_LESSON)
            .map((w) => w.english),
        });

        // Initialize progress
        await initializeProgress();

        // Get progress and update UI
        await updateProgressUI();
      } catch (error) {
        console.error("Dars progressini boshlashda xatolik:", error);
      }
    };

    initialize();
  }, []);

  // UI ni progress ma'lumotlari bilan yangilash
  const updateProgressUI = async () => {
    try {
      console.log("Updating progress UI");
      const progressData = await progressService.getUserProgress();
      console.log("Got progress data:", progressData);

      // Hech qanday ma'lumot yo'qligini tekshirish
      if (!progressData) {
        console.error("No progress data received");
        return;
      }

      // Array emasligini tekshirish
      if (!Array.isArray(progressData)) {
        console.error("Progress data is not an array:", progressData);
        return;
      }

      // Joriy dars uchun progress ma'lumotlarini topish
      const formattedLessonId = formatLessonId(lesson);
      console.log(
        "Looking for progress with formatted lesson ID:",
        formattedLessonId
      );
      const lessonProgress = progressData.find(
        (p) => p.lessonId === formattedLessonId
      );
      console.log("Lesson progress for current lesson:", lessonProgress);

      if (lessonProgress && lessonProgress.stages) {
        // Progress ma'lumotlari bilan UI ni yangilash
        setGameState((prev) => {
          const memorizeWords =
            lessonProgress.stages.memorize?.completedWords || [];
          const matchProgress = lessonProgress.stages.match?.progress || 0;
          const arrangeWords =
            lessonProgress.stages.arrange?.completedWords || [];
          const writeWords = lessonProgress.stages.write?.completedWords || [];

          // Backend tomondan olingan progress qiymati
          const overallProgress = lessonProgress.completedPercentage || 0;

          console.log("Memorize completed words:", memorizeWords);
          console.log("Match progress:", matchProgress);
          console.log("Arrange completed words:", arrangeWords);
          console.log("Write completed words:", writeWords);
          console.log("Overall progress from backend:", overallProgress);

          return {
            ...prev,
            overallProgress, // Backend tomondan olingan progress
            stageProgress: {
              memorize: {
                completed: lessonProgress.stages.memorize?.completed || false,
                completedWords: memorizeWords,
                remainingWords:
                  lessonProgress.stages.memorize?.remainingWords || [],
              },
              match: {
                completed: lessonProgress.stages.match?.completed || false,
                progress: matchProgress,
              },
              arrange: {
                completed: lessonProgress.stages.arrange?.completed || false,
                completedWords: arrangeWords,
                remainingWords:
                  lessonProgress.stages.arrange?.remainingWords || [],
              },
              write: {
                completed: lessonProgress.stages.write?.completed || false,
                completedWords: writeWords,
                remainingWords:
                  lessonProgress.stages.write?.remainingWords || [],
              },
            },
          };
        });
      } else {
        console.log("No progress found for current lesson:", lesson.id);
      }
    } catch (error) {
      console.error("Error updating progress UI:", error);
    }
  };

  // Update progress when a word is completed
  const updateProgress = async (
    stage: string,
    word: string,
    isCorrect: boolean
  ) => {
    try {
      if (!lesson || !lesson.id || !lesson.words) {
        console.error("Cannot update progress: lesson data is invalid");
        return;
      }

      // Convert Word objects to string array based on Word type definition
      const wordStrings = lesson.words.map((word) => word.english);

      console.log(
        `Updating progress - Stage: ${stage}, Word: ${word}, Correct: ${isCorrect}`
      );

      // Progress service chaqirish
      await progressService.updateProgress(
        formatLessonId(lesson),
        stage,
        word,
        isCorrect,
        wordStrings
      );
      console.log("Progress updated successfully");

      // Update UI after progress update
      await updateProgressUI();
    } catch (error) {
      console.error("Error updating progress:", error);
      // Xato bo'lgan taqdirda ham UI ni yangilashga harakat qilish
      try {
        await updateProgressUI();
      } catch (uiError) {
        console.error("Failed to update UI after error:", uiError);
      }
    }
  };

  useEffect(() => {
    if (gameState.currentStage === "memorize") {
      generateOptions();
    }
  }, [gameState.currentWordIndex, gameState.currentStage]);

  const generateOptions = () => {
    const currentWord = words[gameState.currentWordIndex];
    const otherWords = words
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.uzbek);

    const options = [...otherWords, currentWord.uzbek].sort(
      () => Math.random() - 0.5
    );
    setShuffledOptions(options);
  };

  const initializeProgress = async () => {
    try {
      console.log("Initializing progress for lesson:", lesson?.id);

      // Extract words from lesson correctly
      if (!lesson || !lesson.words || !Array.isArray(lesson.words)) {
        console.error("No words found in lesson or invalid format", lesson);
        return;
      }

      // Convert Word objects to string array based on Word type definition in this file
      const wordStrings = lesson.words.map((word) => word.english);
      console.log("Words for progress:", wordStrings);

      if (wordStrings.length === 0) {
        console.error("No words found in lesson");
        return;
      }

      // Format lesson ID correctly for backend
      const formattedLessonId = formatLessonId(lesson);
      console.log(
        "Using formatted lesson ID for initialization:",
        formattedLessonId
      );

      // Initialize progress using progressService.initializeLessonProgress instead of initializeProgress
      await progressService.initializeLessonProgress(
        formattedLessonId,
        wordStrings
      );
      console.log("Progress initialized successfully");

      // Update UI after initialization
      await updateProgressUI();
    } catch (error) {
      console.error("Error initializing progress:", error);

      // Try to update UI even after error
      try {
        await updateProgressUI();
      } catch (uiError) {
        console.error(
          "Failed to update UI after initialization error:",
          uiError
        );
      }
    }
  };

  const checkAuthAndInitialize = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (!token || !userStr) {
        console.log("User not logged in, cannot initialize progress");
        setScreen("Auth");
        return;
      }

      await initializeProgress();
    } catch (error) {
      console.error("Error checking auth and initializing progress:", error);
    }
  };

  useEffect(() => {
    if (lesson && lesson.id) {
      console.log("Lesson loaded, initializing progress:", lesson.id);
      checkAuthAndInitialize();
    }
  }, [lesson]);

  useEffect(() => {
    if (
      gameState.currentStage === "memorize" &&
      gameState.currentWordIndex >= words.length
    ) {
      // User completed all words in Memorize, update progress for all words
      words.forEach((word) => {
        updateProgress("memorize", word.english, true);
      });
      handleStageSelect("match");
    }
  }, [gameState.currentStage, gameState.currentWordIndex, words]);

  const handleStageSelect = (stage: GameStage) => {
    setGameState((prev) => ({
      ...prev,
      currentStage: stage,
      currentWordIndex: 0,
      arrangedLetters: [],
      matchedPairs: [],
      mistakes: 0,
    }));
  };

  const handleOptionSelect = (selectedOption: string) => {
    const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
    const currentWord = availableWords[gameState.currentWordIndex];
    const isCorrect = selectedOption === currentWord.uzbek;

    // O'rganilgan so'zni progress tizimiga saqlash
    if (isCorrect) {
      updateProgress("memorize", currentWord.english, true);
    }

    setGameState((prev) => ({
      ...prev,
      selectedOption: selectedOption,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNext = () => {
    const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
    const currentWord = availableWords[gameState.currentWordIndex];

    setGameState((prev) => {
      const newState = {
        ...prev,
        selectedOption: null,
        completedWords: [
          ...prev.completedWords,
          availableWords[prev.currentWordIndex].id,
        ],
      };

      if (prev.currentWordIndex < availableWords.length - 1) {
        return {
          ...newState,
          currentWordIndex: prev.currentWordIndex + 1,
        };
      } else {
        return {
          ...newState,
          currentStage: "stages",
          currentWordIndex: 0,
        };
      }
    });
  };

  const handleMatchStage = (english: string, uzbek: string) => {
    const isCorrect = words.find(
      (w) => w.english === english && w.uzbek === uzbek
    );

    if (isCorrect) {
      updateProgress("match", english, true);

      setGameState((prev) => {
        const newMatchedPairs = [...prev.matchedPairs, { english, uzbek }];
        const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);

        if (newMatchedPairs.length === availableWords.length) {
          setTimeout(() => {
            setGameState((prevState) => ({
              ...prevState,
              matchedPairs: [],
              selectedEnglishWord: null,
              selectedUzbekWord: null,
              currentStage: "stages",
              stageProgress: {
                ...prevState.stageProgress,
                match: {
                  ...prevState.stageProgress.match,
                  completed: true,
                  progress: 100,
                },
              },
            }));
          }, 1000);
        }

        return {
          ...prev,
          matchedPairs: newMatchedPairs,
          selectedEnglishWord: null,
          selectedUzbekWord: null,
        };
      });
    } else {
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          selectedEnglishWord: null,
          selectedUzbekWord: null,
        }));
      }, 1000);
    }
  };

  const handleArrangeStage = (letter: string) => {
    const currentWord = words[gameState.currentWordIndex];
    if (!currentWord) return;

    const nextIndex = gameState.arrangedLetters.length;
    if (letter === currentWord.english[nextIndex]) {
      const newArrangedLetters = [...gameState.arrangedLetters, letter];

      if (newArrangedLetters.length === currentWord.english.length) {
        // So'z to'g'ri tertiblanganda progressni saqlash
        updateProgress("arrange", currentWord.english, true);

        setGameState((prev) => ({
          ...prev,
          arrangedLetters: newArrangedLetters,
        }));

        setTimeout(() => {
          const nextIndex = gameState.currentWordIndex + 1;
          const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);

          if (nextIndex < availableWords.length) {
            setGameState((prev) => ({
              ...prev,
              currentWordIndex: nextIndex,
              arrangedLetters: [],
            }));
          } else {
            setGameState((prev) => ({
              ...prev,
              currentStage: "stages",
              currentWordIndex: 0,
              arrangedLetters: [],
              stageProgress: {
                ...prev.stageProgress,
                arrange: {
                  ...prev.stageProgress.arrange,
                  completed: true,
                },
              },
            }));
          }
        }, 1000);
      } else {
        setGameState((prev) => ({
          ...prev,
          arrangedLetters: newArrangedLetters,
        }));
      }
    }
  };

  const handleCorrectAnswer = () => {
    const currentWord = words[gameState.currentWordIndex];

    // To'g'ri yozilganda progressni saqlash
    updateProgress("write", currentWord.english, true);

    setGameState((prev) => {
      const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
      const newState = { ...prev };

      if (prev.currentWordIndex < availableWords.length - 1) {
        return {
          ...newState,
          currentWordIndex: prev.currentWordIndex + 1,
          mistakes: 0,
        };
      } else {
        return {
          ...newState,
          currentStage: "stages",
          currentWordIndex: 0,
          mistakes: 0,
          stageProgress: {
            ...prev.stageProgress,
            write: {
              ...prev.stageProgress.write,
              completed: true,
            },
          },
        };
      }
    });
  };

  const handleWrongAnswer = () => {
    setGameState((prev) => {
      const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
      const newMistakes = prev.mistakes + 1;

      if (newMistakes >= MAX_MISTAKES) {
        if (prev.currentWordIndex < availableWords.length - 1) {
          return {
            ...prev,
            currentWordIndex: prev.currentWordIndex + 1,
            mistakes: 0,
          };
        } else {
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

  const renderStages = () => {
    const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
    const totalWords = availableWords.length;

    return (
      <ScrollView style={styles.stagesContainer}>
        <View style={styles.stageCards}>
          <TouchableOpacity
            style={styles.stageCard}
            onPress={() => handleStageSelect("memorize")}
          >
            <View style={styles.stageHeader}>
              <View style={styles.stageIcon}>
                <FontAwesome5 name="brain" size={20} color="#3C5BFF" />
              </View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageName}>So'zlarni yodlash</Text>
              </View>
              <View style={styles.stageScore}>
                {gameState.stageProgress.memorize.completed ? (
                  <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
                ) : (
                  <Text style={styles.stageScoreText}>
                    {gameState.stageProgress.memorize.completedWords.length}/
                    {totalWords}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.stageCard}
            onPress={() => handleStageSelect("match")}
          >
            <View style={styles.stageHeader}>
              <View style={styles.stageIcon}>
                <FontAwesome5 name="exchange-alt" size={20} color="#3C5BFF" />
              </View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageName}>So'zlarni takrorlash</Text>
              </View>
              <View style={styles.stageScore}>
                {gameState.stageProgress.match.completed ? (
                  <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
                ) : (
                  <Text style={styles.stageScoreText}>
                    {Math.floor(gameState.stageProgress.match.progress / 10)}/
                    {totalWords}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.stageCard}
            onPress={() => handleStageSelect("arrange")}
          >
            <View style={styles.stageHeader}>
              <View style={styles.stageIcon}>
                <FontAwesome5
                  name="sort-alpha-down"
                  size={20}
                  color="#3C5BFF"
                />
              </View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageName}>So'zlarni mustahkamlash</Text>
              </View>
              <View style={styles.stageScore}>
                {gameState.stageProgress.arrange.completed ? (
                  <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
                ) : (
                  <Text style={styles.stageScoreText}>
                    {gameState.stageProgress.arrange.completedWords.length}/
                    {totalWords}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.stageCard}
            onPress={() => handleStageSelect("write")}
          >
            <View style={styles.stageHeader}>
              <View style={styles.stageIcon}>
                <FontAwesome5 name="pencil-alt" size={20} color="#3C5BFF" />
              </View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageName}>So'zlarni yozish</Text>
              </View>
              <View style={styles.stageScore}>
                {gameState.stageProgress.write.completed ? (
                  <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
                ) : (
                  <Text style={styles.stageScoreText}>
                    {gameState.stageProgress.write.completedWords.length}/
                    {totalWords}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.wordsSection}>
          <Text style={styles.wordsSectionTitle}>O'rganiladigan so'zlar</Text>
          <View style={styles.wordsList}>
            {words.slice(0, MAX_WORDS_PER_LESSON).map((word, index) => (
              <View key={word.id} style={styles.wordItem}>
                <Text style={styles.wordNumber}>{index + 1}.</Text>
                <Text style={styles.wordEnglish}>{word.english}</Text>
                <Text style={styles.wordUzbek}>{word.uzbek}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderGameStage = () => {
    const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
    const currentWord =
      gameState.currentStage !== "stages"
        ? availableWords[gameState.currentWordIndex]
        : null;

    switch (gameState.currentStage) {
      case "memorize":
        return currentWord ? (
          <MemorizeStage
            word={currentWord}
            options={shuffledOptions}
            onSelect={handleOptionSelect}
            onNext={handleNext}
            selectedOption={gameState.selectedOption}
          />
        ) : null;
      case "match":
        return (
          <MatchStage
            words={availableWords}
            matchedPairs={gameState.matchedPairs}
            selectedEnglish={gameState.selectedEnglishWord}
            selectedUzbek={gameState.selectedUzbekWord}
            onSelectEnglish={(word) => {
              setGameState((prev) => ({
                ...prev,
                selectedEnglishWord: word,
              }));
            }}
            onSelectUzbek={(word) => {
              setGameState((prev) => ({
                ...prev,
                selectedUzbekWord: word,
              }));
            }}
            onMatch={handleMatchStage}
            onMismatch={() => {
              // Handle mismatch
            }}
          />
        );
      case "arrange":
        return currentWord ? (
          <ArrangeStage
            word={currentWord}
            arrangedLetters={gameState.arrangedLetters}
            onSelectLetter={(letter, index) => {
              handleArrangeStage(letter);
            }}
            onReset={() => {
              setGameState((prev) => ({
                ...prev,
                arrangedLetters: [],
              }));
            }}
          />
        ) : null;
      case "write":
        return currentWord ? (
          <WriteStage
            word={currentWord}
            mistakes={gameState.mistakes}
            onSubmit={(answer) => {
              const isCorrect =
                answer.toLowerCase() === currentWord.english.toLowerCase();
              if (isCorrect) {
                handleCorrectAnswer();
              } else {
                handleWrongAnswer();
              }
            }}
          />
        ) : null;
      default:
        return renderStages();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              gameState.currentStage === "stages"
                ? setScreen("SuggestedLessons")
                : setGameState((prev) => ({ ...prev, currentStage: "stages" }))
            }
          >
            <FontAwesome5
              name={
                gameState.currentStage === "stages" ? "arrow-left" : "times"
              }
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{lesson.name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {gameState.currentStage === "stages"
                ? `${progress()}%`
                : `${gameState.currentWordIndex + 1}/${Math.min(
                    words.length,
                    MAX_WORDS_PER_LESSON
                  )}`}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress()}%` }]} />
        </View>
      </View>

      {renderGameStage()}
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
    paddingBottom: 0,
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
    zIndex: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontFamily: "Lexend_400Regular",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  scoreContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
  },
  scoreText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#F0F0F0",
    width: "100%",
    marginTop: 0,
    zIndex: 3,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3C5BFF",
  },
  stagesContainer: {
    flex: 1,
    padding: 20,
  },
  stageCards: {
    marginBottom: 20,
  },
  stageCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(60, 91, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  stageHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  stageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(60, 91, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  stageScore: {
    backgroundColor: "rgba(60, 91, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  stageScoreText: {
    fontSize: 13,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
  },
  wordsSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(60, 91, 255, 0.1)",
    marginBottom: 20,
  },
  wordsSectionTitle: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Lexend_400Regular",
    marginBottom: 15,
  },
  wordsList: {},
  wordItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(60, 91, 255, 0.05)",
  },
  wordNumber: {
    width: 30,
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  wordEnglish: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  wordUzbek: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    fontFamily: "Lexend_400Regular",
    textAlign: "right",
  },
  gameContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  englishWord: {
    fontSize: 32,
    color: "#3C5BFF",
    marginBottom: 30,
    fontFamily: "Lexend_400Regular",
  },
  uzbekWord: {
    fontSize: 32,
    color: "#3C5BFF",
    marginBottom: 30,
    fontFamily: "Lexend_400Regular",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
  },
  optionButton: {
    width: "48%",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  wrongOption: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF0000",
  },
  correctOption: {
    backgroundColor: "#4CAF50",
    borderColor: "#45A049",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
  wrongOptionText: {
    color: "white",
  },
  correctOptionText: {
    color: "white",
  },
  matchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  matchedPairsContainer: {
    marginBottom: 20,
    width: "100%",
  },
  matchedPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  matchedEnglish: {
    fontSize: 16,
    color: "#4CAF50",
    marginRight: 10,
    fontFamily: "Lexend_400Regular",
  },
  matchedUzbek: {
    fontSize: 16,
    color: "#4CAF50",
    marginLeft: 10,
    fontFamily: "Lexend_400Regular",
  },
  englishWords: {
    width: "48%",
  },
  uzbekWords: {
    width: "48%",
  },
  matchWord: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedWord: {
    backgroundColor: "#3C5BFF",
    borderColor: "#3C5BFF",
  },
  matchedWord: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  mismatchWord: {
    backgroundColor: "#FF1744",
    borderColor: "#FF1744",
  },
  matchWordText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
  selectedWordText: {
    color: "white",
  },
  matchedWordText: {
    color: "white",
  },
  mismatchWordText: {
    color: "white",
  },
  arrangeContainer: {
    width: "100%",
    alignItems: "center",
  },
  arrangedWord: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  letterBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    backgroundColor: "#F5F5F5",
  },
  correctLetter: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  wrongLetter: {
    backgroundColor: "#FF5252",
    borderColor: "#FF5252",
  },
  shuffledLetters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterButton: {
    width: 40,
    height: 40,
    backgroundColor: "#3C5BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  letterText: {
    fontSize: 18,
    color: "white",
    fontFamily: "Lexend_400Regular",
  },
  usedLetterButton: {
    opacity: 0.3,
  },
  usedLetterText: {
    opacity: 0.5,
  },
  writeContainer: {
    width: "100%",
    maxWidth: 400,
  },
  writeInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend_400Regular",
  },
  mistakesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  mistakeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  mistakeIndicatorActive: {
    backgroundColor: "#FF5252",
  },
  resetButton: {
    padding: 10,
    marginBottom: 20,
  },
  correctLetterText: {
    color: "white",
  },
  wrongLetterText: {
    color: "white",
  },
  nextButton: {
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 30,
  },
  nextButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    textAlign: "center",
  },
  nextButtonTextDisabled: {
    color: "#999",
  },
});

export default LessonGameScreen;
