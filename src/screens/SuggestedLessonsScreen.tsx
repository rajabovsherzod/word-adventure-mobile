import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Header from "../components/Header";
import LessonsList from "../components/LessonsList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/LoadingScreen";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Foydalanuvchi coins qiymatini AsyncStorage'dan olish
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadUserCoins();
        // Give a slight delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  const handleLessonPress = (lessonId: number) => {
    onStartLesson(lessonId);
  };

  if (isLoading) {
    return <LoadingScreen color="#3C5BFF" />;
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
