// components/DepartureCard.tsx
import { StyleSheet, Text, View } from "react-native";
import { RouteNumber } from "../src/domain/value-objects/RouteNumber";
import Colors from "../constants/Colors";
import { DelayHighlight } from "./DelayHighlight";
import { useColorScheme } from "./useColorScheme";

interface DepartureCardProps {
  routeId: number | string;
  headsign: string;
  theoreticalTime: string;
  delayInSeconds: number | null;
}

export default function DepartureCard({
  routeId,
  headsign,
  theoreticalTime,
  delayInSeconds,
}: DepartureCardProps) {
  const colors = Colors[useColorScheme()];
  const routeNumber = new RouteNumber(routeId);

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View
        style={[styles.routeBadge, { backgroundColor: colors.badgeBackground }]}
      >
        <Text style={[styles.routeText, { color: colors.badgeText }]}>
          {routeNumber.value}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.headsign, { color: colors.headsign }]}>
          {headsign}
        </Text>
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: colors.subtext }]}>
            Planowo: {theoreticalTime} •{" "}
          </Text>
          <DelayHighlight delayInSeconds={delayInSeconds} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    marginBottom: 12,
  },
  routeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  routeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  headsign: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
  },
});
