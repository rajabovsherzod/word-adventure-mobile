import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import LessonsList from "../components/LessonsList";

type Props = {
  setScreen: (screen: string) => void;
  cardId: number;
  cardTitle: string;
  onStartLesson: (lessonId: number) => void;
  coins: number;
};

const SuggestedLessonsScreen: React.FC<Props> = ({
  setScreen,
  cardId,
  cardTitle,
  onStartLesson,
  coins,
}) => {
  const handleLessonPress = (lessonId: number) => {
    onStartLesson(lessonId);
  };

    return (
    <View style={styles.container}>
      <Header
        title={cardTitle}
        onBack={() => setScreen("Home")}
        coins={coins}
      />
      <LessonsList
        level={cardTitle}
        cardId={cardId}
        title={cardTitle}
        currentLesson={1}
        onLessonPress={handleLessonPress}
      />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});

export default SuggestedLessonsScreen;
