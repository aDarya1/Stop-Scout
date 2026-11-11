// app/(tabs)/profile.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavoritesCounter } from "../../components/FavoritesCounter";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import { container } from "../../src/di/container";
import { useStore } from "../../src/store/useStore";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];

  const user = useStore((state) => state.user);
  const username = useStore((state) => state.username);
  const favoriteStops = useStore((state) => state.favoriteStops);
  const logout = useStore((state) => state.logout);
  const selectStop = useStore((state) => state.selectStop);
  const removeFavoriteOptimistic = useStore(
    (state) => state.removeFavoriteOptimistic,
  );

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.screenBackground },
        ]}
      >
        <FontAwesome name="user-circle" size={64} color={colors.subtext} />
        <Text style={[styles.guestText, { color: colors.subtext }]}>
          Zaloguj się, aby zapisywać ulubione przystanki.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.primaryButton}
        >
          <Text style={styles.buttonText}>Zaloguj się lub zarejestruj</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleOpenStop = (stopId: number) => {
    selectStop(stopId);
    router.navigate("/");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.screenBackground }]}
    >
      <View
        style={[
          styles.userCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View>
          <Text style={[styles.label, { color: colors.subtext }]}>
            Zalogowano jako
          </Text>
          <Text style={[styles.username, { color: colors.title }]}>
            {username}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Wyloguj się</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.title }]}>
        Ulubione przystanki
      </Text>

      <FlatList
        data={favoriteStops}
        keyExtractor={(item) => String(item.stopId)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleOpenStop(item.stopId)}
            style={[
              styles.row,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowInfo}>
              <Text style={[styles.stopName, { color: colors.title }]}>
                {item.stopName}
              </Text>
              <Text style={[styles.label, { color: colors.subtext }]}>
                nr {item.stopId}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                removeFavoriteOptimistic(item.stopId, container.stopRepository)
              }
              hitSlop={12}
            >
              <FontAwesome name="trash" size={22} color="#DC2626" />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Nie masz jeszcze ulubionych przystanków. Dotknij gwiazdki na
            ekranie odjazdów.
          </Text>
        }
        ListFooterComponent={
          <View style={styles.demo}>
            <Text style={[styles.label, { color: colors.subtext }]}>
              Demo licznika (nie zapisuje w bazie)
            </Text>
            <FavoritesCounter />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  guestText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  rowInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
  },
  demo: {
    marginTop: 24,
  },
});
