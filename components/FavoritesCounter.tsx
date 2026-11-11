// components/FavoritesCounter.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { Stop } from "../src/domain/entities/Stop";
import { Coordinates } from "../src/domain/value-objects/Coordinates";
import { useStore } from "../src/store/useStore";
import { useColorScheme } from "./useColorScheme";

export function FavoritesCounter() {
  const colors = Colors[useColorScheme()];
  const count = useStore((state) => state.favoriteStops.length);
  const addStop = useStore((state) => state.addStop);

  const handleAddMockStop = () => {
    addStop(
      new Stop(
        Date.now(),
        `Przystanek testowy #${count + 1}`,
        new Coordinates(54.352, 18.646),
      ),
    );
  };

  return (
    <View
      style={[
        styles.counterBox,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.counterText, { color: colors.title }]}>
        Zapisane ulubione: {count}
      </Text>

      <TouchableOpacity onPress={handleAddMockStop} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Dodaj testowy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  counterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  counterText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
