import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Word } from "../data/words";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

type Props = {
  words: Word[];
  onComplete: () => void;
  onBack: () => void;
};

const MemorizeStage: React.FC<Props> = ({ words, onComplete, onBack }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateOptions();
  }, [currentWordIndex]);

  const generateOptions = () => {
    const currentWord = words[currentWordIndex];
    const otherWords = words.filter((w) => w.id !== currentWord.id);
    const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledWords.slice(0, 3).map((w) => w.uzbek);
    const allOptions = [...wrongOptions, currentWord.uzbek].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const isAnswerCorrect = option === words[currentWordIndex].uzbek;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        onComplete();
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentWordIndex + 1}/{words.length}
        </Text>
      </View>

      <View style={styles.wordCard}>
        <Text style={styles.englishWord}>
          {words[currentWordIndex].english}
        </Text>
        <Text style={styles.transcription}>
          {words[currentWordIndex].transcription}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option &&
                (isCorrect ? styles.correctOption : styles.wrongOption),
            ]}
            onPress={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <FontAwesome5 name="arrow-left" size={16} color="#3C5BFF" />
        <Text style={styles.backButtonText}>Orqaga</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: "#3C5BFF",
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
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#F0EAFB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  correctOption: {
    backgroundColor: "#D1F5D3",
    borderColor: "#4CAF50",
  },
  wrongOption: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    marginLeft: 8,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
  },
});

export default MemorizeStage;
