import React, { useState, useEffect } from "react";
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

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Word = {
  id: string;
  english: string;
  uzbek: string;
};

const MAX_WORDS_PER_LESSON = 10;
const MAX_MISTAKES = 3;

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
  stageProgress: {
    memorize: number;
    match: number;
    arrange: number;
    write: number;
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
}: {
  word: Word;
  options: string[];
  onSelect: (option: string) => void;
}) => (
  <View style={styles.gameContent}>
    <Text style={styles.englishWord}>{word.english}</Text>
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            index % 2 === 0 ? { marginRight: 10 } : {},
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

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
        }, 1000);
      }
    }
  }, [selectedEnglish, selectedUzbek]);

  return (
    <View style={styles.gameContent}>
      <View style={styles.matchContainer}>
        <View style={styles.englishWords}>
          {words.map((word) => (
            <TouchableOpacity
              key={word.english}
              style={[
                styles.matchWord,
                selectedEnglish === word.english &&
                  !isWrongMatch &&
                  styles.selectedWord,
                matchedPairs.some((pair) => pair.english === word.english) &&
                  styles.matchedWord,
              ]}
              onPress={() =>
                !matchedPairs.some((pair) => pair.english === word.english) &&
                onSelectEnglish(word.english)
              }
              disabled={matchedPairs.some(
                (pair) => pair.english === word.english
              )}
            >
              <Text
                style={[
                  styles.matchWordText,
                  selectedEnglish === word.english &&
                    !isWrongMatch &&
                    styles.selectedWordText,
                  matchedPairs.some((pair) => pair.english === word.english) &&
                    styles.matchedWordText,
                ]}
              >
                {word.english}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.uzbekWords}>
          {words.map((word) => (
            <TouchableOpacity
              key={word.uzbek}
              style={[
                styles.matchWord,
                selectedUzbek === word.uzbek &&
                  !isWrongMatch &&
                  styles.selectedWord,
                matchedPairs.some((pair) => pair.uzbek === word.uzbek) &&
                  styles.matchedWord,
                isWrongMatch &&
                  selectedUzbek === word.uzbek &&
                  styles.mismatchWord,
              ]}
              onPress={() =>
                !matchedPairs.some((pair) => pair.uzbek === word.uzbek) &&
                onSelectUzbek(word.uzbek)
              }
              disabled={matchedPairs.some((pair) => pair.uzbek === word.uzbek)}
            >
              <Text
                style={[
                  styles.matchWordText,
                  selectedUzbek === word.uzbek &&
                    !isWrongMatch &&
                    styles.selectedWordText,
                  matchedPairs.some((pair) => pair.uzbek === word.uzbek) &&
                    styles.matchedWordText,
                  isWrongMatch &&
                    selectedUzbek === word.uzbek &&
                    styles.mismatchWordText,
                ]}
              >
                {word.uzbek}
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
    stageProgress: {
      memorize: 0,
      match: 0,
      arrange: 0,
      write: 0,
    },
  });

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  let [fontsLoaded] = useFonts({ Lexend_400Regular });

  // Use MOCK_WORDS if lesson.words is empty
  const words = lesson.words.length > 0 ? lesson.words : MOCK_WORDS;

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

    if (isCorrect) {
      setGameState((prev) => {
        const newState = {
          ...prev,
          score: prev.score + 1,
          completedWords: [...prev.completedWords, currentWord.id],
          stageProgress: {
            ...prev.stageProgress,
            memorize:
              ((prev.currentWordIndex + 1) / availableWords.length) * 100,
          },
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
    } else {
      setGameState((prev) => ({
        ...prev,
        mistakes: prev.mistakes + 1,
      }));
      Alert.alert("Xato!", "Qayta urinib ko'ring");
    }
  };

  const handleMatchStage = (english: string, uzbek: string) => {
    const isCorrect = words.find(
      (w) => w.english === english && w.uzbek === uzbek
    );

    if (isCorrect) {
      setGameState((prev) => {
        const newMatchedPairs = [...prev.matchedPairs, { english, uzbek }];
        const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
        const progress = (newMatchedPairs.length / availableWords.length) * 100;

        if (newMatchedPairs.length === availableWords.length) {
          // Oxirgi juftlik to'g'ri tanlanganda 1 soniya kutib tursin
          setTimeout(() => {
            setGameState((prevState) => ({
              ...prevState,
              matchedPairs: [],
              selectedEnglishWord: null,
              selectedUzbekWord: null,
              currentStage: "stages",
              stageProgress: {
                ...prevState.stageProgress,
                match: 100,
              },
            }));
          }, 1000);

          return {
            ...prev,
            matchedPairs: newMatchedPairs,
            selectedEnglishWord: null,
            selectedUzbekWord: null,
            stageProgress: {
              ...prev.stageProgress,
              match: 100,
            },
          };
        }

        return {
          ...prev,
          matchedPairs: newMatchedPairs,
          selectedEnglishWord: null,
          selectedUzbekWord: null,
          stageProgress: {
            ...prev.stageProgress,
            match: progress,
          },
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
        // So'z to'liq yig'ildi - 1 soniya kutib tursin
        setGameState((prev) => ({
          ...prev,
          arrangedLetters: newArrangedLetters,
        }));

        setTimeout(() => {
          const nextIndex = gameState.currentWordIndex + 1;
          const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);

          if (nextIndex < availableWords.length) {
            // Keyingi so'zga o'tish
            setGameState((prev) => ({
              ...prev,
              currentWordIndex: nextIndex,
              arrangedLetters: [],
              stageProgress: {
                ...prev.stageProgress,
                arrange: (nextIndex / availableWords.length) * 100,
              },
            }));
          } else {
            // Bosqich yakunlandi
            setGameState((prev) => ({
              ...prev,
              currentStage: "stages",
              currentWordIndex: 0,
              arrangedLetters: [],
              stageProgress: {
                ...prev.stageProgress,
                arrange: 100,
              },
            }));
          }
        }, 1000);
      } else {
        // Harf qo'shish
        setGameState((prev) => ({
          ...prev,
          arrangedLetters: newArrangedLetters,
        }));
      }
    }
  };

  const handleCorrectAnswer = () => {
    setGameState((prev) => {
      const availableWords = words.slice(0, MAX_WORDS_PER_LESSON);
      const newState = {
        ...prev,
        stageProgress: {
          ...prev.stageProgress,
          write: ((prev.currentWordIndex + 1) / availableWords.length) * 100,
        },
      };

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

  const renderStages = () => (
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
              {gameState.stageProgress.memorize === 100 ? (
                <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
              ) : (
                <Text style={styles.stageScoreText}>
                  {Math.round(gameState.stageProgress.memorize / 5)}/20
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
              {gameState.stageProgress.match === 100 ? (
                <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
              ) : (
                <Text style={styles.stageScoreText}>
                  {Math.round(gameState.stageProgress.match / 5)}/20
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
              <FontAwesome5 name="sort-alpha-down" size={20} color="#3C5BFF" />
            </View>
            <View style={styles.stageInfo}>
              <Text style={styles.stageName}>So'zlarni mustahkamlash</Text>
            </View>
            <View style={styles.stageScore}>
              {gameState.stageProgress.arrange === 100 ? (
                <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
              ) : (
                <Text style={styles.stageScoreText}>
                  {Math.round(gameState.stageProgress.arrange / 5)}/20
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
              {gameState.stageProgress.write === 100 ? (
                <FontAwesome5 name="check-circle" size={18} color="#4CAF50" />
              ) : (
                <Text style={styles.stageScoreText}>
                  {Math.round(gameState.stageProgress.write / 5)}/20
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

  const progress =
    gameState.currentStage === "stages"
      ? Object.values(gameState.stageProgress).reduce((a, b) => a + b, 0) / 4
      : ((gameState.currentWordIndex + 1) /
          Math.min(words.length, MAX_WORDS_PER_LESSON)) *
        100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            gameState.currentStage === "stages"
              ? setScreen("Lessons")
              : setGameState((prev) => ({ ...prev, currentStage: "stages" }))
          }
        >
          <FontAwesome5
            name={gameState.currentStage === "stages" ? "arrow-left" : "times"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.name}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {gameState.currentStage === "stages"
              ? `${Math.round(progress)}%`
              : `${gameState.currentWordIndex + 1}/${Math.min(
                  words.length,
                  MAX_WORDS_PER_LESSON
                )}`}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
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
  header: {
    backgroundColor: "#3C5BFF",
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  scoreContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
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
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
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
  matchWordText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
  selectedWord: {
    backgroundColor: "#3C5BFF",
    borderColor: "#3C5BFF",
  },
  selectedWordText: {
    color: "white",
  },
  matchedWord: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  matchedWordText: {
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
  mismatchWord: {
    backgroundColor: "#FF5252",
    borderColor: "#FF5252",
  },
  mismatchWordText: {
    color: "white",
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
});

export default LessonGameScreen;
