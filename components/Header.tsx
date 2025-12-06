import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

interface HeaderProps {
  layoutMode: "grid" | "list";
  onLayoutChange: (mode: "grid" | "list") => void;
}

export function Header({ layoutMode, onLayoutChange }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Perristock</Text>
      <View style={styles.layoutToggle}>
        <TouchableOpacity
          style={[
            styles.layoutButton,
            styles.layoutButtonLeft,
            layoutMode === "grid" && styles.layoutButtonActive,
          ]}
          onPress={() => onLayoutChange("grid")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid"
            size={20}
            color={layoutMode === "grid" ? COLORS.white : COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.layoutButton,
            styles.layoutButtonRight,
            layoutMode === "list" && styles.layoutButtonActive,
          ]}
          onPress={() => onLayoutChange("list")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="list"
            size={20}
            color={layoutMode === "list" ? COLORS.white : COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  layoutToggle: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    overflow: "hidden",
  },
  layoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  layoutButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: COLORS.secondary,
  },
  layoutButtonRight: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.secondary,
  },
  layoutButtonActive: {
    backgroundColor: COLORS.primary,
  },
});
