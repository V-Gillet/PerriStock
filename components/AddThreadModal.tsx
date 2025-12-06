import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DMCSearchBar } from "./DMCSearchBar";
import { DMCThread } from "../app/services/database.service";
import { COLORS } from "../constants/Colors";

interface AddThreadModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectThread: (thread: DMCThread) => void;
  excludeIds?: number[];
}

export function AddThreadModal({
  visible,
  onClose,
  onSelectThread,
  excludeIds = [],
}: AddThreadModalProps) {
  const handleSelectThread = (thread: DMCThread) => {
    onSelectThread(thread);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter un fil</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <DMCSearchBar
            onSelectThread={handleSelectThread}
            excludeIds={excludeIds}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    maxHeight: "80%",
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
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
