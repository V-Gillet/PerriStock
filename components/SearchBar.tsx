import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Rechercher un fil..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  searchContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
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
});
