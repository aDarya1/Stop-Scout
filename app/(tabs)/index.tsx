// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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

// Dworzec Główny
const STOP_ID = 2072;

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];

  const user = useStore((state) => state.user);
  const favoriteStops = useStore((state) => state.favoriteStops);
  const logout = useStore((state) => state.logout);
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Synchronizujemy przystanki (pobieramy, jeśli baza jest pusta)
        const stops = await container.syncStopsUseCase.execute();
        setStop(stops.find((s) => s.stopId === STOP_ID) ?? null);

        // 2. Pobieramy odjazdy na żywo dla wybranego przystanku
        const liveDepartures =
          await container.liveDeparturesUseCase.execute(STOP_ID);

        setDepartures(liveDepartures);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Błąd podczas pobierania danych",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Po zalogowaniu wczytujemy zapisane ulubione przystanki z SQLite
  useEffect(() => {
    loadFavorites(container.stopRepository).catch(console.error);
  }, [user, loadFavorites]);

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

  const handleAuthPress = () => {
    if (user) {
      logout();
    } else {
      router.push("/(auth)/login");
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
        <Text style={[styles.stopName, { color: colors.subtext }]}>
          {stop.stopName}
        </Text>
      ) : null}

      <TouchableOpacity onPress={handleAuthPress} style={styles.authButton}>
        <Text style={styles.authButtonText}>
          {user ? "Wyloguj się" : "Przejdź do logowania (Auth)"}
        </Text>
      </TouchableOpacity>

      <FavoritesCounter />

      {stop ? (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteActive,
          ]}
        >
          <Text style={styles.authButtonText}>
            {isFavorite
              ? "Usuń przystanek z ulubionych"
              : "Dodaj przystanek do ulubionych"}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Pokazujemy wskaźnik ładowania albo tekst błędu */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
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
    marginBottom: 4,
  },
  stopName: {
    fontSize: 14,
    marginBottom: 16,
  },
  authButton: {
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  authButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  favoriteButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  favoriteActive: {
    backgroundColor: "#DC2626",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
