import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Odjazdy",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bus" size={24} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="map" size={24} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
