// app/(tabs)/index.tsx
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DepartureCard from "../../components/DepartureCard";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

export default function HomeScreen() {
  const colors = Colors[useColorScheme()];

  const [departures] = useState([
    {
      id: "1",
      routeId: 9,
      headsign: "Strzyża PKM",
      theoreticalTime: "19:09",
      delayInSeconds: 12,
    },
    {
      id: "2",
      routeId: 2,
      headsign: "Jelitkowo",
      theoreticalTime: "19:15",
      delayInSeconds: 0,
    },
    {
      id: "3",
      routeId: 12,
      headsign: "Ujeścisko",
      theoreticalTime: "19:22",
      delayInSeconds: 150,
    },
    {
      id: "4",
      routeId: 6,
      headsign: "Łostowice Świętokrzyska",
      theoreticalTime: "19:27",
      delayInSeconds: null,
    },
    {
      id: "5",
      routeId: 8,
      headsign: "Stogi Plaża",
      theoreticalTime: "19:31",
      delayInSeconds: 45,
    },
    {
      id: "6",
      routeId: 10177,
      headsign: "Brętowo PKM",
      theoreticalTime: "19:36",
      delayInSeconds: 210,
    },
    {
      id: "7",
      routeId: 11,
      headsign: "Lawendowe Wzgórze",
      theoreticalTime: "19:42",
      delayInSeconds: 0,
    },
    {
      id: "8",
      routeId: "N3",
      headsign: "Dworzec Główny",
      theoreticalTime: "23:50",
      delayInSeconds: 130,
    },
    {
      id: "9",
      routeId: 15,
      headsign: "Brzeźno",
      theoreticalTime: "19:48",
      delayInSeconds: 0,
    },
  ]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.screenBackground }]}
    >
      <Text style={[styles.header, { color: colors.title }]}>Najbliższe odjazdy (Mock)</Text>

      <FlatList
        data={departures}
        keyExtractor={(item) => item.id}
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
});
