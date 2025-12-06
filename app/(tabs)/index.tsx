import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ThreadCard } from "@/components/ThreadCard";
import { AddThreadModal } from "@/components/AddThreadModal";
import { EditThreadModal } from "@/components/EditThreadModal";
import { Ionicons } from "@expo/vector-icons";
import { useThreads } from "../hooks/useThreads";
import { DMCThread, StockThread } from "../services/database.service";
import { COLORS } from "../../constants/Colors";

export default function HomeScreen() {
  const {
    threads,
    loading,
    error,
    addThread,
    updateThread,
    deleteThread,
    searchThreads,
  } = useThreads();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<StockThread | null>(
    null
  );
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchThreads(searchQuery);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, searchThreads]);

  const handleUpdateThread = async (
    id: number,
    updates: { quantity?: number; notes?: string }
  ) => {
    try {
      await updateThread(id, updates);
    } catch (err) {
      console.error("Error updating thread:", err);
    }
  };

  const handleDeleteThread = async (id: number) => {
    try {
      await deleteThread(id);
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  const handleSelectDMCThread = async (dmcThread: DMCThread) => {
    try {
      await addThread(dmcThread.id, 1, "");
    } catch (err) {
      console.error("Error adding thread:", err);
    }
  };

  const handleOpenEditModal = (thread: StockThread) => {
    setSelectedThread(thread);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedThread(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header layoutMode={layoutMode} onLayoutChange={setLayoutMode} />

      <View style={styles.contentWrapper}>
        <View style={styles.maxWidthContainer}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {threads.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="albums-outline"
                size={64}
                color={COLORS.secondary}
              />
              <Text style={styles.emptyText}>
                {searchQuery ? "Aucun fil trouvé" : "Votre stock est vide"}
              </Text>
              <Text style={styles.emptySubText}>
                {searchQuery
                  ? "Essayez une autre recherche"
                  : "Appuyez sur + pour ajouter votre premier fil"}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={
                  layoutMode === "grid" ? styles.threadGrid : styles.threadList
                }
              >
                {threads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    layout={layoutMode}
                    onDelete={() => handleDeleteThread(thread.id)}
                    onUpdate={() => handleOpenEditModal(thread)}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      <AddThreadModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectThread={handleSelectDMCThread}
        excludeIds={threads.map((t) => t.dmcThreadId)}
      />

      <EditThreadModal
        visible={isEditModalOpen}
        thread={selectedThread}
        onClose={handleCloseEditModal}
        onSave={handleUpdateThread}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  maxWidthContainer: {
    flex: 1,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  scrollView: {
    flex: 1,
  },
  threadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 80,
  },
  threadList: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.secondary,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
  },
});
