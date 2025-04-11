import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Word } from "../../types/lesson";
import { lessonStyles } from "../../styles/LessonStyles";

type ArrangeStageProps = {
  word: Word;
  arrangedLetters: string[];
  onSelectLetter: (letter: string, index: number) => void;
  progress: number;
  currentIndex: number;
  totalWords: number;
};

const ArrangeStage: React.FC<ArrangeStageProps> = ({
  word,
  arrangedLetters,
  onSelectLetter,
  progress,
  currentIndex,
  totalWords,
}) => {
  return (
    <View style={lessonStyles.arrangeContainer}>
      <View style={lessonStyles.arrangeWordContainer}>
        <Text style={lessonStyles.arrangePrompt}>
          So'z harflarini to'g'ri tartibda joylashtiring
        </Text>
        <Text style={lessonStyles.arrangeUzbekWord}>{word.uzbek}</Text>
      </View>

      {/* Letters to arrange */}
      <View style={lessonStyles.letterTiles}>
        {arrangedLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={lessonStyles.letterTile}
            onPress={() => onSelectLetter(letter, index)}
          >
            <Text style={lessonStyles.letterText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

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

export default ArrangeStage;
