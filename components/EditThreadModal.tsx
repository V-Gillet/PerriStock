import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StockThread } from "../app/services/database.service";
import { COLORS } from "../constants/Colors";

interface EditThreadModalProps {
  visible: boolean;
  thread: StockThread | null;
  onClose: () => void;
  onSave: (
    id: number,
    updates: { quantity?: number; notes?: string }
  ) => Promise<void>;
}

export function EditThreadModal({
  visible,
  thread,
  onClose,
  onSave,
}: EditThreadModalProps) {
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (thread) {
      setQuantity(thread.quantity.toString());
      setNotes(thread.notes || "");
    }
  }, [thread]);

  const handleSave = async () => {
    if (!thread) return;

    try {
      setSaving(true);
      const updates: { quantity?: number; notes?: string } = {};

      const parsedQuantity = parseInt(quantity);
      if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
        updates.quantity = parsedQuantity;
      }

      updates.notes = notes.trim() || "";

      await onSave(thread.id, updates);
      onClose();
    } catch (err) {
      console.error("Error saving thread:", err);
    } finally {
      setSaving(false);
    }
  };

  const incrementQuantity = () => {
    const current = parseInt(quantity) || 0;
    setQuantity((current + 1).toString());
  };

  const decrementQuantity = () => {
    const current = parseInt(quantity) || 0;
    if (current > 0) {
      setQuantity((current - 1).toString());
    }
  };

  if (!thread) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le fil</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.threadPreview}>
              <View
                style={[styles.colorSwatch, { backgroundColor: thread.hex }]}
              />
              <View style={styles.threadPreviewInfo}>
                <Text style={styles.dmcId}>DMC {thread.dmcId}</Text>
                <Text style={styles.threadName}>{thread.name}</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantité (écheveaux)</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                >
                  <Ionicons name="remove" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.text.tertiary}
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Ionicons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optionnel)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={COLORS.text.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Ajouter une note..."
                  placeholderTextColor={COLORS.text.tertiary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Text style={styles.saveButtonText}>Enregistrement...</Text>
                ) : (
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(115, 74, 31, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: "90%",
    maxWidth: 500,
    maxHeight: "85%",
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  threadPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  threadPreviewInfo: {
    flex: 1,
  },
  dmcId: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 2,
  },
  threadName: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 12,
    backgroundColor: COLORS.white,
  },
  quantityInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text.primary,
    textAlign: "center",
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
