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
  View,
} from "react-native";
import DepartureCard from "../../components/DepartureCard";
import { FavoritesCounter } from "../../components/FavoritesCounter";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import { container } from "../../src/di/container";
import { Departure } from "../../src/domain/entities/Departure";
import { Stop } from "../../src/domain/entities/Stop";
import { useStore } from "../../src/store/useStore";

// Wyspiańskiego
const STOP_ID = 2072;
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
  const favoriteStops = useStore((state) => state.favoriteStops);
  const loadFavorites = useStore((state) => state.loadFavorites);
  const addFavoriteOptimistic = useStore(
    (state) => state.addFavoriteOptimistic,
  );
  const removeFavoriteOptimistic = useStore(
    (state) => state.removeFavoriteOptimistic,
  );

  const [stop, setStop] = useState<Stop | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Odjazdy na żywo szybko się starzeją, więc pobieramy je wielokrotnie
  const loadDepartures = useCallback(async () => {
    try {
      setDepartures(await container.liveDeparturesUseCase.execute(STOP_ID));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        // Synchronizujemy przystanki (pobieramy, jeśli baza jest pusta)
        const stops = await container.syncStopsUseCase.execute();
        setStop(stops.find((s) => s.stopId === STOP_ID) ?? null);

        await loadDepartures();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadData();

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

      {stop ? (
        <View style={styles.stopRow}>
          <Text style={[styles.stopName, { color: colors.subtext }]}>
            Przystanek: {stop.stopName}
          </Text>
          <Pressable onPress={handleToggleFavorite} hitSlop={12}>
            <FontAwesome
              name={isFavorite ? "star" : "star-o"}
              size={26}
              color="#F59E0B"
            />
          </Pressable>
        </View>
      ) : null}

      <FavoritesCounter />

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
    marginBottom: 16,
  },
  stopName: {
    flex: 1,
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
