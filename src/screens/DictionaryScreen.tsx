import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_600SemiBold,
} from "@expo-google-fonts/lexend";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Word, searchWords, getWordById } from "../data/words";

type Props = {
  setScreen: (screen: string) => void;
  selectedWord: Word | null;
  onWordSelect: (word: Word) => void;
};

const DictionaryScreen: React.FC<Props> = ({
  setScreen,
  selectedWord: initialSelectedWord,
  onWordSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(
    initialSelectedWord
  );
  const [activeTab, setActiveTab] = useState<"english" | "uzbek">("english");
  const [isLoading, setIsLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      const results = searchWords(searchQuery, activeTab);
      setSearchResults(results);
      setIsLoading(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeTab]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setSelectedWord(null);
  };

  const handleWordSelect = (word: Word) => {
    setSelectedWord(word);
    onWordSelect(word);
  };

  const handleBack = () => {
    setScreen("Home");
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderSearchResult = ({ item }: { item: Word }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleWordSelect(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultWord}>
          {activeTab === "english" ? item.english : item.uzbek}
        </Text>
        <Text style={styles.resultTranslation}>
          {activeTab === "english" ? item.uzbek : item.english}
        </Text>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="#3C5BFF" />
    </TouchableOpacity>
  );

  const renderWordDetails = () => {
    if (!selectedWord) return null;

    return (
      <View style={styles.wordDetailsContainer}>
        <View style={styles.wordHeader}>
          <Text style={styles.wordTitle}>{selectedWord.english}</Text>
          <Text style={styles.wordTranslation}>{selectedWord.uzbek}</Text>
        </View>

        <View style={styles.definitionContainer}>
          <Text style={styles.definitionTitle}>Definition:</Text>
          <Text style={styles.definitionText}>
            {selectedWord.englishDefinition}
          </Text>
          <Text style={styles.definitionTextUz}>
            {selectedWord.uzbekDefinition}
          </Text>
        </View>

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          {selectedWord.examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Text style={styles.exampleText}>{example.english}</Text>
              <Text style={styles.exampleTextUz}>{example.uzbek}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedWord(null)}
        >
          <Text style={styles.backButtonText}>Back to search</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3C5BFF" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dictionary</Text>
      </View>

      {!selectedWord ? (
        <>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <FontAwesome5
                name="search"
                size={16}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search words..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#999"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => handleSearch("")}
                >
                  <FontAwesome5 name="times" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "english" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("english")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "english" && styles.activeTabText,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "uzbek" && styles.activeTab]}
                onPress={() => setActiveTab("uzbek")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "uzbek" && styles.activeTabText,
                  ]}
                >
                  O'zbek
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
            />
          ) : searchQuery.length > 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Image
                source={require("../../assets/images/main_background.png")}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>
                Search for words in English or Uzbek
              </Text>
            </View>
          )}
        </>
      ) : (
        renderWordDetails()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#3C5BFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lexend_600SemiBold",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },
  clearButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3C5BFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lexend_400Regular",
  },
  activeTabText: {
    color: "#3C5BFF",
    fontFamily: "Lexend_600SemiBold",
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultContent: {
    flex: 1,
  },
  resultWord: {
    fontSize: 16,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 4,
  },
  resultTranslation: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
    textAlign: "center",
  },
  wordDetailsContainer: {
    flex: 1,
    padding: 16,
  },
  wordHeader: {
    marginBottom: 24,
  },
  wordTitle: {
    fontSize: 28,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 8,
  },
  wordTranslation: {
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  definitionContainer: {
    marginBottom: 24,
  },
  definitionTitle: {
    fontSize: 18,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#333",
    marginBottom: 8,
    lineHeight: 24,
  },
  definitionTextUz: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
    lineHeight: 24,
  },
  examplesContainer: {
    marginBottom: 24,
  },
  examplesTitle: {
    fontSize: 18,
    fontFamily: "Lexend_600SemiBold",
    color: "#333",
    marginBottom: 12,
  },
  exampleItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  exampleText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#333",
    marginBottom: 4,
    lineHeight: 24,
  },
  exampleTextUz: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: "#3C5BFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lexend_600SemiBold",
  },
});

export default DictionaryScreen;
