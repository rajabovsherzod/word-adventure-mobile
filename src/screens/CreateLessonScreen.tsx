import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

type Word = {
  id: string;
  english: string;
  uzbek: string;
};

type Props = {
  setScreen: (screen: string) => void;
};

const MOCK_WORDS: Word[] = [
  { id: "1", english: "hello", uzbek: "salom" },
  { id: "2", english: "world", uzbek: "dunyo" },
  { id: "3", english: "book", uzbek: "kitob" },
  { id: "4", english: "pen", uzbek: "ruchka" },
  { id: "5", english: "school", uzbek: "maktab" },
  { id: "6", english: "teacher", uzbek: "o'qituvchi" },
  { id: "7", english: "student", uzbek: "o'quvchi" },
  { id: "8", english: "friend", uzbek: "do'st" },
  { id: "9", english: "family", uzbek: "oila" },
  { id: "10", english: "house", uzbek: "uy" },
  { id: "11", english: "car", uzbek: "mashina" },
  { id: "12", english: "phone", uzbek: "telefon" },
  { id: "13", english: "computer", uzbek: "kompyuter" },
  { id: "14", english: "water", uzbek: "suv" },
  { id: "15", english: "food", uzbek: "ovqat" },
  { id: "16", english: "time", uzbek: "vaqt" },
  { id: "17", english: "day", uzbek: "kun" },
  { id: "18", english: "night", uzbek: "tun" },
  { id: "19", english: "sun", uzbek: "quyosh" },
  { id: "20", english: "moon", uzbek: "oy" },
];

const CreateLessonScreen: React.FC<Props> = ({ setScreen }) => {
  const [lessonName, setLessonName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  let [fontsLoaded] = useFonts({ Lexend_400Regular });

  const handleSearch = (text: string) => {
    setSearchText(text);
    // Filter words based on search text
    const filteredResults = MOCK_WORDS.filter(
      (word) =>
        word.english.toLowerCase().includes(text.toLowerCase()) ||
        word.uzbek.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const addWord = (word: Word) => {
    if (!selectedWords.find((w) => w.id === word.id)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const removeWord = (wordId: string) => {
    setSelectedWords(selectedWords.filter((w) => w.id !== wordId));
  };

  const handleSave = async () => {
    if (!lessonName.trim()) {
      Alert.alert("Xatolik", "Iltimos, dars nomini kiriting");
      return;
    }

    if (selectedWords.length === 0) {
      Alert.alert("Xatolik", "Iltimos, kamida bitta so'z tanlang");
      return;
    }

    try {
      // Mavjud darslarni olish
      const savedLessonsStr = await AsyncStorage.getItem("lessons");
      const savedLessons = savedLessonsStr ? JSON.parse(savedLessonsStr) : [];

      // Yangi darsni qo'shish
      const newLesson = {
        id: Date.now().toString(),
        name: lessonName.trim(),
        words: selectedWords,
      };

      const updatedLessons = [...savedLessons, newLesson];
      await AsyncStorage.setItem("lessons", JSON.stringify(updatedLessons));

      Alert.alert("Muvaffaqiyatli", "Dars saqlandi", [
        {
          text: "OK",
          onPress: () => setScreen("Lessons"),
        },
      ]);
    } catch (error) {
      console.error("Error saving lesson:", error);
      Alert.alert("Xatolik", "Darsni saqlashda xatolik yuz berdi");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("Lessons")}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yangi dars</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Saqlash</Text>
        </TouchableOpacity>
      </View>

      {/* Lesson Name Input */}
      <View style={styles.nameInputContainer}>
        <TextInput
          style={styles.nameInput}
          placeholder="Dars nomi"
          value={lessonName}
          onChangeText={setLessonName}
        />
      </View>

      {/* Search Words */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <FontAwesome5
            name="search"
            size={18}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="So'z qidirish"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Selected Words */}
      <View style={styles.selectedWordsContainer}>
        <Text style={styles.sectionTitle}>Tanlangan so'zlar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedWords.map((word) => (
            <TouchableOpacity
              key={word.id}
              style={styles.selectedWordChip}
              onPress={() => removeWord(word.id)}
            >
              <Text style={styles.selectedWordText}>{word.english}</Text>
              <FontAwesome5 name="times" size={14} color="white" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Results */}
      <ScrollView style={styles.searchResults}>
        {searchResults.map((word) => (
          <TouchableOpacity
            key={word.id}
            style={styles.wordCard}
            onPress={() => addWord(word)}
          >
            <View>
              <Text style={styles.englishWord}>{word.english}</Text>
              <Text style={styles.uzbekWord}>{word.uzbek}</Text>
            </View>
            <FontAwesome5
              name="plus"
              size={20}
              color="#3C5BFF"
              style={styles.addIcon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#3C5BFF",
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  nameInputContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  nameInput: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#333",
  },
  searchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#333",
  },
  selectedWordsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Lexend_400Regular",
    marginBottom: 10,
  },
  selectedWordChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C5BFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedWordText: {
    color: "white",
    marginRight: 8,
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  searchResults: {
    flex: 1,
    padding: 20,
  },
  wordCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 10,
  },
  englishWord: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend_400Regular",
    marginBottom: 4,
  },
  uzbekWord: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  addIcon: {
    padding: 5,
  },
});

export default CreateLessonScreen;
