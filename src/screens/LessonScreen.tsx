import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

interface LessonWord {
  word: string;
  translation: string;
}

interface LessonScreenProps {
  route: {
    params: {
      lessonId: number;
      words: LessonWord[];
    };
  };
}

const LessonScreen: React.FC<LessonScreenProps> = ({ route }) => {
  const { lessonId, words } = route.params;
  const navigation = useNavigation();
  const limitedWords = words.slice(0, 10); // Faqat 10 ta so'z olish

  const stages = [
    {
      id: 1,
      title: "So'zlarni yodlash",
      progress: 0,
      total: 20,
      icon: "book-reader",
    },
    {
      id: 2,
      title: "So'zlarni takrorlash",
      progress: 0,
      total: 20,
      icon: "sync",
    },
    {
      id: 3,
      title: "So'zlarni mustahkamlash",
      progress: 0,
      total: 20,
      icon: "check-circle",
    },
    {
      id: 4,
      title: "So'zlarni yozish",
      progress: 0,
      total: 20,
      icon: "pencil-alt",
    },
  ];

  const handleStagePress = (stageId: number) => {
    // Bu yerda har bir bosqich uchun tegishli o'yin/mashq ochiladi
    navigation.navigate("LessonGame", {
      lessonId,
      stageId,
      words: limitedWords,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Lesson {lessonId}</Text>
        <Text style={styles.progress}>0%</Text>
      </View>

      <ScrollView style={styles.content}>
        {stages.map((stage) => (
          <TouchableOpacity
            key={stage.id}
            style={styles.stageButton}
            onPress={() => handleStagePress(stage.id)}
          >
            <View style={styles.stageIconContainer}>
              <FontAwesome5
                name={stage.icon}
                size={20}
                color="#3C5BFF"
                style={styles.stageIcon}
              />
            </View>
            <View style={styles.stageContent}>
              <Text style={styles.stageTitle}>{stage.title}</Text>
              <Text style={styles.stageProgress}>
                {stage.progress}/{stage.total}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.wordsSection}>
          <Text style={styles.wordsSectionTitle}>O'rganiladigan so'zlar</Text>
          {limitedWords.map((word, index) => (
            <View key={index} style={styles.wordItem}>
              <Text style={styles.word}>{word.word}</Text>
              <Text style={styles.translation}>{word.translation}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1FF",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#000000",
    fontWeight: "600",
  },
  progress: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#3C5BFF",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF1FF",
  },
  stageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  stageIcon: {
    opacity: 0.9,
  },
  stageContent: {
    flex: 1,
    marginLeft: 16,
  },
  stageTitle: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Lexend_400Regular",
    fontWeight: "500",
    marginBottom: 4,
  },
  stageProgress: {
    fontSize: 14,
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
  },
  wordsSection: {
    marginTop: 24,
    backgroundColor: "#F8F9FF",
    borderRadius: 12,
    padding: 16,
  },
  wordsSectionTitle: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Lexend_400Regular",
    fontWeight: "600",
    marginBottom: 16,
  },
  wordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1FF",
  },
  word: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Lexend_400Regular",
    fontWeight: "500",
  },
  translation: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Lexend_400Regular",
  },
});

export default LessonScreen;
