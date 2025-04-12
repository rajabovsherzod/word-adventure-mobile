import React, { useState, useRef, useEffect } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  StatusBar,
  Platform,
  Dimensions,
  FlatList,
} from "react-native";
import { useFonts, Lexend_400Regular } from "@expo-google-fonts/lexend";
import { searchWords, Word, getWordsByCardAndLesson } from "../data/words";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
const PROFILE_HEIGHT = 80;
const HEADER_EXTRA_HEIGHT = 30;
const INITIAL_HEADER_HEIGHT = 400 + STATUSBAR_HEIGHT;
const MINIMUM_HEADER_HEIGHT = PROFILE_HEIGHT + 110 + STATUSBAR_HEIGHT;
const SCROLL_DISTANCE = INITIAL_HEADER_HEIGHT - MINIMUM_HEADER_HEIGHT;
const SEARCH_PANEL_EXTRA_HEIGHT = 50;

type Props = {
  setIsAuthenticated: (value: boolean) => void;
  setScreen: (screen: string) => void;
  onWordSelect: (word: Word) => void;
  unreadNotificationsCount: number;
  onCardSelect: (cardId: number, level: string) => void;
};

const HomeScreen: React.FC<Props> = ({
  setIsAuthenticated,
  setScreen,
  onWordSelect,
  unreadNotificationsCount,
  onCardSelect,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [countId, setCountId] = useState<number>(0);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
          setCountId(user.countId);
        }
      } catch (error) {
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", error);
      }
    };

    getUserData();
  }, []);

  // Interpolate values for animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [INITIAL_HEADER_HEIGHT, MINIMUM_HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.6],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -(SCROLL_DISTANCE - PROFILE_HEIGHT - 130)],
    extrapolate: "clamp",
  });

  const handleSearchPress = () => {
    setIsSearchFocused(true);
    Animated.spring(searchAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  };

  const handleCloseSearch = () => {
    Keyboard.dismiss();
    Animated.spring(searchAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 15,
      friction: 8,
      velocity: 0.1,
    }).start(() => {
      setSearchText("");
      setIsSearchFocused(false);
      setIsSearching(false);
      setSearchResults([]);
    });
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);

    if (text.trim()) {
      setIsSearching(true);
      // So'zlar bazasidan qidiruv
      const results = searchWords(text);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleWordSelect = (word: Word) => {
    // Tanlangan so'zni lug'at ekraniga yo'naltirish
    onWordSelect(word);
    handleCloseSearch();
  };

  const handleSubmitSearch = () => {
    if (searchText.trim()) {
      setIsSearching(true);
      console.log("Search submitted:", searchText);
      setScreen("Dictionary");
    }
  };

  const searchPanelTranslateY = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height + SEARCH_PANEL_EXTRA_HEIGHT, 0],
  });

  const mainContentOpacity = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const handleProfilePress = () => {
    setScreen("Profile");
  };

  const handleNotificationPress = () => {
    setScreen("Notifications");
  };

  const handleCardPress = (cardId: number, level: string) => {
    onCardSelect(cardId, level);
  };

  const renderSearchResult = ({ item }: { item: Word }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleWordSelect(item)}
    >
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultWord}>{item.english}</Text>
        <Text style={styles.searchResultTranslation}>{item.uzbek}</Text>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="#3C5BFF" />
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#3C5BFF" }} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#3C5BFF"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.content}>
        <Animated.View style={[styles.blueContainer, { height: headerHeight }]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.profile}
              onPress={handleProfilePress}
            >
              <Image
                source={require("../../assets/images/profile_img.png")}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>Sherzod</Text>
                <Text style={styles.userId}>ID: {countId}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.coinsContainer}>
              <View style={styles.coins}>
                <FontAwesome5 name="bitcoin" size={20} color="#FFD700" />
                <Text style={styles.coinsText}>100</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notificationContainer}
              onPress={handleNotificationPress}
            >
              <View style={styles.notificationIconWrapper}>
                <View style={styles.notificationIconBackground}>
                  <FontAwesome5 name="bell" size={24} color="white" />
                </View>
                {unreadNotificationsCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadNotificationsCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[styles.backgroundImageContainer, { opacity: imageOpacity }]}
          >
            <Image
              source={require("../../assets/images/main_background.png")}
              style={styles.backgroundImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.searchWrapper,
              { transform: [{ translateY: searchTranslateY }] },
            ]}
          >
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={handleSearchPress}
            >
              <View style={styles.searchInputContainer}>
                <FontAwesome5
                  name="search"
                  size={18}
                  color="#666"
                  style={styles.searchIcon}
                />
                <Text style={[styles.searchInput, { color: "#666" }]}>
                  So'zlarni qidirish
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingTop: INITIAL_HEADER_HEIGHT + 35,
            paddingBottom: 100,
            minHeight: height - STATUSBAR_HEIGHT,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* Level Cards Section */}
          <View style={[styles.levelCardsSection]}>
            <Text style={styles.sectionTitle}>
              O'zingizga mos darsni tanlang
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
            >
              {/* Beginner Card */}
              <TouchableOpacity
                style={styles.levelCard}
                onPress={() => handleCardPress(1, "Beginner")}
              >
                <View style={[styles.levelCircle]}>
                  <Text style={styles.levelNumber}>1</Text>
                </View>
                <Text style={[styles.levelTitle, { fontSize: 14 }]}>
                  Beginner
                </Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.progressFill, { width: "30%" }]} />
                </View>
                <Text style={[styles.progressText, { color: "#3C5BFF" }]}>
                  5/20 ta dars
                </Text>
              </TouchableOpacity>

              {/* Intermediate Card */}
              <TouchableOpacity
                style={[styles.levelCard]}
                onPress={() => handleCardPress(2, "Intermediate")}
              >
                <View style={[styles.levelCircle]}>
                  <Text style={styles.levelNumber}>2</Text>
                </View>
                <Text style={styles.levelTitle}>Medium</Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.progressFill, { width: "15%" }]} />
                </View>
                <Text style={[styles.progressText, { color: "#3C5BFF" }]}>
                  3/20 ta dars
                </Text>
              </TouchableOpacity>

              {/* Advanced Card */}
              <TouchableOpacity
                style={[styles.levelCard]}
                onPress={() => handleCardPress(3, "Advanced")}
              >
                <View style={[styles.levelCircle]}>
                  <Text style={styles.levelNumber}>3</Text>
                </View>
                <Text style={styles.levelTitle}>Advanced</Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.progressFill, { width: "5%" }]} />
                </View>
                <Text style={[styles.progressText, { color: "#3C5BFF" }]}>
                  1/20 ta dars
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Courses Section */}
          <View style={[styles.coursesSection, { paddingTop: 0 }]}>
            <Text style={styles.sectionTitle}>Kurslar</Text>
            <TouchableOpacity style={styles.courseCard}>
              <Image
                source={{
                  uri: "https://picsum.photos/400/300",
                }}
                style={styles.courseCardBg}
                resizeMode="cover"
              />
              <View style={[styles.courseCardOverlay, { opacity: 0.5 }]} />
              <View style={styles.courseCardContent}>
                <Text style={styles.courseCardTitle}>Kurslar</Text>
                <Text style={styles.courseCardSubtitle}>
                  Kurslar bo'limida tajriba orttiring
                </Text>
                <TouchableOpacity style={styles.courseCardButton}>
                  <Text style={styles.courseCardButtonText}>
                    Kurslarga o'tish
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* Onset Word Section */}
          <View style={[styles.coursesSection, { paddingTop: 0 }]}>
            <Text style={styles.sectionTitle}>Onset so'z</Text>
            <TouchableOpacity style={styles.courseCard}>
              <Image
                source={{
                  uri: "https://picsum.photos/400/301",
                }}
                style={styles.courseCardBg}
                resizeMode="cover"
              />
              <View style={[styles.courseCardOverlay, { opacity: 0.5 }]} />
              <View style={styles.courseCardContent}>
                <Text style={styles.courseCardTitle}>Onset so'z</Text>
                <Text style={styles.courseCardSubtitle}>
                  Onset so'z bilan so'z izlang
                </Text>
                <TouchableOpacity style={styles.courseCardButton}>
                  <Text style={styles.courseCardButtonText}>So'z izlash</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* Dictionary Section */}
          <View style={[styles.coursesSection, { paddingTop: 0 }]}>
            <Text style={styles.sectionTitle}>Lug'at</Text>
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => setScreen("Dictionary")}
            >
              <Image
                source={{
                  uri: "https://picsum.photos/400/302",
                }}
                style={styles.courseCardBg}
                resizeMode="cover"
              />
              <View style={[styles.courseCardOverlay, { opacity: 0.5 }]} />
              <View style={styles.courseCardContent}>
                <Text style={styles.courseCardTitle}>Lug'at</Text>
                <Text style={styles.courseCardSubtitle}>
                  Inglizcha va o'zbekcha so'zlarni qidiring
                </Text>
                <TouchableOpacity
                  style={styles.courseCardButton}
                  onPress={() => setScreen("Dictionary")}
                >
                  <Text style={styles.courseCardButtonText}>
                    Lug'atni ochish
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>

        {/* Bottom Navigation */}

        {/* Sliding Search Panel */}
        <Animated.View
          style={[
            styles.searchPanel,
            {
              transform: [{ translateY: searchPanelTranslateY }],
            },
          ]}
        >
          <View style={styles.searchPanelContent}>
            <View style={styles.searchInputWrapper}>
              <FontAwesome5
                name="search"
                size={18}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { flex: 1 }]}
                placeholder="So'zlarni qidirish"
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSubmitSearch}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={handleCloseSearch}
                style={styles.closeButton}
              >
                <FontAwesome5 name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {isSearching && searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                style={styles.searchResultsList}
                contentContainerStyle={styles.searchResultsContent}
              />
            )}

            {isSearching && searchResults.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  Hech qanday natija topilmadi
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C5BFF",
  },
  content: {
    flex: 1,
  },
  blueContainer: {
    width: "100%",
    backgroundColor: "#3C5BFF",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT + 10,
    height: PROFILE_HEIGHT + STATUSBAR_HEIGHT,
    backgroundColor: "#3C5BFF",
    zIndex: 2,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#fff",
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    color: "white",
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  userId: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "Lexend_400Regular",
  },
  coinsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  coins: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinsText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  notificationContainer: {
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
    fontFamily: "Lexend_400Regular",
  },
  backgroundImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    height: 160,
  },
  backgroundImage: {
    width: 320,
    height: undefined,
    aspectRatio: 1.6,
  },
  searchWrapper: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: "hidden",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend_400Regular",
    padding: 0,
  },
  closeButton: {
    padding: 5,
  },
  searchPanel: {
    position: "absolute",
    top: STATUSBAR_HEIGHT,
    left: 0,
    right: 0,
    height: height - STATUSBAR_HEIGHT,
    backgroundColor: "white",
    zIndex: 1000,
  },
  searchPanelContent: {
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingHorizontal: 20,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "rgba(60, 91, 255, 0.08)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(60, 91, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3C5BFF",
  },
  navText: {
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 4,
    fontFamily: "Lexend_400Regular",
  },
  activeNavText: {
    color: "#3C5BFF",
    fontFamily: "Lexend_400Regular",
  },
  levelCardsSection: {
    paddingRight: 0,
    paddingLeft: 20,
    backgroundColor: "white",
    marginBottom: 25,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  levelCard: {
    backgroundColor: "rgba(60, 91, 255, 0.1)",
    borderRadius: 12,
    padding: 25,
    width: 160,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  levelProgressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(60, 91, 255, 0.1)",
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3C5BFF",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lexend_400Regular",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  searchResultsList: {
    marginTop: 10,
    maxHeight: 300,
  },
  searchResultsContent: {
    paddingBottom: 20,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultWord: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#333",
    marginBottom: 4,
  },
  searchResultTranslation: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
    color: "#666",
  },
  notificationIconWrapper: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3C5BFF",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  notificationIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  cardsContainer: {
    paddingRight: 20,
    flexDirection: "row",
  },
  levelCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#3C5BFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  levelNumber: {
    fontSize: 24,
    color: "white",
    fontFamily: "Lexend_400Regular",
    textAlign: "center",
  },
  levelTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Lexend_400Regular",
    marginBottom: 10,
    textAlign: "center",
  },
  coursesSection: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  courseCard: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  courseCardBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  courseCardOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#3C5BFF",
    opacity: 0.85,
  },
  courseCardContent: {
    padding: 20,
    height: "100%",
    justifyContent: "space-between",
  },
  courseCardTitle: {
    fontSize: 24,
    color: "white",
    fontFamily: "Lexend_400Regular",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  courseCardSubtitle: {
    fontSize: 14,
    color: "white",
    fontFamily: "Lexend_400Regular",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  courseCardButton: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 15,
  },
  courseCardButtonText: {
    color: "#3C5BFF",
    fontSize: 13,
    fontFamily: "Lexend_400Regular",
  },
});

export default HomeScreen;
