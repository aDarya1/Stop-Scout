// app/search.tsx
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useColorScheme } from "../components/useColorScheme";
import Colors from "../constants/Colors";
import { container } from "../src/di/container";
import { Stop } from "../src/domain/entities/Stop";
import { useStore } from "../src/store/useStore";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 50;

// "Łostowice" -> "lostowice", żeby szukać można było bez polskich znaków
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function SearchScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];
  const selectStop = useStore((state) => state.selectStop);

  const [stops, setStops] = useState<Stop[]>([]);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    container.syncStopsUseCase
      .execute()
      .then(setStops)
      .catch(() => setLoadError(true));
  }, []);

  // Nazwy normalizujemy raz, a nie przy każdym wpisanym znaku
  const searchIndex = useMemo(
    () => stops.map((stop) => ({ stop, key: normalize(stop.stopName) })),
    [stops],
  );

  const results = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (normalizedQuery.length < MIN_QUERY_LENGTH) return [];

    return searchIndex
      .filter((item) => item.key.includes(normalizedQuery))
      .slice(0, MAX_RESULTS)
      .map((item) => item.stop)
      .sort((a, b) => a.stopName.localeCompare(b.stopName, "pl"));
  }, [query, searchIndex]);

  const handleSelect = (stop: Stop) => {
    selectStop(stop.stopId);
    router.back();
  };

  const hintText = loadError
    ? "Nie udało się wczytać listy przystanków."
    : query.trim().length < MIN_QUERY_LENGTH
      ? `Wpisz co najmniej ${MIN_QUERY_LENGTH} litery nazwy przystanku.`
      : "Nie znaleziono przystanków.";

  return (
    <FlatList
      style={{ backgroundColor: colors.screenBackground }}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      data={results}
      keyExtractor={(item) => String(item.stopId)}
      ListHeaderComponent={
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.title,
            },
          ]}
          placeholder="Nazwa przystanku, np. Dworzec Główny"
          placeholderTextColor={colors.subtext}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleSelect(item)}
          style={[
            styles.row,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stopName, { color: colors.title }]}>
            {item.stopName}
          </Text>
          <Text style={[styles.stopId, { color: colors.subtext }]}>
            nr {item.stopId}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={[styles.hint, { color: colors.subtext }]}>{hintText}</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  stopName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  stopId: {
    fontSize: 12,
  },
  hint: {
    textAlign: "center",
    marginTop: 20,
  },
});
