import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Word } from "../../types/lesson";
import { lessonStyles } from "../../styles/LessonStyles";

type MatchStageProps = {
  words: Word[];
  matchedPairs: { english: string; uzbek: string }[];
  selectedEnglishWord: string | null;
  selectedUzbekWord: string | null;
  onSelectEnglish: (english: string) => void;
  onSelectUzbek: (uzbek: string) => void;
};

const MatchStage: React.FC<MatchStageProps> = ({
  words,
  matchedPairs,
  selectedEnglishWord,
  selectedUzbekWord,
  onSelectEnglish,
  onSelectUzbek,
}) => {
  // Already matched words
  const matchedEnglishWords = matchedPairs.map((pair) => pair.english);
  const matchedUzbekWords = matchedPairs.map((pair) => pair.uzbek);

  // Filter out matched words
  const unmatchedEnglishWords = words
    .map((word) => word.english)
    .filter((english) => !matchedEnglishWords.includes(english));

  const unmatchedUzbekWords = words
    .map((word) => word.uzbek)
    .filter((uzbek) => !matchedUzbekWords.includes(uzbek));

  // Shuffle all words for display
  const englishWordsForDisplay = [...unmatchedEnglishWords];
  const uzbekWordsForDisplay = [...unmatchedUzbekWords];

  // Shuffle function - Fisher-Yates algorithm
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={lessonStyles.matchContainer}>
        <View style={{ flexDirection: "row" }}>
          {/* English Words */}
          <View style={lessonStyles.matchColumn}>
            <Text style={lessonStyles.matchColumnTitle}>Inglizcha</Text>
            <ScrollView>
              {/* Display already matched words */}
              {matchedPairs.map((pair, index) => (
                <TouchableOpacity
                  key={`matched-english-${index}`}
                  style={[
                    lessonStyles.matchWordButton,
                    lessonStyles.matchWordButtonMatched,
                  ]}
                  disabled={true}
                >
                  <Text style={lessonStyles.matchWordText}>{pair.english}</Text>
                </TouchableOpacity>
              ))}

              {/* Display unmatched words */}
              {englishWordsForDisplay.map((english, index) => (
                <TouchableOpacity
                  key={`english-${index}`}
                  style={[
                    lessonStyles.matchWordButton,
                    selectedEnglishWord === english &&
                      lessonStyles.matchWordButtonSelected,
                  ]}
                  onPress={() => onSelectEnglish(english)}
                  disabled={!!selectedUzbekWord}
                >
                  <Text style={lessonStyles.matchWordText}>{english}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Uzbek Words */}
          <View style={lessonStyles.matchColumn}>
            <Text style={lessonStyles.matchColumnTitle}>O'zbekcha</Text>
            <ScrollView>
              {/* Display already matched words */}
              {matchedPairs.map((pair, index) => (
                <TouchableOpacity
                  key={`matched-uzbek-${index}`}
                  style={[
                    lessonStyles.matchWordButton,
                    lessonStyles.matchWordButtonMatched,
                  ]}
                  disabled={true}
                >
                  <Text style={lessonStyles.matchWordText}>{pair.uzbek}</Text>
                </TouchableOpacity>
              ))}

              {/* Display unmatched words */}
              {uzbekWordsForDisplay.map((uzbek, index) => (
                <TouchableOpacity
                  key={`uzbek-${index}`}
                  style={[
                    lessonStyles.matchWordButton,
                    selectedUzbekWord === uzbek &&
                      lessonStyles.matchWordButtonSelected,
                  ]}
                  onPress={() => onSelectUzbek(uzbek)}
                  disabled={!!selectedEnglishWord}
                >
                  <Text style={lessonStyles.matchWordText}>{uzbek}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MatchStage;
