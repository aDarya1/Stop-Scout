import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { useStore } from "../../src/store/useStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleAuthPress = () => {
    if (user) {
      logout();
    } else {
      router.push("/(auth)/login");
    }
  };

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
          headerRight: () => (
            <Pressable onPress={handleAuthPress} style={{ marginRight: 16 }}>
              <Text
                style={{
                  color: Colors[colorScheme].tint,
                  fontWeight: "bold",
                }}
              >
                {user ? "Wyloguj się" : "Zaloguj się"}
              </Text>
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bus" size={24} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
