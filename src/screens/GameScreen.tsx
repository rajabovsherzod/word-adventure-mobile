import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getWordsByCardAndLesson, Word } from "../data/words";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameStages from "../components/lessons/GameStages";
import useGameState from "../hooks/useGameState";
import useLessonProgress from "../hooks/useLessonProgress";

interface GameScreenProps {
  cardId: number;
  lessonId: number;
  setScreen: (screen: string) => void;
  addCoins: (amount: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  cardId,
  lessonId,
  setScreen,
  addCoins,
}) => {
  // So'zlarni yuklash
  const [words, setWords] = useState<Word[]>([]);

  // Dars progressi bilan ishlash uchun hook
  const { updateProgress, markLessonComplete } = useLessonProgress(cardId);

  // O'yin holati bilan ishlash uchun hook
  const {
    gameState,
    setStage,
    handleCorrectAnswer,
    handleWrongAnswer,
    nextWord,
  } = useGameState(words);

  // Dars boshlanishida so'zlarni yuklash
  useEffect(() => {
    const lessonWords = getWordsByCardAndLesson(cardId, lessonId);
    setWords(lessonWords.slice(0, 10)); // Har darsda 10 ta so'z

    // Dars boshlangan sana
    const saveStartTime = async () => {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(`lesson_started_${cardId}_${lessonId}`, now);
    };
    saveStartTime();

    // Boshlang'ich bosqichni o'rnatish
    setStage("memorize");
  }, [cardId, lessonId, setStage]);

  // Variantlarni tanlash
  const handleSelectOption = (option: string) => {
    const currentWord = words[gameState.currentWordIndex];

    if (currentWord && currentWord.uzbek === option) {
      // To'g'ri javob
      handleCorrectAnswer();
    } else {
      // Noto'g'ri javob
      handleWrongAnswer();
    }
  };

  // Inglizcha so'zni tanlash (match bosqichi)
  const handleSelectEnglish = (english: string) => {
    // GameState'ga tanlov qo'shish
  };

  // O'zbekcha so'zni tanlash (match bosqichi)
  const handleSelectUzbek = (uzbek: string) => {
    // GameState'ga tanlov qo'shish
  };

  // Harfni tanlash (arrange bosqichi)
  const handleArrangeLetter = (letter: string, index: number) => {
    // Harfni tanlash
  };

  // Foydalanuvchi kiritganini o'zgartirish (write bosqichi)
  const handleChangeUserInput = (text: string) => {
    // Kiritgan matnni o'zgartirish
  };

  // Foydalanuvchi kiritgan javobni tekshirish (write bosqichi)
  const handleSubmitUserInput = () => {
    // Kiritilgan matnni tekshirish
  };

  // Qayta o'ynash
  const handlePlayAgain = () => {
    setStage(gameState.currentStage);
  };

  // Darsni yakunlash
  const handleFinish = () => {
    // Dars tugallanganini belgilash
    markLessonComplete(lessonId);

    // Tugash vaqtini saqlash
    const saveEndTime = async () => {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(`lesson_completed_${cardId}_${lessonId}`, now);
    };
    saveEndTime();

    // Tangalar qo'shish
    addCoins(5);

    // Darslar ro'yxatiga qaytish
    setScreen("SuggestedLessons");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C5BFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setScreen("SuggestedLessons")}
        >
          <FontAwesome5 name="times" size={20} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{lessonId}-dars</Text>

        <View style={styles.stageIndicator}>
          <Text style={styles.stageText}>
            {gameState.currentStage === "memorize"
              ? "Yodlash"
              : gameState.currentStage === "match"
              ? "Juftlash"
              : gameState.currentStage === "arrange"
              ? "Joylashtirish"
              : gameState.currentStage === "write"
              ? "Yozish"
              : "Natija"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <GameStages
          stage={gameState.currentStage}
          words={words}
          currentWordIndex={gameState.currentWordIndex}
          totalWords={words.length}
          progress={(gameState.currentWordIndex / words.length) * 100}
          score={gameState.score}
          options={gameState.options || []}
          selectedOption={gameState.lastSelectedOption}
          showCorrectAnswer={gameState.showCorrectAnswer}
          userInput={gameState.userInput}
          matchedPairs={gameState.matchedPairs}
          selectedEnglishWord={gameState.selectedEnglishWord}
          selectedUzbekWord={gameState.selectedUzbekWord}
          arrangedLetters={gameState.arrangedLetters}
          onSelectOption={handleSelectOption}
          onNextWord={nextWord}
          onSelectEnglish={handleSelectEnglish}
          onSelectUzbek={handleSelectUzbek}
          onArrangeLetter={handleArrangeLetter}
          onChangeUserInput={handleChangeUserInput}
          onSubmitUserInput={handleSubmitUserInput}
          onPlayAgain={handlePlayAgain}
          onFinish={handleFinish}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FA",
  },
  header: {
    backgroundColor: "#3C5BFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
  },
  stageIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stageText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default GameScreen;
