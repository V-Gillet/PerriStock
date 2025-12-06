import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StockThread } from "../app/services/database.service";
import { COLORS } from "../constants/Colors";
import { ActionSheet } from "./ActionSheet";
import { ConfirmDialog } from "./ConfirmDialog";

interface ThreadCardProps {
  thread: StockThread;
  onPress?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
  layout?: "grid" | "list";
}

export function ThreadCard({
  thread,
  onPress,
  onDelete,
  onUpdate,
  layout = "grid",
}: ThreadCardProps) {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLongPress = () => {
    setShowActionSheet(true);
  };

  const handleDelete = () => {
    setShowActionSheet(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const handleUpdate = () => {
    setShowActionSheet(false);
    onUpdate?.();
  };

  const cardStyle = layout === "list" ? styles.cardList : styles.cardGrid;
  const swatchStyle =
    layout === "list" ? styles.colorSwatchList : styles.colorSwatchGrid;

  return (
    <>
      <TouchableOpacity
        style={cardStyle}
        activeOpacity={0.7}
        onPress={onPress}
        onLongPress={handleLongPress}
      >
        <View style={[swatchStyle, { backgroundColor: thread.hex }]}></View>

        <View style={styles.threadInfo}>
          <View style={styles.threadHeader}>
            <Text style={styles.threadDMCId}>DMC {thread.dmcId}</Text>
            {layout === "list" && (
              <Text style={styles.hexCode}>{thread.hex}</Text>
            )}
          </View>

          <Text
            style={styles.threadName}
            numberOfLines={layout === "list" ? 1 : 2}
          >
            {thread.name}
          </Text>

          <View style={styles.threadStats}>
            <View style={styles.statItem}>
              <Ionicons name="albums" size={14} color={COLORS.text.secondary} />
              <Text style={styles.threadDetail}>{thread.quantity}</Text>
            </View>
          </View>

          {thread.notes && layout === "grid" && (
            <Text style={styles.threadNotes} numberOfLines={2}>
              {thread.notes}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <ActionSheet
        visible={showActionSheet}
        title={`DMC ${thread.dmcId}`}
        subtitle={thread.name}
        color={thread.hex}
        onClose={() => setShowActionSheet(false)}
        actions={[
          {
            label: "Modifier",
            icon: "create-outline",
            onPress: handleUpdate,
          },
          {
            label: "Supprimer",
            icon: "trash-outline",
            onPress: handleDelete,
            destructive: true,
          },
        ]}
      />

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Supprimer ce fil ?"
        message={`Êtes-vous sûr de vouloir supprimer ${thread.name} de votre stock ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        destructive
      />
    </>
  );
}

const styles = StyleSheet.create({
  // Grid layout (48% width, vertical)
  cardGrid: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  // List layout (full width, horizontal)
  cardList: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  colorSwatchGrid: {
    width: "100%",
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    position: "relative",
  },
  colorSwatchList: {
    width: 80,
    height: "100%",
    minHeight: 100,
    borderRightWidth: 1,
    borderRightColor: COLORS.secondary,
    position: "relative",
  },
  lowStockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  threadInfo: {
    padding: 12,
    flex: 1,
  },
  threadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  threadDMCId: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  hexCode: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.text.tertiary,
    fontFamily: "monospace",
  },
  threadName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  threadStats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  threadDetail: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  threadNotes: {
    fontSize: 11,
    color: COLORS.text.tertiary,
    fontStyle: "italic",
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(115, 74, 31, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  destructiveButton: {
    backgroundColor: COLORS.error,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    borderTopWidth: 2,
    borderColor: COLORS.secondary,
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  lastActionButton: {
    borderBottomWidth: 0,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    flex: 1,
  },
  destructiveLabel: {
    color: COLORS.error,
  },
  cancelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
