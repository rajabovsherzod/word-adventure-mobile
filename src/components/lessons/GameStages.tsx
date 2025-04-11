import React from "react";
import { View, StyleSheet } from "react-native";
import { Word } from "../../types/lesson";
import MemorizeStage from "./MemorizeStage";
import MatchStage from "./MatchStage";
import ArrangeStage from "./ArrangeStage";
import WriteStage from "./WriteStage";
import ResultStage from "./ResultStage";

interface GameStagesProps {
  stage: string;
  words: Word[];
  currentWordIndex: number;
  totalWords: number;
  progress: number;
  score: number;
  options: string[];
  selectedOption?: string;
  showCorrectAnswer?: boolean;
  userInput: string;
  matchedPairs: { english: string; uzbek: string }[];
  selectedEnglishWord: string | null;
  selectedUzbekWord: string | null;
  arrangedLetters: string[];
  // Handlers
  onSelectOption: (option: string) => void;
  onNextWord: () => void;
  onSelectEnglish: (english: string) => void;
  onSelectUzbek: (uzbek: string) => void;
  onArrangeLetter: (letter: string, index: number) => void;
  onChangeUserInput: (text: string) => void;
  onSubmitUserInput: () => void;
  onPlayAgain: () => void;
  onFinish: () => void;
}

const GameStages: React.FC<GameStagesProps> = ({
  stage,
  words,
  currentWordIndex,
  totalWords,
  progress,
  score,
  options,
  selectedOption,
  showCorrectAnswer,
  userInput,
  matchedPairs,
  selectedEnglishWord,
  selectedUzbekWord,
  arrangedLetters,
  onSelectOption,
  onNextWord,
  onSelectEnglish,
  onSelectUzbek,
  onArrangeLetter,
  onChangeUserInput,
  onSubmitUserInput,
  onPlayAgain,
  onFinish,
}) => {
  // Joriy so'z
  const currentWord = words[currentWordIndex] || words[0];

  // Bosqichga qarab kerakli komponenti qaytaradi
  switch (stage) {
    case "memorize":
      return (
        <MemorizeStage
          word={currentWord}
          options={options}
          onSelectOption={onSelectOption}
          progress={progress}
          currentIndex={currentWordIndex + 1}
          totalWords={totalWords}
          selectedOption={selectedOption}
          showCorrectAnswer={showCorrectAnswer}
          onNextWord={onNextWord}
        />
      );

    case "match":
      return (
        <MatchStage
          words={words}
          matchedPairs={matchedPairs}
          selectedEnglishWord={selectedEnglishWord}
          selectedUzbekWord={selectedUzbekWord}
          onSelectEnglish={onSelectEnglish}
          onSelectUzbek={onSelectUzbek}
        />
      );

    case "arrange":
      return (
        <ArrangeStage
          word={currentWord}
          arrangedLetters={arrangedLetters}
          onSelectLetter={onArrangeLetter}
          progress={progress}
          currentIndex={currentWordIndex + 1}
          totalWords={totalWords}
        />
      );

    case "write":
      return (
        <WriteStage
          word={currentWord}
          userInput={userInput}
          setUserInput={onChangeUserInput}
          onSubmit={onSubmitUserInput}
          progress={progress}
          currentIndex={currentWordIndex + 1}
          totalWords={totalWords}
        />
      );

    case "complete":
      return (
        <ResultStage
          score={score}
          totalWords={totalWords}
          onPlayAgain={onPlayAgain}
          onFinish={onFinish}
        />
      );

    default:
      return <View style={styles.container} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GameStages;
