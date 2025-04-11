import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Word } from "../../types/lesson";
import { lessonStyles } from "../../styles/LessonStyles";

type MemorizeStageProps = {
  word: Word;
  options: string[];
  onSelectOption: (option: string) => void;
  progress: number;
  currentIndex: number;
  totalWords: number;
  selectedOption?: string;
  showCorrectAnswer?: boolean;
  onNextWord?: () => void;
};

const MemorizeStage: React.FC<MemorizeStageProps> = ({
  word,
  options,
  onSelectOption,
  progress,
  currentIndex,
  totalWords,
  selectedOption,
  showCorrectAnswer,
  onNextWord,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={lessonStyles.wordCard}>
        <Text style={lessonStyles.englishWord}>{word.english}</Text>
        <Text style={lessonStyles.transcription}>
          {word.transcription || ""}
        </Text>
        <Text style={lessonStyles.uzbekWord}>
          {showCorrectAnswer ? word.uzbek : ""}
        </Text>
      </View>

      <View style={lessonStyles.optionsContainer}>
        <Text style={lessonStyles.optionsTitle}>
          To'g'ri tarjimani tanlang:
        </Text>
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = word.uzbek === option;
          const showIsCorrect = showCorrectAnswer && isCorrect;
          const showIsWrong = showCorrectAnswer && isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                lessonStyles.optionButton,
                isSelected && lessonStyles.optionButtonSelected,
                showIsCorrect && lessonStyles.optionButtonCorrect,
                showIsWrong && lessonStyles.optionButtonIncorrect,
              ]}
              onPress={() => onSelectOption(option)}
              disabled={!!selectedOption}
            >
              <Text style={lessonStyles.optionText}>{option}</Text>
              {showIsCorrect && (
                <FontAwesome5 name="check" size={16} color="#4CAF50" />
              )}
              {showIsWrong && (
                <FontAwesome5 name="times" size={16} color="#F44336" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {showCorrectAnswer && onNextWord && (
        <TouchableOpacity style={lessonStyles.nextButton} onPress={onNextWord}>
          <Text style={lessonStyles.nextButtonText}>Keyingi so'z</Text>
          <FontAwesome5 name="arrow-right" size={16} color="#FFF" />
        </TouchableOpacity>
      )}

      <View style={lessonStyles.progressContainer}>
        <View style={lessonStyles.progressCounter}>
          <Text style={lessonStyles.progressCount}>
            So'z {currentIndex}/{totalWords}
          </Text>
        </View>
        <View style={lessonStyles.progressBar}>
          <View
            style={[lessonStyles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>
    </View>
  );
};

export default MemorizeStage;
