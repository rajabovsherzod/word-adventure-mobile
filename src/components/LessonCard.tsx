import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// Stage status interface
interface StageStatus {
  memorize: boolean;
  match: boolean;
  arrange: boolean;
  write: boolean;
}

interface LessonCardProps {
  lessonId: number;
  isLocked: boolean;
  progress: number;
  words: {
    word: string;
    translation: string;
  }[];
  onPress: () => void;
  stageStatus?: StageStatus;
  level?: string;
}

const LessonStages = ({
  currentStage = 1,
  stageStatus,
  progress = 0,
}: {
  currentStage?: number;
  stageStatus?: StageStatus;
  progress?: number;
}) => {
  // Default stages if no status provided
  const completedStages = stageStatus || {
    memorize: false,
    match: false,
    arrange: false,
    write: false,
  };

  // Progressga qarab chiziqlarni ranglash
  const isLine1Active = progress >= 25 || completedStages.memorize;
  const isLine2Active = progress >= 50 || completedStages.match;
  const isLine3Active = progress >= 75 || completedStages.arrange;

  // Progressga qarab bosqichlarni ranglash (agar completedStages bo'lmasa)
  const isStage1Active = progress >= 25 || completedStages.memorize;
  const isStage2Active = progress >= 50 || completedStages.match;
  const isStage3Active = progress >= 75 || completedStages.arrange;
  const isStage4Active = progress >= 100 || completedStages.write;

  return (
    <View style={styles.stagesContainer}>
      {/* Stage 1 - Memorize */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              isStage1Active && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="book-reader"
              size={14}
              color={isStage1Active ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>1</Text>
        </View>
      </View>

      {/* Stage 2 - Match */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              isStage2Active && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="sync"
              size={14}
              color={isStage2Active ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>2</Text>
        </View>
      </View>

      {/* Stage 3 - Arrange */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              isStage3Active && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="check-circle"
              size={14}
              color={isStage3Active ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>3</Text>
        </View>
      </View>

      {/* Stage 4 - Write */}
      <View style={styles.stageItem}>
        <View style={styles.stageIconWrapper}>
          <View
            style={[
              styles.stageIconContainer,
              isStage4Active && styles.completedStageIcon,
            ]}
          >
            <FontAwesome5
              name="pencil-alt"
              size={14}
              color={isStage4Active ? "#FFFFFF" : "#3C5BFF"}
              style={styles.stageIcon}
            />
          </View>
          <Text style={styles.stageNumber}>4</Text>
        </View>
      </View>

      {/* Chiziqlar - endi ustma-ust joylashtirilib, zIndex bilan tartiblanadi */}
      {/* Line 1 (between stage 1 and 2) */}
      <View
        style={[
          styles.stageLine,
          { left: "8%", width: "29%" },
          isLine1Active ? styles.stageLineActive : styles.stageLineInactive,
        ]}
      />

      {/* Line 2 (between stage 2 and 3) */}
      <View
        style={[
          styles.stageLine,
          { left: "36%", width: "29%" },
          isLine2Active ? styles.stageLineActive : styles.stageLineInactive,
        ]}
      />

      {/* Line 3 (between stage 3 and 4) */}
      <View
        style={[
          styles.stageLine,
          { left: "64%", width: "31%" },
          isLine3Active ? styles.stageLineActive : styles.stageLineInactive,
        ]}
      />
    </View>
  );
};

const LessonCard: React.FC<LessonCardProps> = ({
  lessonId,
  isLocked,
  progress,
  words,
  onPress,
  stageStatus,
  level,
}) => {
  // Keep currentStage for backwards compatibility
  const currentStage = Math.floor((progress / 100) * 4) + 1;

  // Level formatini saqlab qolish uchun
  let numericLevel = "";
  if (level === "Beginner") numericLevel = "1";
  if (level === "Intermediate") numericLevel = "2";
  if (level === "Advanced") numericLevel = "3";

  // Dars 100% tugatilganligini tekshirish
  const isLessonCompleted = progress === 100;

  // Debug
  // console.log(`LessonCard ${lessonId} rendering: Progress=${progress}, Level=${level}, StageStatus:`, stageStatus);

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
          {/* Dars raqami - bu yerda formati ko'rinmaydi */}
          <Text style={styles.lessonTitle}>{lessonId}-dars</Text>
          <Text
            style={[
              styles.progressPercentage,
              progress > 0 && styles.activeProgress,
            ]}
          >
            {Math.round(progress)}%
          </Text>
        </View>
        {!isLocked && !isLessonCompleted && (
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="bitcoin" size={12} color="#FFD700" />
            <Text style={styles.coinsText}>+10</Text>
          </View>
        )}
        {!isLocked && isLessonCompleted && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>Bajarildi</Text>
          </View>
        )}
      </View>

      <LessonStages
        currentStage={currentStage}
        stageStatus={stageStatus}
        progress={progress}
      />

      {isLocked && (
        <View style={styles.lockOverlay}>
          <FontAwesome5 name="lock" size={20} color="#3C5BFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    color: "#4CAF50",
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
  completedContainer: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  completedText: {
    fontSize: 10,
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
    height: 60,
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
    borderWidth: 1,
    borderColor: "#D0D5FF",
  },
  completedStageIcon: {
    backgroundColor: "#4CAF50",
    borderWidth: 0,
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
    top: 14, // Iconning o'rtasiga to'g'rilash (markazi)
    height: 4, // Yo'g'onroq chiziq
    zIndex: 1,
  },
  stageLineActive: {
    backgroundColor: "#4CAF50",
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

export default LessonCard;
