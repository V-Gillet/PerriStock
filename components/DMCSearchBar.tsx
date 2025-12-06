import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDMCThreads } from "../app/hooks/useDMCThreads";
import { DMCThread } from "../app/services/database.service";

interface DMCSearchBarProps {
  onSelectThread: (thread: DMCThread) => void;
  excludeIds?: number[]; // IDs of threads already in stock
}

export function DMCSearchBar({
  onSelectThread,
  excludeIds = [],
}: DMCSearchBarProps) {
  const { dmcThreads, loading, searchDMCThreads } = useDMCThreads();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      await searchDMCThreads(query);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectThread = (thread: DMCThread) => {
    onSelectThread(thread);
    setSearchQuery("");
    setShowResults(false);
  };

  const filteredThreads = dmcThreads.filter(
    (thread) => !excludeIds.includes(thread.id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Rechercher par nom, numéro DMC ou couleur hex..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setShowResults(false);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}

      {showResults && filteredThreads.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredThreads}
            keyExtractor={(item) => item.id.toString()}
            maxToRenderPerBatch={10}
            windowSize={5}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectThread(item)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.colorSwatch, { backgroundColor: item.hex }]}
                />
                <View style={styles.threadInfo}>
                  <View style={styles.threadHeader}>
                    <Text style={styles.dmcId}>DMC {item.dmcId}</Text>
                    <Text style={styles.hexColor}>{item.hex}</Text>
                  </View>
                  <Text style={styles.threadName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.rgbValues}>
                    RGB: {item.r}, {item.g}, {item.b}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {showResults &&
        !loading &&
        filteredThreads.length === 0 &&
        dmcThreads.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={32} color="#cccccc" />
            <Text style={styles.noResultsText}>
              Aucun fil trouvé pour &ldquo;{searchQuery}&rdquo;
            </Text>
            <Text style={styles.noResultsHint}>
              Essayez avec un nom, numéro DMC ou code hex
            </Text>
          </View>
        )}

      {showResults && filteredThreads.length === 0 && dmcThreads.length > 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Tous les fils trouvés sont déjà dans votre stock
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 300,
    overflow: "hidden",
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  threadInfo: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  dmcId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  hexColor: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
    fontFamily: "monospace",
  },
  threadName: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 2,
  },
  rgbValues: {
    fontSize: 11,
    color: "#999999",
    fontFamily: "monospace",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 12,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
  },
  noResultsHint: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
    textAlign: "center",
  },
});
