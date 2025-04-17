import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Header from "../components/Header";
import LessonsList from "../components/LessonsList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";

type Props = {
  setScreen: (screen: string) => void;
  cardId: number;
  cardTitle: string;
  onStartLesson: (lessonId: number) => void;
  coins: number;
  currentLesson: number;
  onLessonComplete: (level: string, lessonId: number) => void;
};

const SuggestedLessonsScreen: React.FC<Props> = ({
  setScreen,
  cardId,
  cardTitle,
  onStartLesson,
  coins,
  currentLesson,
  onLessonComplete,
}) => {
  const [userCoins, setUserCoins] = useState<number>(coins || 0);
  let [fontsLoaded] = useFonts({ Lexend_400Regular });

  // Foydalanuvchi coins qiymatini AsyncStorage'dan olish
  useEffect(() => {
    const loadUserCoins = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("user");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.coins !== undefined) {
            setUserCoins(userData.coins);
          }
        }
      } catch (error) {
        console.error("Error loading user coins:", error);
      }
    };

    loadUserCoins();
  }, []);

  const handleLessonPress = (lessonId: number) => {
    onStartLesson(lessonId);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header
        title={cardTitle}
        onBack={() => setScreen("Home")}
        coins={userCoins}
      />
      <LessonsList
        level={cardTitle}
        cardId={cardId}
        title={cardTitle}
        currentLesson={currentLesson}
        onLessonPress={handleLessonPress}
        onLessonComplete={(lessonId) => onLessonComplete(cardTitle, lessonId)}
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
