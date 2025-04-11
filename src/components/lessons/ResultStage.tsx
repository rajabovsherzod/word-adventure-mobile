import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { lessonStyles } from "../../styles/LessonStyles";

interface ResultStageProps {
  score: number;
  totalWords: number;
  onPlayAgain: () => void;
  onFinish: () => void;
}

const ResultStage: React.FC<ResultStageProps> = ({
  score,
  totalWords,
  onPlayAgain,
  onFinish,
}) => {
  // Foiz hisoblanishi
  const percentage = Math.round((score / totalWords) * 100);

  // Natija bo'yicha xabar
  const getMessage = () => {
    if (percentage >= 90) {
      return "Ajoyib natija! Siz ushbu darsni a'lo o'zlashtirgansiz.";
    } else if (percentage >= 70) {
      return "Yaxshi natija! Siz ushbu darsda yaxshi bilim olishga erishdingiz.";
    } else if (percentage >= 50) {
      return "Qoniqarli natija. Siz asosiy so'zlarni o'rganib oldingiz.";
    } else {
      return "Darsni takrorlashni tavsiya etamiz.";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.resultCard}>
        <FontAwesome5
          name="trophy"
          size={60}
          color={percentage >= 70 ? "#FFD700" : "#C0C0C0"}
          style={styles.resultIcon}
        />

        <Text style={styles.resultTitle}>Tabriklaymiz!</Text>

        <Text style={styles.resultScore}>
          Siz {totalWords} ta so'zdan {score} tasini o'rgandingiz
        </Text>

        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
        </View>

        <Text style={styles.resultMessage}>{getMessage()}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onPlayAgain}
          >
            <FontAwesome5 name="redo" size={16} color="#3C5BFF" />
            <Text style={styles.secondaryButtonText}>Qayta o'ynash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onFinish}
          >
            <Text style={styles.primaryButtonText}>Davom etish</Text>
            <FontAwesome5 name="arrow-right" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
  },
  percentageContainer: {
    width: "100%",
    marginBottom: 24,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C5BFF",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E6E6E6",
    borderRadius: 4,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  resultMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: "#3C5BFF",
  },
  secondaryButton: {
    backgroundColor: "#EFF3FF",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
  },
  secondaryButtonText: {
    color: "#3C5BFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ResultStage;
