import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Header from "../components/Header";

type Props = {
  setScreen: (screen: string) => void;
  cardId: number;
  cardTitle: string;
  onStartLesson: (lessonId: number) => void;
  addCoins: (amount: number) => void;
  coins: number;
};

const SuggestedLessonsScreen: React.FC<Props> = ({
  setScreen,
  cardId,
  cardTitle,
  onStartLesson,
  addCoins,
  coins,
}) => {
  const suggestedLessons = [
    {
      id: 1,
      title: "Greeting Words",
      description: "Learn basic greeting words in English",
      coins: 10,
      difficulty: "Easy",
      duration: "5 min",
    },
    {
      id: 2,
      title: "Common Phrases",
      description: "Essential phrases for daily conversations",
      coins: 15,
      difficulty: "Medium",
      duration: "8 min",
    },
    {
      id: 3,
      title: "Numbers 1-20",
      description: "Learn to count in English",
      coins: 12,
      difficulty: "Easy",
      duration: "6 min",
    },
  ];

  const handleStartLesson = (lessonId: number, coinsReward: number) => {
    onStartLesson(lessonId);
    addCoins(coinsReward);
  };

  return (
    <View style={styles.container}>
      <Header
        title={cardTitle}
        onBack={() => setScreen("Home")}
        coins={coins}
      />

      <ScrollView style={styles.content}>
        {suggestedLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => handleStartLesson(lesson.id, lesson.coins)}
          >
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <View style={styles.coinsContainer}>
                <FontAwesome5 name="coins" size={16} color="#FFD700" />
                <Text style={styles.coinsText}>{lesson.coins}</Text>
              </View>
            </View>

            <Text style={styles.lessonDescription}>{lesson.description}</Text>

            <View style={styles.lessonFooter}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{lesson.difficulty}</Text>
              </View>
              <View style={styles.tagContainer}>
                <FontAwesome5 name="clock" size={12} color="#666" />
                <Text style={[styles.tagText, styles.durationText]}>
                  {lesson.duration}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lessonCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinsText: {
    marginLeft: 4,
    color: "#B8860B",
    fontWeight: "600",
  },
  lessonDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  lessonFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  durationText: {
    marginLeft: 4,
  },
});

export default SuggestedLessonsScreen;
