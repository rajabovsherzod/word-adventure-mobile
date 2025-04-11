import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Word } from "../../types/lesson";
import { lessonStyles } from "../../styles/LessonStyles";

type WriteStageProps = {
  word: Word;
  userInput: string;
  setUserInput: (text: string) => void;
  onSubmit: () => void;
  progress: number;
  currentIndex: number;
  totalWords: number;
};

const WriteStage: React.FC<WriteStageProps> = ({
  word,
  userInput,
  setUserInput,
  onSubmit,
  progress,
  currentIndex,
  totalWords,
}) => {
  return (
    <View style={lessonStyles.writeContainer}>
      <Text style={lessonStyles.writePrompt}>
        Quyidagi so'zni ingliz tilida yozing:
      </Text>
      <Text style={lessonStyles.writeUzbekWord}>{word.uzbek}</Text>

      <TextInput
        style={lessonStyles.writeInput}
        value={userInput}
        onChangeText={setUserInput}
        placeholder="So'zni yozing..."
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />

      <TouchableOpacity style={lessonStyles.submitButton} onPress={onSubmit}>
        <Text style={lessonStyles.submitButtonText}>Tekshirish</Text>
      </TouchableOpacity>

      {/* Progress indicator */}
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

export default WriteStage;
