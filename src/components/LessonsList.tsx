import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface LessonWord {
  word: string;
  translation: string;
}

interface LessonsListProps {
  level: string;
  cardId: number;
  title: string;
  currentLesson: number;
  onLessonPress: (lessonId: number, words: LessonWord[]) => void;
}

interface LessonCardProps {
  lessonId: number;
  isLocked: boolean;
  progress: number;
  words: LessonWord[];
  onPress: () => void;
}

const LessonStages = ({ currentStage = 1 }) => {
  return (
    <View style={styles.stagesContainer}>
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View style={styles.stageIconContainer}>
            <FontAwesome5
              name="book-reader"
              size={14}
              color="#3C5BFF"
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>1</Text>
        </View>
      </View>
      <View
        style={[
          styles.stageLine,
          currentStage > 1 ? styles.stageLineActive : styles.stageLineInactive,
        ]}
      />
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View style={styles.stageIconContainer}>
            <FontAwesome5
              name="sync"
              size={14}
              color="#3C5BFF"
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>2</Text>
        </View>
      </View>
      <View
        style={[
          styles.stageLine,
          currentStage > 2 ? styles.stageLineActive : styles.stageLineInactive,
        ]}
      />
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View style={styles.stageIconContainer}>
            <FontAwesome5
              name="check-circle"
              size={14}
              color="#3C5BFF"
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>3</Text>
        </View>
      </View>
      <View
        style={[
          styles.stageLine,
          currentStage > 3 ? styles.stageLineActive : styles.stageLineInactive,
        ]}
      />
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View style={styles.stageIconContainer}>
            <FontAwesome5
              name="pencil-alt"
              size={14}
              color="#3C5BFF"
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>4</Text>
        </View>
      </View>
    </View>
  );
};

const LessonCard: React.FC<LessonCardProps> = ({
  lessonId,
  isLocked,
  progress,
  words,
  onPress,
}) => {
  const currentStage = Math.floor((progress / 100) * 4) + 1;

  return (
    <TouchableOpacity
      style={[
        styles.lessonCard,
        isLocked ? styles.lockedCard : styles.unlockedCard,
      ]}
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={styles.lessonHeader}>
        <View style={styles.titleProgressContainer}>
          <Text style={styles.lessonTitle}>{lessonId}-dars</Text>
          <Text
            style={[
              styles.progressPercentage,
              progress > 0 && styles.activeProgress,
            ]}
          >
            {progress}%
          </Text>
        </View>
        {!isLocked && (
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="bitcoin" size={12} color="#FFD700" />
            <Text style={styles.coinsText}>+5</Text>
          </View>
        )}
      </View>

      <LessonStages currentStage={currentStage} />

      {isLocked && (
        <View style={styles.lockOverlay}>
          <FontAwesome5 name="lock" size={20} color="#3C5BFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const LessonsList: React.FC<LessonsListProps> = ({
  level,
  cardId,
  title,
  currentLesson,
  onLessonPress,
}) => {
  // Test uchun so'zlar
  const lessonsWords: { [key: number]: LessonWord[] } = {
    1: [
      { word: "hello", translation: "salom" },
      { word: "world", translation: "dunyo" },
      { word: "book", translation: "kitob" },
      { word: "pen", translation: "ruchka" },
      { word: "school", translation: "maktab" },
      { word: "teacher", translation: "o'qituvchi" },
      { word: "student", translation: "o'quvchi" },
      { word: "friend", translation: "do'st" },
      { word: "family", translation: "oila" },
    ],
    2: [
      { word: "computer", translation: "kompyuter" },
      { word: "phone", translation: "telefon" },
      { word: "table", translation: "stol" },
    ],
  };

  const lessons = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.levelTitle}>{title}</Text>
      {lessons.map((lessonId) => (
        <LessonCard
          key={lessonId}
          lessonId={lessonId}
          isLocked={lessonId > currentLesson}
          progress={
            lessonId < currentLesson ? 100 : lessonId === currentLesson ? 0 : 0
          }
          words={lessonsWords[lessonId] || []}
          onPress={() => onLessonPress(lessonId, lessonsWords[lessonId] || [])}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
  },
  levelTitle: {
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    color: "#333",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.95,
    backgroundColor: "#F8F9FF",
  },
  unlockedCard: {
    backgroundColor: "#FFFFFF",
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonTitle: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#000000",
    marginRight: 8,
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#000000",
    fontWeight: "500",
  },
  activeProgress: {
    color: "#3C5BFF",
    opacity: 1,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  coinsText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "Lexend_400Regular",
    fontWeight: "600",
  },
  stagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
    position: "relative",
  },
  stageItem: {
    alignItems: "center",
    zIndex: 2,
  },
  stageIconWrapper: {
    alignItems: "center",
  },
  stageIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stageIcon: {
    opacity: 1,
  },
  stageNumber: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "Lexend_400Regular",
    fontWeight: "500",
  },
  stageLine: {
    position: "absolute",
    top: 15,
    left: 40,
    right: 40,
    height: 3,
    zIndex: 1,
  },
  stageLineActive: {
    backgroundColor: "#4B66FF",
  },
  stageLineInactive: {
    backgroundColor: "#E5E9FF",
  },
  lockOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LessonsList;
