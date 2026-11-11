// app/(tabs)/index.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DepartureCard from "../../components/DepartureCard";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import { container } from "../../src/di/container";
import { Departure } from "../../src/domain/entities/Departure";
import { Stop } from "../../src/domain/entities/Stop";
import { useStore } from "../../src/store/useStore";

const REFRESH_INTERVAL_MS = 30000;

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Błąd podczas pobierania danych";
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];

  const user = useStore((state) => state.user);
  const selectedStopId = useStore((state) => state.selectedStopId);
  const favoriteStops = useStore((state) => state.favoriteStops);
  const loadFavorites = useStore((state) => state.loadFavorites);
  const addFavoriteOptimistic = useStore(
    (state) => state.addFavoriteOptimistic,
  );
  const removeFavoriteOptimistic = useStore(
    (state) => state.removeFavoriteOptimistic,
  );

  const [stops, setStops] = useState<Stop[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = stops.find((s) => s.stopId === selectedStopId) ?? null;

  // Przystanki synchronizujemy raz (pobieramy, jeśli baza jest pusta)
  useEffect(() => {
    container.syncStopsUseCase
      .execute()
      .then(setStops)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  // Odjazdy na żywo szybko się starzeją, więc pobieramy je wielokrotnie
  const loadDepartures = useCallback(async () => {
    try {
      setDepartures(
        await container.liveDeparturesUseCase.execute(selectedStopId),
      );
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [selectedStopId]);

  useEffect(() => {
    setLoading(true);
    loadDepartures().finally(() => setLoading(false));

    const timer = setInterval(loadDepartures, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [loadDepartures]);

  // Po zalogowaniu wczytujemy zapisane ulubione przystanki z SQLite
  useEffect(() => {
    loadFavorites(container.stopRepository).catch(console.error);
  }, [user, loadFavorites]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDepartures();
    setRefreshing(false);
  };

  const isFavorite = stop !== null && favoriteStops.some((s) => s.equals(stop));

  const handleToggleFavorite = () => {
    if (!stop) return;
    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    if (isFavorite) {
      removeFavoriteOptimistic(stop.stopId, container.stopRepository);
    } else {
      addFavoriteOptimistic(stop, container.stopRepository);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.screenBackground }]}
    >
      <Text style={[styles.header, { color: colors.title }]}>
        Najbliższe odjazdy (ZTM Gdańsk)
      </Text>

      <View style={styles.stopRow}>
        <Text style={[styles.stopName, { color: colors.subtext }]}>
          Przystanek: {stop ? stop.stopName : `nr ${selectedStopId}`}
        </Text>
        <Pressable onPress={handleToggleFavorite} hitSlop={12}>
          <FontAwesome
            name={isFavorite ? "star" : "star-o"}
            size={26}
            color="#F59E0B"
          />
        </Pressable>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/search")}
        style={[styles.changeButton, { borderColor: colors.border }]}
      >
        <Text style={[styles.changeButtonText, { color: colors.title }]}>
          Zmień przystanek
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={departures}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DepartureCard
              routeId={item.routeNumber.value}
              headsign={item.headsign}
              theoreticalTime={item.theoreticalTime}
              delayInSeconds={item.delay.seconds}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                error ? styles.errorText : { color: colors.subtext },
              ]}
            >
              {error ?? "Brak odjazdów w najbliższym czasie."}
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stopName: {
    flex: 1,
    fontSize: 14,
  },
  changeButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  changeButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
  },
});
