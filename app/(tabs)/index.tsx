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

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];

  // Состояния для данных и загрузки
  const [departures, setDepartures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Синхронизируем остановки (скачаем, если база пуста)
        await container.syncStopsUseCase.execute();

        // 2. Запрашиваем живые отъезды для остановки 2072 (Dworzec Główny)
        const liveDepartures =
          await container.getLiveDeparturesUseCase.execute(2072);

        setDepartures(liveDepartures);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Błąd podczas pobierania danych");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.screenBackground }]}
    >
      <Text style={[styles.header, { color: colors.title }]}>Najbliższe odjazdy (ZTM Gdańsk)</Text>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={styles.authButton}
      >
        <Text style={styles.authButtonText}>Przejdź do logowania (Auth)</Text>
      </TouchableOpacity>

      <FavoritesCounter />

      {/* Показываем индикатор загрузки или текст ошибки */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={departures}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <DepartureCard
              routeId={item.routeId}
              headsign={item.headsign}
              theoreticalTime={item.theoreticalTime}
              delayInSeconds={item.delayInSeconds}
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
});
