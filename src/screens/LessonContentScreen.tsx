import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LessonContentProps = {
  setScreen: (screen: string) => void;
};

// Dars bosqichlari
enum LessonStep {
  EXPLANATION = "explanation",
  EXAMPLES = "examples",
  PRACTICE = "practice",
  QUIZ = "quiz",
  FINISH = "finish",
}

const LessonContentScreen: React.FC<LessonContentProps> = ({ setScreen }) => {
  const [currentStep, setCurrentStep] = useState<LessonStep>(
    LessonStep.EXPLANATION
  );
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Dars ma'lumotlarini yuklash
  useEffect(() => {
    const loadLessonData = async () => {
      try {
        const lessonJSON = await AsyncStorage.getItem("currentLesson");
        if (lessonJSON) {
          const lessonInfo = JSON.parse(lessonJSON);
          setLessonData(lessonInfo);

          // Dars ma'lumotlarini yuklash
          if (lessonInfo.lessonId === "beginner-mod-1-les-1") {
            // Present Simple darsi uchun maxsus ma'lumotlar
            // Bu ma'lumotlar statik, lekin kelajakda server/bazadan olinishi mumkin
          }
        }
      } catch (error) {
        console.error("Error loading lesson data:", error);
        Alert.alert("Xatolik", "Dars ma'lumotlarini yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, []);

  const handleNextStep = () => {
    switch (currentStep) {
      case LessonStep.EXPLANATION:
        setCurrentStep(LessonStep.EXAMPLES);
        break;
      case LessonStep.EXAMPLES:
        setCurrentStep(LessonStep.PRACTICE);
        break;
      case LessonStep.PRACTICE:
        setCurrentStep(LessonStep.QUIZ);
        break;
      case LessonStep.QUIZ:
        if (currentQuizIndex < presentSimpleQuiz.length - 1) {
          setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
          // Quiz yakunlandi
          setCurrentStep(LessonStep.FINISH);
        }
        break;
      case LessonStep.FINISH:
        // Kursga qaytish
        setScreen("CourseDetails");
        break;
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuiz = presentSimpleQuiz[currentQuizIndex];
    const selectedAnswer = currentQuiz.options[answerIndex];

    // Javobni saqlash
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = selectedAnswer;
    setQuizAnswers(newAnswers);

    // To'g'ri javob tekshirish
    if (selectedAnswer === currentQuiz.correctAnswer) {
      setScore(score + 1);
      Alert.alert("To'g'ri!", "Siz to'g'ri javob berdingiz.");
    } else {
      Alert.alert("Noto'g'ri", `To'g'ri javob: ${currentQuiz.correctAnswer}`);
    }

    // Keyingi savolga o'tish
    setTimeout(() => {
      handleNextStep();
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3C5BFF" />
        <Text style={styles.loadingText}>Dars yuklanmoqda...</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (currentStep) {
      case LessonStep.EXPLANATION:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Present Simple</Text>
            <Text style={styles.subtitle}>Hozirgi oddiy zamon</Text>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>
                Present Simple (Hozirgi oddiy zamon) muntazam takrorlanadigan
                harakatlar, doimiy holatlar, umumiy haqiqatlar va odatlarni
                ifodalash uchun ishlatiladi.
              </Text>

              <Text style={styles.subHeader}>Qo'llanilishi:</Text>
              <Text style={styles.bulletPoint}>
                • Muntazam takrorlanadigan harakatlar uchun
              </Text>
              <Text style={styles.bulletPoint}>• Doimiy holatlar uchun</Text>
              <Text style={styles.bulletPoint}>• Umumiy haqiqatlar uchun</Text>
              <Text style={styles.bulletPoint}>• Odatlar uchun</Text>

              <Text style={styles.subHeader}>Tuzilishi:</Text>
              <Text style={styles.explanationText}>
                <Text style={styles.bold}>Tasdiq gap:</Text>
                {"\n"}
                I/You/We/They + verb{"\n"}
                He/She/It + verb + s/es{"\n\n"}
                <Text style={styles.bold}>Inkor gap:</Text>
                {"\n"}
                I/You/We/They + do not (don't) + verb{"\n"}
                He/She/It + does not (doesn't) + verb{"\n\n"}
                <Text style={styles.bold}>Savol gap:</Text>
                {"\n"}
                Do + I/you/we/they + verb?{"\n"}
                Does + he/she/it + verb?
              </Text>
            </View>
          </View>
        );

      case LessonStep.EXAMPLES:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Present Simple - Misollar</Text>

            <View style={styles.exampleBox}>
              <Text style={styles.subHeader}>Tasdiq gaplar:</Text>
              <Text style={styles.example}>
                I <Text style={styles.highlight}>work</Text> in a bank.
              </Text>
              <Text style={styles.exampleTranslation}>
                Men bankda ishlayman.
              </Text>

              <Text style={styles.example}>
                She <Text style={styles.highlight}>lives</Text> in Tashkent.
              </Text>
              <Text style={styles.exampleTranslation}>
                U Toshkentda yashaydi.
              </Text>

              <Text style={styles.example}>
                Water <Text style={styles.highlight}>boils</Text> at 100
                degrees.
              </Text>
              <Text style={styles.exampleTranslation}>
                Suv 100 darajada qaynaydi.
              </Text>

              <Text style={styles.subHeader}>Inkor gaplar:</Text>
              <Text style={styles.example}>
                I <Text style={styles.highlight}>don't work</Text> on Sundays.
              </Text>
              <Text style={styles.exampleTranslation}>
                Men yakshanbada ishlamayman.
              </Text>

              <Text style={styles.example}>
                He <Text style={styles.highlight}>doesn't speak</Text> French.
              </Text>
              <Text style={styles.exampleTranslation}>
                U fransuzcha gapirmaydi.
              </Text>

              <Text style={styles.subHeader}>Savol gaplar:</Text>
              <Text style={styles.example}>
                <Text style={styles.highlight}>Do you play</Text> tennis?
              </Text>
              <Text style={styles.exampleTranslation}>
                Siz tennis o'ynaysizmi?
              </Text>

              <Text style={styles.example}>
                <Text style={styles.highlight}>Does she like</Text> chocolate?
              </Text>
              <Text style={styles.exampleTranslation}>
                U shokoladni yaxshi ko'radimi?
              </Text>
            </View>
          </View>
        );

      case LessonStep.PRACTICE:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Present Simple - Mashq</Text>

            <View style={styles.practiceBox}>
              <Text style={styles.practiceInstruction}>
                Quyidagi gaplarni o'qing va Present Simple zamonining
                ishlatilishiga e'tibor bering.
              </Text>

              <View style={styles.practiceItem}>
                <Text style={styles.practiceQuestion}>
                  1. I <Text style={styles.highlight}>go</Text> to work by bus.
                </Text>
                <Text style={styles.practiceAnswer}>
                  Men ishga avtobus orqali boraman.
                </Text>
              </View>

              <View style={styles.practiceItem}>
                <Text style={styles.practiceQuestion}>
                  2. My brother <Text style={styles.highlight}>studies</Text>{" "}
                  medicine at university.
                </Text>
                <Text style={styles.practiceAnswer}>
                  Akam universitetda tibbiyot o'qiydi.
                </Text>
              </View>

              <View style={styles.practiceItem}>
                <Text style={styles.practiceQuestion}>
                  3. She <Text style={styles.highlight}>doesn't drink</Text>{" "}
                  coffee in the evening.
                </Text>
                <Text style={styles.practiceAnswer}>
                  U kechqurun qahva ichmaydi.
                </Text>
              </View>

              <View style={styles.practiceItem}>
                <Text style={styles.practiceQuestion}>
                  4. <Text style={styles.highlight}>Do they live</Text> in
                  Samarkand?
                </Text>
                <Text style={styles.practiceAnswer}>
                  Ular Samarqandda yashashadimi?
                </Text>
              </View>

              <View style={styles.practiceItem}>
                <Text style={styles.practiceQuestion}>
                  5. The Earth <Text style={styles.highlight}>rotates</Text>{" "}
                  around the Sun.
                </Text>
                <Text style={styles.practiceAnswer}>
                  Yer Quyosh atrofida aylanadi.
                </Text>
              </View>
            </View>
          </View>
        );

      case LessonStep.QUIZ:
        const currentQuiz = presentSimpleQuiz[currentQuizIndex];
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Present Simple - Test</Text>
            <Text style={styles.quizProgress}>
              Savol {currentQuizIndex + 1}/{presentSimpleQuiz.length}
            </Text>

            <View style={styles.quizBox}>
              <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>

              {currentQuiz.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quizOption}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <Text style={styles.quizOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case LessonStep.FINISH:
        const percentage = Math.round((score / presentSimpleQuiz.length) * 100);
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Dars yakunlandi!</Text>

            <View style={styles.finishBox}>
              <FontAwesome5 name="trophy" size={60} color="#FFD700" />
              <Text style={styles.congratsText}>Tabriklaymiz!</Text>
              <Text style={styles.scoreText}>
                Sizning natijangiz: {score}/{presentSimpleQuiz.length}
              </Text>
              <Text style={styles.percentageText}>{percentage}%</Text>

              {percentage >= 70 ? (
                <Text style={styles.feedbackText}>
                  Zo'r! Siz Present Simple mavzusini yaxshi o'zlashtirgansiz.
                </Text>
              ) : (
                <Text style={styles.feedbackText}>
                  Yaxshi! Mashqlarni ko'proq bajarishingiz kerak.
                </Text>
              )}
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3C5BFF" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("CourseDetails")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {lessonData?.lessonTitle || "Present Simple"}
        </Text>
        <View style={styles.progressIndicator}>
          <View style={styles.progressStep}>
            <View
              style={[
                styles.step,
                currentStep === LessonStep.EXPLANATION
                  ? styles.activeStep
                  : currentStep !== LessonStep.EXPLANATION
                  ? styles.completedStep
                  : {},
              ]}
            />
            <Text style={styles.stepText}>Nazariya</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View
              style={[
                styles.step,
                currentStep === LessonStep.EXAMPLES
                  ? styles.activeStep
                  : currentStep > LessonStep.EXAMPLES
                  ? styles.completedStep
                  : {},
              ]}
            />
            <Text style={styles.stepText}>Misollar</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View
              style={[
                styles.step,
                currentStep === LessonStep.PRACTICE
                  ? styles.activeStep
                  : currentStep > LessonStep.PRACTICE
                  ? styles.completedStep
                  : {},
              ]}
            />
            <Text style={styles.stepText}>Mashq</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View
              style={[
                styles.step,
                currentStep === LessonStep.QUIZ ||
                currentStep === LessonStep.FINISH
                  ? styles.activeStep
                  : {},
              ]}
            />
            <Text style={styles.stepText}>Test</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>{renderContent()}</ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>
            {currentStep === LessonStep.FINISH ? "Yakunlash" : "Davom etish"}
          </Text>
          <FontAwesome5 name="arrow-right" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Test savollari
const presentSimpleQuiz = [
  {
    question: "He ___ in a bank.",
    options: ["work", "works", "working", "worked"],
    correctAnswer: "works",
  },
  {
    question: "I ___ tennis every weekend.",
    options: ["play", "plays", "playing", "am play"],
    correctAnswer: "play",
  },
  {
    question: "She ___ coffee in the morning.",
    options: ["drinks", "drink", "drinking", "is drink"],
    correctAnswer: "drinks",
  },
  {
    question: "They ___ English very well.",
    options: ["speaks", "not speak", "speaking", "don't speak"],
    correctAnswer: "don't speak",
  },
  {
    question: "___ she live in Tashkent?",
    options: ["Do", "Does", "Is", "Are"],
    correctAnswer: "Does",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  header: {
    backgroundColor: "#3C5BFF",
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  progressIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  progressStep: {
    alignItems: "center",
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "white",
  },
  activeStep: {
    backgroundColor: "#FFD700",
  },
  completedStep: {
    backgroundColor: "#4CAF50",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  stepText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  contentContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  explanationBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C5BFF",
    marginTop: 15,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginLeft: 10,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  exampleBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  example: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 5,
  },
  exampleTranslation: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 15,
  },
  highlight: {
    color: "#3C5BFF",
    fontWeight: "bold",
  },
  practiceBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceInstruction: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  practiceItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  practiceQuestion: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 5,
  },
  practiceAnswer: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  quizBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quizProgress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  quizOption: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  quizOptionText: {
    fontSize: 16,
    color: "#333",
  },
  finishBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3C5BFF",
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomBar: {
    backgroundColor: "white",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nextButton: {
    backgroundColor: "#3C5BFF",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default LessonContentScreen;
